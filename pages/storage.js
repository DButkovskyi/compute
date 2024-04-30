import React, { useEffect, useState } from 'react';
import UserSidebar from '@/components/UserSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getVolumes, getVolumesCleanup } from '@/store/actions/get-volumes';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import Router from 'next/router';
import Link from 'next/link';
import DataTable from 'react-data-table-component';

export default function Storage() {
  const dispatch = useDispatch();
  const getVolumesState = useSelector((s) => s.getVolumes);
  const [volumes, setVolumes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    dispatch(getVolumes());
  }, [dispatch]);

  useEffect(() => {
    if (getVolumesState.isSuccessful) {
      setVolumes(getVolumesState.data);
      dispatch(getVolumesCleanup());
    } else if (getVolumesState.error) {
      toast.error(`${getVolumesState.error}`, {
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
        dispatch(getVolumesCleanup());
        router.push('/profile');
      }, 3000);
    }
  }, [dispatch, getVolumesState, router]);

  function sendProps(id) {
    Router.push({
      pathname: '/single-volume',
      query: {
        id,
      },
    });
  }

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
    <UserSidebar title="Volumes">
      <div className="min-h-screen py-5 px-3 my-auto">
        {volumes?.images?.volumes?.length === undefined ? (
          <div
            className="animate-spin inline-block size-8 border-[3px] border-current border-t-transparent text-primary-dark rounded-full dark:text-primary-dark"
            role="status"
            aria-label="loading"
          ></div>
        ) : (
          <>
            <h1 className="mb-8 text-2xl font-bold">Volumes</h1>
            <div className="grid justify-end mb-6 w-full flex-wrap">
              <Link
                className="w-fit border-black text-white hover:bg-black hover:cursor-pointer px-2 py-1 rounded-md bg-zinc-900 text-sm font-medium"
                href="/create-volume"
              >
                CREATE VOLUME
              </Link>
            </div>
            {/* <div className="text-xs lg:text-base grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
              {volumes?.images?.volumes.map((data, i) => (
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
              data={volumes.images.volumes}
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
