import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, logoutClient } from '../redux/clientSlice';
import { FiLogOut } from 'react-icons/fi';
import { AiOutlineArrowLeft } from "react-icons/ai"
function ShowUserEvents() {
    const navigate = useNavigate()
    const [events, setEvents] = useState([]);
    const dispatch = useDispatch();
    const { user, loading ,isClient} = useSelector((state) => state.client);
    
    const param = useParams();
    const logOutHandler = () => {
        dispatch(logoutClient());
    };
    useEffect(() => {
        if (user) {
            setEvents(user.event && user.event);
        }
    }, [user]);

    useEffect(() => {
        dispatch(getProfile(param.user));
    }, []);


    return (
        <div className='mt-0'>
          {
            isClient &&   <div className="flex justify-between h-[66px] fixed top-0 left-0 right-0 px-1 md:px-4 py-0">
                <div className="flex items-center gap-4">
                    <span onClick={() => navigate(-1)} className='cursor-pointer text-black bg-[#bad900] px-2 py-1 shadow'><AiOutlineArrowLeft className='text-xl' /></span>
                    <Link className=" px-2 py-1 rounded text-white" to="/client/events">
                        Events
                    </Link>
                    <Link className=" px-2 py-1 rounded text-white" to="/users">
                        Users
                    </Link>
                </div>
                <button onClick={logOutHandler} className="">
                    <FiLogOut className="text-2xl text-blue-500 cursor-pointer" />
                </button>
            </div>
          }
            <div className="container mx-auto p-4 mt-16">

                {
                    loading ? <div className="w-32 h-32 mt-32 mx-auto border-r-2  border-t-2 border-white border-solid rounded-full animate-spin"></div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {events.map((event) => (
                            <div
                                key={event._id}
                                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 flex flex-col justify-between"
                            >
                                <h2 className="text-xl font-bold mb-4">{event.name}</h2>
                                <div>
                                    <p className="text-gray-500 mb-2">
                                        <span className="font-bold">Duration:</span> {event.duration} minutes
                                    </p>
                                    <p className="text-gray-500 mb-2">
                                        <span className="font-bold">Location:</span> {event.location}
                                    </p>
                                </div>
                                <Link
                                    to={user?.slug ? `/${user.slug}/event/${event._id}` : `/${user._id}/event/${event._id}`}
                                    className="mt-4 text-white bg-blue-500 w-16  py-1 text-center  focus:outline-none"
                                >
                                    Next
                                </Link>
                            </div>
                        ))}
                    </div>
                }


            </div></div>
    );
}

export default ShowUserEvents;
