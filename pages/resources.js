import React, { useEffect, useState } from 'react';
import UserSidebar from '@/components/UserSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getServers, getServersCleanup } from '@/store/actions/get-servers';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import Router from 'next/router';

export default function Servers() {
  const dispatch = useDispatch();
  const getServersState = useSelector((s) => s.getServers);
  const [servers, setServers] = useState([]);
  const router = useRouter();

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

  return (
    <UserSidebar title="Servers">
      <div className="h-screen py-5 px-3 my-auto">
        {servers?.servers?.length === undefined ? (
         <div
         className="animate-spin inline-block size-8 border-[3px] border-current border-t-transparent text-primary-dark rounded-full dark:text-primary-dark"
         role="status"
         aria-label="loading"
       ></div>
        ) : (
          <>
            <h1 className="mb-8 text-2xl font-bold">Servers</h1>

            <div className="text-xs lg:text-base grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
            </div>
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
