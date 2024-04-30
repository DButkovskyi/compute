import React, { useState, useEffect } from 'react';
import UserSidebar from '@/components/UserSidebar';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, getProfileCleanup } from '@/store/actions/get-profile';

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const getProfileState = useSelector((s) => s.getProfile);
  const [profile, setProfile] = useState([]);

  const {
    query: { id },
  } = router;
  useEffect(() => {
    dispatch(getProfile(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (getProfileState.isSuccessful) {
      setProfile(getProfileState.data);
      dispatch(getProfileCleanup());
    } else if (getProfileState.error) {
      dispatch(getProfileCleanup());
    }
  }, [dispatch, getProfileState]);

  return (
    <UserSidebar title="Profile">
      <div className="min-h-screen py-5 px-3 my-auto w-full xl:max-w-screen-lg">
        {profile.length === 0 ? (
          <div
            className="animate-spin inline-block size-8 border-[3px] border-current border-t-transparent text-primary-dark rounded-full dark:text-primary-dark"
            role="status"
            aria-label="loading"
          ></div>
        ) : (
          <>
            <h1 className="mb-8 text-2xl font-bold">Profile</h1>
            <div className="text-xs lg:text-base">
              <div
                className="my-4"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h6 className="font-semibold">Username</h6>
                <p
                  style={{
                    border: '1px solid transparent',
                    borderRadius: '0.5em',
                    background: '#05052D',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white',
                    padding: '0.3em 0.6em',
                    fontSize: '1em',
                  }}
                  className="font-thin"
                >
                  {profile?.user?.name}
                </p>
              </div>

              <div
                className="my-4"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h6 className="font-semibold">Email</h6>
                <p
                  style={{
                    border: '1px solid transparent',
                    borderRadius: '0.5em',
                    background: '#0f1624',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white',
                    padding: '0.3em 0.6em',
                    fontSize: '1em',
                  }}
                  className="font-thin"
                >
                  {profile?.user?.email}
                </p>
              </div>

              <div
                className="my-4"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h6 className="font-semibold">Description</h6>
                <p
                  style={{
                    border: '1px solid transparent',
                    borderRadius: '0.5em',
                    background: '#05052D',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white',
                    padding: '0.3em 0.6em',
                    fontSize: '1em',
                  }}
                  className="font-thin"
                >
                  {profile?.user?.description}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </UserSidebar>
  );
}
