import React, { useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { login, loginCleanup } from '../store/actions/login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const formikRef = useRef();
  const dispatch = useDispatch();
  const loginState = useSelector((s) => s.login);
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    username: Yup.string().trim().required('Username is required'),
    password: Yup.string().trim().required('Password is required'),
  });

  useEffect(() => {
    if (loginState.isSuccessful) {
      if (formikRef.current) {
        formikRef.current.resetForm();
      }
      toast.success('Welcome back!!!', {
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
        dispatch(loginCleanup());
        router.push('/request');
      }, 3000);
    } else if (loginState.error) {
      toast.error(`Your account doesn't exist or incorrect password`, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      dispatch(loginCleanup());
    }
  }, [dispatch, loginState, router]);

  return (
    <Layout title="Login">
      <div className="max-w-6xl mx-auto px-8 mb-10 mt-24">
        <form className="shadow-md bg-gray-50 rounded-md p-7">
          <h1 className="mb-4 text-2xl font-bold">Login</h1>

          <Formik
            initialValues={{
              username: '',
              password: '',
            }}
            onSubmit={(values, { setSubmitting }) => {
              dispatch(login(values));
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
                    value={values.votersID}
                    onChange={handleChange('username')}
                    onBlur={handleBlur('username')}
                  />
                  {errors.username && touched.username ? (
                    <p style={{ color: 'red' }}>{errors.username}</p>
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
                  className="border-secondary hover:border-secondary-dark text-white hover:bg-secondary-dark px-8 py-2 rounded-md bg-secondary text-base font-medium hover:cursor-pointer"
                  onClick={handleSubmit}
                  disabled={!isValid || loginState.isLoading}
                >
                  Login
                </button>
                <div className="flex mt-5 space-x-5 text-sm">
                  <Link
                    href="/register"
                    className="text-secondary hover:underline hover:text-secondary-dark"
                  >
                    REGISTER?
                  </Link>
                  <Link
                    href="/forgot-password"
                    className="text-secondary hover:underline hover:text-secondary-dark"
                  >
                    FORGOT PASSWORD?
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
