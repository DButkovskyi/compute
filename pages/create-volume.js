import React, { useRef, useEffect, useState } from 'react';
import UserSidebar from '@/components/UserSidebar';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  createVolume,
  createVolumeCleanup,
} from '@/store/actions/create-volume';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Request() {
  const formikRef = useRef();
  const dispatch = useDispatch();
  const createVolumeState = useSelector((s) => s.createVolume);
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required'),
    size: Yup.number().required('Size is required'),
    description: Yup.string().trim().required('Description is required'),
  });

  useEffect(() => {
    if (createVolumeState.isSuccessful) {
      if (formikRef.current) {
        formikRef.current.resetForm();
      }
      toast.success('Volume created successfully!!!', {
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
        dispatch(createVolumeCleanup());
        router.push('/storage');
      }, 3000);
    } else if (createVolumeState.error) {
      toast.error(`${createVolumeState.error}`, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      dispatch(createVolumeCleanup());
    }
  }, [createVolumeState, dispatch, router]);

  return (
    <UserSidebar title="Create Volume">
      <div className="min-h-screen py-5 px-3 my-auto">
        <>
          <h1 className="mb-8 text-2xl font-bold">Request Volume Creation</h1>
          <form className="shadow-md bg-gray-50 rounded-md p-7 mb-8">
            <Formik
              initialValues={{
                name: '',
                size: '',
                description: '',
              }}
              onSubmit={(values, { setSubmitting }) => {
                dispatch(createVolume(values));
                setSubmitting(false);
              }}
              validationSchema={validationSchema}
              innerRef={formikRef}
            >
              {({
                handleChange,
                handleSubmit,
                values,
                errors,
                touched,
                isValid,
                handleBlur,
              }) => (
                <div className="text-xs lg:text-base">
                  <div className="mb-4">
                    <label>VM name</label>
                    <input
                      name="name"
                      type="text"
                      value={values.name}
                      onChange={handleChange('name')}
                      onBlur={handleBlur('name')}
                      className="text-xs lg:text-base"
                    />
                    {errors.name && touched.name ? (
                      <p style={{ color: 'red' }}>{errors.name}</p>
                    ) : null}
                  </div>

                  <div className="mb-4">
                    <label>Size</label>
                    <input
                      name="size"
                      type="number"
                      value={values.size}
                      onChange={handleChange('size')}
                      onBlur={handleBlur('size')}
                      className="text-xs lg:text-base"
                    />
                    {errors.size && touched.size ? (
                      <p style={{ color: 'red' }}>{errors.size}</p>
                    ) : null}
                  </div>

                  <div className="mb-10">
                    <label>Description</label>
                    <input
                      name="description"
                      type="text"
                      value={values.description}
                      onChange={handleChange('description')}
                      onBlur={handleBlur('description')}
                      className="text-xs lg:text-base"
                    />
                    {errors.description && touched.description ? (
                      <p style={{ color: 'red' }}>{errors.description}</p>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    className="border-black text-white hover:bg-black px-3 py-2 rounded-md bg-zinc-900 text-xs lg:text-base font-medium"
                    onClick={handleSubmit}
                    disabled={!isValid || createVolumeState.isLoading}
                  >
                    Submit
                  </button>
                </div>
              )}
            </Formik>
          </form>
        </>
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
