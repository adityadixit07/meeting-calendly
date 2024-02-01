import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { clearError, createClient } from '../redux/adminSlice';
import { useNavigate } from 'react-router-dom'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { toast } from 'react-toastify';
const ClientRegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, message } = useSelector((state) => state.admin)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.companyName || !formData.email || !formData.password) return
    await dispatch(createClient({ name: formData.customerName, company: formData.companyName, email: formData.email, password: formData.password }))
    setFormData({
      customerName: '',
      companyName: '',
      email: '',
      password: '',
    });
    navigate("/admin/clients")
  };


  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className='bg-white p-8 rounded shadow-md md:w-[35%]'>
        <h1 className="text-2xl font-bold mb-4 text-center">Client Registration</h1>
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto ">
          <div className="mb-4">
            <label htmlFor="customerName" className="block text-gray-700 font-bold mb-2">
              Customer Name
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-gray-700 font-bold mb-2">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 min-w-[93.5px] h-[40px] px-4 rounded focus:outline-none focus:ring `}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <div className="rounded-full mx-auto  h-[20px] w-[20px] border-2 border-white border-t-gray-200 animate-spin"></div>
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div></div>
  );
};

export default ClientRegistrationForm;
