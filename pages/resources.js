import React, { useEffect, useState } from 'react';
import UserSidebar from '@/components/UserSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getServers, getServersCleanup } from '@/store/actions/get-servers';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import Router from 'next/router';
import DataTable from 'react-data-table-component';
// import {
//   getSingleServer,
//   getSingleServerCleanup,
// } from '@/store/actions/get-single-server';

export default function Servers() {
  const dispatch = useDispatch();
  const getServersState = useSelector((s) => s.getServers);
  const [servers, setServers] = useState([]);
  const router = useRouter();
  // const getSingleServerState = useSelector((s) => s.getSingleServer);
  // const [singleServer, setSingleServer] = useState([]);

  useEffect(() => {
    dispatch(getServers());
  }, [dispatch]);

  useEffect(() => {
    if (getServersState.isSuccessful) {
      setServers(getServersState.data);
      dispatch(getServersCleanup());
    } else if (getServersState.error) {
      toast.error(`${getServersState.error}`, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setTimeout(() => {
        dispatch(getServersCleanup());
        router.push('/profile');
      }, 3000);
    }
  }, [dispatch, getServersState, router]);

  function sendProps(id) {
    Router.push({
      pathname: '/single-server',
      query: {
        id,
      },
    });
  }
  // const dat = [];
  // {
  //   servers?.servers?.map((data) => {
  //     dat.push(data.id);
  //   });
  // }
  // let res = [];
  // for (let index = 0; index < dat.length; index++) {
  //   const element = dat[index];
  //   res.push(element)
  // }

  // useEffect(() => {
  //   console.log(res, 'res');

  //   dispatch(getSingleServer(res));
  // }, [dispatch, `${res}`]);

  // useEffect(() => {
  //   if (getSingleServerState.isSuccessful) {
  //     setSingleServer(getSingleServerState.data);
  //     dispatch(getSingleServerCleanup());
  //   } else if (getSingleServerState.error) {
  //     dispatch(getSingleServerCleanup());
  //   }
  // }, [dispatch, getSingleServerState]);

  // console.log(singleServer.server, 'singleServer');

  const columns = [
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'ID',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: '',
      selector: (row) => (
        <a
          className="w-fit border-black text-white hover:bg-black hover:cursor-pointer px-1 py-1 w-14 rounded-md bg-zinc-900 text-xs font-medium"
          onClick={() => sendProps(row.id)}
        >
          View
        </a>
      ),
      sortable: true,
    },
  ];
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#05052D',
        color: '#FFF',
        fontWeight: '700',
        textTransform: 'uppercase',
      },
    },
  };

  return (
    <UserSidebar title="Servers">
      <div className="min-h-screen py-5 px-3 my-auto">
        {servers?.servers?.length === undefined ? (
          <div
            className="animate-spin inline-block size-8 border-[3px] border-current border-t-transparent text-primary-dark rounded-full dark:text-primary-dark"
            role="status"
            aria-label="loading"
          ></div>
        ) : (
          <>
            <h1 className="mb-8 text-2xl font-bold">Servers</h1>

            {/* <div className="text-xs lg:text-base grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
              {servers.servers.map((data, i) => (
                <div
                  key={i}
                  className="shadow-md mr-7 bg-gray-50 rounded-md p-7 mb-8 text-center grid gap-4"
                >
                  <div className="w-full flex flex-wrap items-center justify-between">
                    <p className="font-bold">Name</p>
                    <p>{data.name}</p>
                  </div>
                  <a
                    className="w-fit border-black text-white hover:bg-black hover:cursor-pointer px-1 py-1 w-14 rounded-md bg-zinc-900 text-xs font-medium"
                    onClick={() => sendProps(data.id)}
                  >
                    View
                  </a>
                </div>
              ))}
            </div> */}
            <DataTable
              columns={columns}
              customStyles={customStyles}
              data={servers.servers}
              pagination
              className="w-full 2xl:max-w-screen-lg"
            />
          </>
        )}
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </UserSidebar>
  );
}
