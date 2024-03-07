from flask import Flask, request, jsonify, make_response, abort
import requests
import json
import paramiko
import re
import psycopg2
import psycopg2.extras
from functools import wraps
from flask_cors import CORS

OPENSTACK_CLOUDFORMATION_URL = "http://10.1.223.4:8000/v1"
OPENSTACK_COMPUTE_URL	= "http://10.1.223.4:8774/v2.1"
OPENSTACK_IDENTITY_URL = "http://10.1.223.4:5000/v3"
OPENSTACK_IMAGE_URL = "http://10.1.223.4:9292/v2"
OPENSTACK_NETWORK_URL	= "http://10.1.223.4:9696"
OPENSTACK_ORCHESTRATION_URL = "http://10.1.223.4:8004/v1/3e318c28570a46ecbbf43ff50a32e12a"
OPENSTACK_PLACEMENT_URL = "http://10.1.223.4:8780"
OPENSTACK_VOLUMEV3_URL = "http://10.1.223.4:8776/v3"

ADMIN_ROLE_ID = "eefd3759c9664d718cc89d69781c975c"
HEAT_STACK_OWNER_ROLE_ID = "a01e9be1e02049908c3e77b922fc8dc3"
HEAT_STACK_USER_ROLE_ID = "be85dc8ae202414e8b64b54fa5e77a0d"
MANAGER_ROLE_ID = "91b01030673f40bd872c64631459e876"
MEMBER_ROLE_ID = "2ee48682eaaa4a1cbb53bdcb0a5e73e6"
READER_ROLE_ID = "ef61fe1055874f23b3901b2455d93a39"
SERVICE_ROLE_ID = "fe3481417c91463bb44a709d6e89e22a"
NETWORK_UUID = "7a40c850-a9f9-43d5-b072-1c19cd0a650f"


app = Flask(__name__)
CORS(app)
"""
TODO: General
Use DAPR in front of Flask
Need to make sure right credentials are used for authentification with openstack and things deployed under the right account.
"""
# TODO: API to Submit deployment request to Temporal

####################### General #########################

# checks for required fields in body
def require_data(*expected_args): 
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if not request.json:
                return jsonify({
                    'error': 'Request missing body data', 
                    'message': {
                        'error': {
                            'code': 400, 
                            'message': 'A valid JSON message body is required.', 
                            'title': 'Bad Request'
                        }
                    }
                }), 400
            for expected_arg in expected_args:
                if expected_arg not in request.json:
                    return jsonify({
                        'error': 'Missing argument in request data', 
                        'message': {
                            'error': {
                                'code': 400, 
                                'message': f'Missing {expected_arg} in request body.', 
                                'title': 'Bad Request'
                            }
                        }
                    }), 400
            return f(*args, **kwargs)
        return wrapper
    return decorator



# returns admin token for admin tasks, SHOULD NOT BE PASSED TO UI
def getAdminToken():
    url = "http://10.1.223.4:5000/v3/auth/tokens"
    password = "leUBjNfcPror7D2w74K9SuuF8uu561B0cUiSyRcA"
    admin_username = "admin"
    # Replace 'your_auth_token' with the actual authentication token you want to use
    auth_data = {
        "auth": {
            "identity": {
                "methods": [
                    "password"
                ],
                "password": {
                    "user": {
                        "name": admin_username,
                        "domain": {
                            "name": "Default",
                            "id": "default"
                        },
                        "password": password
                    },
                }
            },
            "scope": {
                "system": {
                    "all": True
                }
            }
        }
    }
        
    # Send the authentication request to OpenStack Keystone
    response = requests.post(url,
                            json=auth_data,
                            headers={'Content-Type': 'application/json'})
    return response.headers.get('X-Subject-Token')



####################### Login/New User #########################

# Creates project and return details
def createProjectForNewUser(project_name):
    url = "http://10.1.223.4:5000/v3/projects"

    headers = {
        'X-Auth-Token': getAdminToken()
    }
    
    body = {
        "project": {
            "description": "My new project",
            "domain_id": "default",
            "enabled": True,
            "is_domain": False,
            "name": project_name,
            "options": {}
        }
    }
    # Send the authentication request to OpenStack Keystone
    response = requests.post(url,
                            json=body,
                            headers=headers)
    if response.ok:
        # Extract the token from the response headers
        projects = response.json()
        return projects, 200
    else:
        # If the authentication request was unsuccessful, return an error

        return response.json(), 401

# Put request to assign Manager role to the user on specific project
def assignAdminRoleForProject(project_id, user_id):
    url = f"http://10.1.223.4:5000/v3/projects/{project_id}/users/{user_id}/roles/{MANAGER_ROLE_ID}"

    headers = {
        'X-Auth-Token': getAdminToken()
    }
    

    # Send the authentication request to OpenStack Keystone
    response = requests.put(url,
                            headers=headers)
    
    if response.ok:
        with open('path/filename.json', 'r') as json_file:
            data = json.load(json_file)
        return response, 200
    else:
        # If the authentication request was unsuccessful, return an error
        return jsonify({'error': response.json()}), 401


@app.route('/login', methods=['POST'])
@require_data('username', 'password')
def login():
    with open('api/responses/login.json', 'r') as json_file:
            data = json.load(json_file)
    return data, 200

# NOT A REAL ENDPOINT, EXISTS ONLY FOR TESTS
@app.route('/login_error', methods=['POST'])
@require_data('username', 'password')
def login_error():
    with open('api/responses/login_error.json', 'r') as json_file:
            data = json.load(json_file)
    return data, 401
"""
This reuqest creates user using admin's token. 
"""
@app.route('/create_user', methods=['POST'])
@require_data('username', 'password', 'email')
def create_user():
    with open('api/responses/create_account.json', 'r') as json_file:
            data = json.load(json_file)
    return data, 200

# NOT A REAL ENDPOINT, EXISTS ONLY FOR TESTS
@app.route('/create_user_error', methods=['POST'])
@require_data('username', 'password', 'email')
def create_user_error():
    with open('api/responses/create_account_error.json', 'r') as json_file:
            data = json.load(json_file)
    return data, 409

####################### Profile #########################
    
@app.route('/profile/<user_id>', methods=['GET'])
def get_user_profile(user_id):

    auth_token = request.headers.get('X-Auth-Token')

    headers = {
        'X-Auth-Token': auth_token
    }
    if auth_token:
        with open('api/responses/profile_user_id.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 200
    else:
        with open('api/responses/login_error.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 409



####################### Deploy VMs #########################
    

@app.route('/create_server', methods=['POST'])
@require_data('name', 'key_name', 'flavorRef', 'imageRef')
def create_new_server():

    auth_token = request.headers.get('X-Auth-Token')

    headers = {
        'X-Auth-Token': auth_token
    }
    if auth_token:
        with open('api/responses/create_server.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 200
    else:
        with open('api/responses/login_error.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 409


@app.route('/get_images', methods=['GET'])
def get_user_images():

    auth_token = request.headers.get('X-Auth-Token')

    headers = {
        'X-Auth-Token': auth_token
    }
    if auth_token:
        with open('api/responses/get_images.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 200
    else:
        with open('api/responses/login_error.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 409
         


@app.route('/get_flavors', methods=['GET'])
def get_user_flavors():

    auth_token = request.headers.get('X-Auth-Token')

    headers = {
        'X-Auth-Token': auth_token
    }
    if auth_token:
        with open('api/responses/get_flavors.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 200
    else:
        with open('api/responses/login_error.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 409

@app.route('/get_key_pairs', methods=['GET'])
def get_key_pairs():
    
    auth_token = request.headers.get('X-Auth-Token')

    headers = {
        'X-Auth-Token': auth_token
    }
    if auth_token:
        with open('api/responses/get_key_pairs.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 200
    else:
        with open('api/responses/login_error.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 409
### Manage VMs ###

@app.route('/servers', methods=['GET'])
def get_user_servers():

    auth_token = request.headers.get('X-Auth-Token')

    headers = {
        'X-Auth-Token': auth_token
    }
    if auth_token:
        with open('api/responses/servers.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 200
    else:
        with open('api/responses/login_error.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 409
    

@app.route('/servers/<server_id>', methods=['GET'])
def get_server_details(server_id):

    auth_token = request.headers.get('X-Auth-Token')

    headers = {
        'X-Auth-Token': auth_token
    }
    if auth_token:
        with open('api/responses/servers_server_id.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 200
    else:
        with open('api/responses/login_error.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 409
    

@app.route('/servers/<server_id>/action', methods=['POST'])
def action_server(server_id):

    auth_token = request.headers.get('X-Auth-Token')

    headers = {
        'X-Auth-Token': auth_token
    }
    if auth_token:
        with open('api/responses/servers_actions_including_delete.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 200
    else:
        with open('api/responses/login_error.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 409
    

@app.route('/servers/<server_id>', methods=['DELETE'])
def delete_server(server_id):

    auth_token = request.headers.get('X-Auth-Token')

    headers = {
        'X-Auth-Token': auth_token
    }
    if auth_token:
        with open('api/responses/delete_and_action.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 200
    else:
        with open('api/responses/login_error.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 409


####################### Deploy Volumes #########################

@app.route('/<project_id>/create_volume', methods=['POST'])
@require_data('name', 'size', 'description')
def create_new_volume(project_id):

    auth_token = request.headers.get('X-Auth-Token')

    headers = {
        'X-Auth-Token': auth_token
    }
    if auth_token:
        with open('api/responses/create_volume.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 200
    else:
        with open('api/responses/login_error.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 409
    

### Manage Volumes ###

@app.route('/<project_id>/volumes', methods=['GET'])
def get_user_volumes(project_id):

    auth_token = request.headers.get('X-Auth-Token')

    headers = {
        'X-Auth-Token': auth_token
    }
    if auth_token:
        with open('api/responses/list_volumes.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 200
    else:
        with open('api/responses/login_error.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 409
    

@app.route('/<project_id>/volumes/<volume_id>', methods=['GET'])
def get_volume_detail(project_id,volume_id):

    auth_token = request.headers.get('X-Auth-Token')

    headers = {
        'X-Auth-Token': auth_token
    }
    if auth_token:
        with open('api/responses/volume_details.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 200
    else:
        with open('api/responses/login_error.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 409
    

@app.route('/<project_id>/volumes/<volume_id>', methods=['DELETE'])
def delete_volume_detail(project_id,volume_id):


    auth_token = request.headers.get('X-Auth-Token')

    headers = {
        'X-Auth-Token': auth_token
    }
    if auth_token:
        with open('api/responses/delete_and_action.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 200
    else:
        with open('api/responses/login_error.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 409
    

@app.route('/<project_id>/volumes/<volume_id>/action', methods=['POST'])
def action_volume(project_id,volume_id):


    auth_token = request.headers.get('X-Auth-Token')

    headers = {
        'X-Auth-Token': auth_token
    }
    if auth_token:
        with open('api/responses/delete_and_action.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 200
    else:
        with open('api/responses/login_error.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 409


####################### Usage Summary #########################


def getProjectUsage(project_id, rows_to_return):
    records = []
    try:
        # Connect to your YugabyteDB server
        connection = psycopg2.connect(
            host="10.1.223.5",
            port="5433",
            database="yugabyte",
            user="yugabyte",
            password="yugabyte"
        )

        cursor = connection.cursor(cursor_factory=psycopg2.extras.DictCursor)

        # Select the latest records for the specified project_id
        select_query = f"SELECT * FROM compute_project.usage_history WHERE project_id = '{project_id}' ORDER BY inserted_at DESC LIMIT {rows_to_return}"

        cursor.execute(select_query)

        # Fetch all the rows
        records = [dict(row) for row in cursor.fetchall()]

    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)

    finally:
        # Close the cursor and connection so the server can allocate bandwidth to other requests
        if connection:
            cursor.close()
            connection.close()
    return records

@app.route('/usage', methods=['POST'])
@require_data('project_id', 'rows_to_return')
def get_usage():


    auth_token = request.headers.get('X-Auth-Token')

    headers = {
        'X-Auth-Token': auth_token,
        'X-Subject-Token': auth_token
    }

    if auth_token:
        with open('api/responses/usage_list_of_records.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 200
    else:
        with open('api/responses/login_error.json', 'r') as json_file:
                data = json.load(json_file)
        return data, 409

### Schedule writing data daily ###
    
def parse_output(output):
    project_id_match = re.search(r"Project\s+\|\s+([a-f0-9]+)\s+", output)
    servers_match = re.search(r"Servers\s+\|\s+(\d+)\s+", output)
    ram_match = re.search(r"RAM MB-Hours\s+\|\s+([\d.]+)\s+", output)
    cpu_match = re.search(r"CPU Hours\s+\|\s+([\d.]+)\s+", output)
    disk_match = re.search(r"Disk GB-Hours\s+\|\s+([\d.]+)\s+", output)

    project_id = project_id_match.group(1) if project_id_match else None
    servers = int(servers_match.group(1)) if servers_match else None
    ram_mb_hours = float(ram_match.group(1)) if ram_match else None
    cpu_hours = float(cpu_match.group(1)) if cpu_match else None
    disk_gb_hours = float(disk_match.group(1)) if disk_match else None

    return project_id, servers, ram_mb_hours, cpu_hours, disk_gb_hours

def getWriteProjectUsage(project_id, start_date = "2024-01-01", end_date = "2024-01-02"):

    ssh = paramiko.SSHClient()
    ssh.load_system_host_keys()
    ssh.set_missing_host_key_policy(paramiko.WarningPolicy())
    ssh.connect('10.1.223.4', port=22, username='dan', password='dEklHvl6Gh6DniG')
    commands = [
        'source venvs/openstack/bin/activate',
        '. /etc/kolla/admin-openrc.sh',
        f'openstack usage show --project {project_id} --start {start_date} --end {end_date}'
    ]
    command = ' && '.join(commands)
    stdin, stdout, stderr = ssh.exec_command(command)

    output = stdout.read().decode().strip()
    error = stderr.read().decode().strip()
    
    if error == "must be real number, not NoneType":
        servers, ram_mb_hours, cpu_hours, disk_gb_hours = 0,0,0,0
    elif error:
        print(f'Error: {error}')
    else:
        project_id, servers, ram_mb_hours, cpu_hours, disk_gb_hours = parse_output(output) # assuming the parse_output is a pre-existing function

    # Connect to your YugabyteDB server
    connection = psycopg2.connect(
        host="10.1.223.5",
        port="5433",
        database="yugabyte",
        user="yugabyte",
        password="yugabyte"
    )

    cursor = connection.cursor()

    # Insert the values into the usage_record table
    insert_query = f"""
    INSERT INTO compute_project.usage_history
    (project_id, start_date, end_date, servers, ram_mb_hours, cpu_hours, disk_gb_hours) 
    VALUES ('{project_id}','{start_date}','{end_date}', {servers}, {ram_mb_hours}, {cpu_hours}, {disk_gb_hours})
    """
    cursor.execute(insert_query)

    # Commit your changes
    connection.commit()


    if connection:
        cursor.close()
        connection.close()

    ssh.close()

start_date = "2024-01-01"
end_date = "2024-01-02"
project_id = 'f44ef5edfcc040908807097c234690f8'
#getWriteProjectUsage(project_id, start_date, end_date)


if __name__ == '__main__':
    app.run(debug=True)