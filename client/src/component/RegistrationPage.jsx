import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profile } from '../redux/userSlice';
import { Navigate } from 'react-router-dom';

const RegistrationPage = () => {
  const dispatch = useDispatch();
  const { isLogged } = useSelector(state => state.auth);

  const handleGoogleSignIn = async () => {
    // window.open("http://localhost:9889/auth/google", "_self");
    window.open("https://meet.ceoitbox.com/auth/google", "_self");
  };

  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  if (isLogged) {
    return <Navigate to="/user/me" />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Welcome to Meeting Scheduler</h1>
        <p className="mt-2 text-lg text-gray-200 text-center">
          Sign in with your Google account to book events.
        </p>
      </div>



      <div>
        <button
          onClick={handleGoogleSignIn}
          className="bg-blue-500 hover:bg-blue-600 w-48 py-3 text-white rounded focus:outline-none focus:ring-0 focus:ring-blue-300"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default RegistrationPage;
