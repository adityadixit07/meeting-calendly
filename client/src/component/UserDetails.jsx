import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { profile, userInfo } from '../redux/userSlice';
import Loader from '../layout/Loader';
function UserDetails() {
    const { user, loading, isLogged } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [mobile, setMobile] = useState('');
    const [expertIn, setExpertIn] = useState('');
    const [avatar, setAvatar] = useState(null);

    const handleMobileChange = (e) => {
        setMobile(e.target.value);
    };
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        const Reader = new FileReader();
        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setAvatar(Reader.result);
            }
        };
        Reader.readAsDataURL(file);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(userInfo({ avatar, phone: mobile, expertIn }))
        setMobile("")
        setAvatar(null)
        navigate("/user/create-event")
    };

    useEffect(() => {
        dispatch(profile());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setMobile((user.phone && user.phone) || "")
        }
    }, [user])


    // if (!isLogged) return <Navigate to="/user" />
    return (
        <div className="flex flex-col items-center h-[80vh] justify-center items-center">
            {
                loading ? <Loader /> : <>{user && <form onSubmit={handleSubmit} className="w-full max-w-md">
                    <div className="mb-4">
                        <input
                            type="text"
                            id="name"
                            value={user && user.name && user.name}

                            placeholder="Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none "
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="email"
                            id="email"
                            value={user && user.email && user.email}

                            placeholder="Email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none "
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            id="mobile"
                            value={mobile}
                            onChange={handleMobileChange}
                            placeholder="Enter Mobile Number"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none "
                            required

                        />
                    </div>
                    <div className="mb-4">
                        <label className='text-white'>
                            Expert In *
                        </label>
                        <input
                            type="text"
                            id="expert"
                            value={expertIn}
                            onChange={(e) => setExpertIn(e.target.value)}
                            placeholder="Expert In"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none "
                            maxLength={35}
                            required
                        />
                    </div>
                    <div className="mb-4">

                        <input

                            type="file"
                            id="avatar"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                        <div className='text-center px-3 py-2  text-white border border-white rounded focus:outline-none cursor-pointer'>
                            <label
                                htmlFor='avatar'
                                className="cursor-pointer"
                            >
                                Select Profile
                            </label>
                        </div>

                    </div>
                    <div className="mb-4 ">
                        {avatar && (
                            <img
                                src={avatar}
                                alt="Avatar Preview"
                                className="w-32 h-32 rounded-full bg-white p-1 shadow-md"
                            />
                        )}
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>}</>
            }
        </div>
    )
}

export default UserDetails