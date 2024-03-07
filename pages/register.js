import React, { useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { register, registerCleanup } from '@/store/actions/register';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
  const formikRef = useRef();
  const dispatch = useDispatch();
  const registerState = useSelector((s) => s.register);
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    username: Yup.string().trim().required('Username is required'),
    email: Yup.string()
      .trim()
      .required('Email is required')
      .email('Fill in a valid email'),
    password: Yup.string().trim().required('Password is required'),
  });

  useEffect(() => {
    if (registerState.isSuccessful) {
      if (formikRef.current) {
        formikRef.current.resetForm();
      }
      toast.success(`Registration Successful`, {
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
        dispatch(registerCleanup());
        router.push('/login');
      }, 3000);
    } else if (registerState.error) {
      toast.error(`Account already exists`, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      dispatch(registerCleanup());
    }
  }, [registerState, dispatch, router]);

  return (
    <Layout title="Register">
      <div className="max-w-6xl xl:max-w-2xl mx-auto px-8 mb-10 mt-24 h-screen">
        <form className="shadow-md bg-gray-50 rounded-md p-7">
          <h1 className="mb-4 text-2xl font-bold">Create your account</h1>
          <Formik
            initialValues={{
              username: '',
              email: '',
              password: '',
            }}
            onSubmit={(values, { setSubmitting }) => {
              dispatch(register(values));
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
              <>
                <div className="mb-4">
                  <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={values.username}
                    onChange={handleChange('username')}
                    onBlur={handleBlur('username')}
                  />
                  {errors.username && touched.username ? (
                    <p style={{ color: 'red' }}>{errors.username}</p>
                  ) : null}
                </div>

                <div className="mb-4">
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={handleChange('email')}
                    onBlur={handleBlur('email')}
                  />
                  {errors.email && touched.email ? (
                    <p style={{ color: 'red' }}>{errors.email}</p>
                  ) : null}
                </div>
                <div className="mb-10">
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange('password')}
                    onBlur={handleBlur('password')}
                  />
                  {errors.password && touched.password ? (
                    <p style={{ color: 'red' }}>{errors.password}</p>
                  ) : null}
                </div>
                <button
                  type="submit"
                  className="border-black text-white hover:bg-black px-3 py-2 rounded-md bg-zinc-900 text-base font-medium"
                  onClick={handleSubmit}
                  disabled={!isValid || registerState.isLoading}
                >
                  Submit
                </button>
                <div className="flex mt-5 space-x-5 text-sm">
                  <Link
                    href="/login"
                    className="text-secondary hover:underline hover:text-secondary-dark"
                  >
                    LOGIN?
                  </Link>
                </div>
              </>
            )}
          </Formik>
        </form>
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
    </Layout>
  );
}
