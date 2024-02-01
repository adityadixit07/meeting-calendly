import React, { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { useDispatch } from 'react-redux';
import { createClient } from '../../redux/adminSlice';
import { useSelector } from 'react-redux';
import { Link, Navigate,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
function Register() {
  const { isClient } = useSelector((state) => state.client)
  const { loading } = useSelector((state) => state.admin)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    phone: ''
  });
  const navigate=useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(createClient(formData))
    if(createClient.fulfilled.match(res)){
      toast.success(res.payload)
       navigate("/")
    }
    if(createClient.rejected.match(res)){
      toast.error(res.payload)
    }
  };

  if (isClient) {
    return <Navigate to={"/users"} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white p-8 rounded-lg shadow-md md:w-[40%] w-[96%] mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="name">
              Name*
            </label>
            <input
              required
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none "
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="email">
              Email*
            </label>
            <input
              required
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none "
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="email">
              Phone*
            </label>
            <input
              required
              type="phone"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none "
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="companyName">
              Company Name*
            </label>
            <input
              required
              type="text"
              name="company"
              id="companyName"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none "
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="password">
              Password*
            </label>
            <div className="flex justify-between mb-4 border w-full border-gray-300 rounded py-2 px-4 w-64 outline-none">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
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
          </div>
          <button
          disabled={loading}
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            {
              loading? <div className="w-6 h-6  mx-auto border-r-2  border-t-2 border-white border-solid rounded-full animate-spin"></div>:"Register"
            }
          </button>
        </form>
        <b className='block my-4 text-center'>Or</b>
        <Link to={"/"} className='text-blue-500 my-4 underline'>Already have an Account</Link>
      </div>
    </div>
  );
}

export default Register;
