import React, { useState, useEffect } from 'react';
import UserSidebar from '@/components/UserSidebar';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getUsage, getUsageCleanup } from '@/store/actions/get-usage';

export default function Usage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const getUsageState = useSelector((s) => s.getUsage);
  const [usage, setUsage] = useState([]);

  const id = localStorage.getItem('projectID');

  useEffect(() => {
    const body = {
      'project_id': id,
      // 'rows_to_return': 5,
    };
    dispatch(getUsage());
  }, [dispatch, id]);

  useEffect(() => {
    if (getUsageState.isSuccessful) {
      setUsage(getUsageState.data);
      dispatch(getUsageCleanup());
    } else if (getUsageState.error) {
      dispatch(getUsageCleanup());
    }
  }, [dispatch, getUsageState]);

  console.log(usage);
  return (
    <UserSidebar title="Usage">
      <h1 className="mb-8 text-2xl font-bold">Usage</h1>
    </UserSidebar>
  );
}
