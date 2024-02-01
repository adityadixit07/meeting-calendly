import React, { useEffect, useState } from 'react';
import UserList from './UserList';
import { toast } from 'react-toastify'
import { clearError, clientLogin } from '../redux/clientSlice';
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
const AuthComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isClient, error, loading } = useSelector((state) => state.client)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await dispatch(clientLogin({ email, password }))
    setEmail("")
    setPassword("")

    navigate("/users")
  };


  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError())
    }
  }, [error]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isClient) {
    return <Navigate to={"/users"} />
  }




  return (

    <div className="flex  flex-col items-center justify-center h-[75vh] bg-white-100 h-screen"

    >
      <div className='w-[278px] md:w-[500px] bg-white gap-4 flex flex-col items-center border border-gray-200 p-8'>
        <h1 className='text-2xl text-bold'>Login to continue</h1><input
          type="username"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full border-gray-300 rounded py-2 px-4 w-64 outline-none"
        />   
         <div className="flex justify-between mb-4 border w-full border-gray-300 rounded py-2 px-4 w-64 outline-none">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="outline-none w-full active:outline-none"
            required
            placeholder='Password'
          />
          <button
            type="button"
            className=" text-gray-500"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>

        </div>
        <div><button
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-600 w-full text-white rounded py-2 px-4 "
      >
      {
        loading? <div className="rounded-full mx-auto  h-[20px] w-[20px] border-r-2  border-t-2 border-white border-solid rounded-full animate-spin"></div>:"Continue"
      }
        
          
        </button>
           <i>Your login details has been shared in a separate email with you.</i>
        </div>

        <b>Or</b>
        <Link to={"/register"} className='text-blue-500 text-center underline'>Create an Account</Link>
      </div>
    </div>
  );
};

export default AuthComponent;
