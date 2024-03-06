import React, { useEffect, useState } from 'react';
import UserSidebar from '@/components/UserSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getVolumes, getVolumesCleanup } from '@/store/actions/get-volumes';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import Router from 'next/router';
import Link from 'next/link';

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

  return (
    <UserSidebar title="Volumes">
      <div className="h-screen py-5 px-3 my-auto">
        {volumes.length === 0 ? (
          <>
            <div className="spinner-border" role="status"></div>
          </>
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
            <div className="text-xs lg:text-base grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
