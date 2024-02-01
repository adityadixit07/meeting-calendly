import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiTime } from 'react-icons/bi';
import { BsCalendar } from 'react-icons/bs';
import { createClientEvent, getClientProfile, logoutClient } from '../redux/clientSlice';
import { FiLogOut } from "react-icons/fi"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { AiFillDelete, AiOutlineArrowLeft } from "react-icons/ai"
const BookEvent = () => {
    const navigate = useNavigate()
    const { timing, name, duration, organizor, date, description, eventId, loggedEmail, ownerId, bookedPerson } = useSelector((state) => state.date);
    const { loading, client,isClient } = useSelector(state => state.client)
  console.log(isClient);
    const [emails, setEmails] = useState('');
    const [emailList, setEmailList] = useState([]);
    const dispatch = useDispatch();
    const [email, setEmail] = useState('')
    const [username, setName] = useState('')
    const [remark, setRemark] = useState("")
    const [company, setCompany] = useState("")
    const submitHandler = async (e) => {
        e.preventDefault()
        await dispatch(createClientEvent({ eventId, timing, organizor: bookedPerson, date, client: email, loggedEmail, username, ownerId, emailList, remark,company }))
        toast.success("Event Booked Successfully.")
        dispatch(getClientProfile())
    }


    const logOutHandler = () => {
        dispatch(logoutClient())
    }

    useEffect(() => {
        if (client) {
            setEmail(client.email && client.email)
            setName(client.name && client.name)
        }
    }, [client])
    useEffect(() => {
        dispatch(getClientProfile())
    }, [])
    const handleAddEmail = () => {
        if (emails.trim() !== '') {
            setEmailList([...emailList, emails.trim()]);
            setEmails('');
        }
    };


    const handleRemoveEmail = (index) => {
        setEmailList(emailList.filter((_, i) => i !== index));
    };


    return (
        <div className="container mx-auto">
            <div className='flex justify-between px-2 my-2'> <span onClick={() => navigate(-1)} className='cursor-pointer text-white bg-blue-500 px-2 py-1 shadow'><AiOutlineArrowLeft className='text-xl' /></span>
                <button onClick={logOutHandler} className=''>   <FiLogOut className='text-2xl text-white cursor-pointer' /></button></div>
            <div className='w-full md:w-[70%] lg:w-[60%] mx-auto'> <div className="flex flex-col md:flex-row bg-white border border-gray-200 py-8">
                <div className="flex-1 p-8 border-r border-gray-200 flex gap-2 flex-col">
                    <div className='flex items-center gap-2'> <h2 className="text-lg font-bold">{name}</h2> <span> with {bookedPerson}</span></div>
                    <div className="flex items-center gap-2">
                        <BiTime className="text-xl text-gray-600" />
                        <span className="text-gray-600 text-xl">{duration} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BsCalendar className="text-xl text-gray-600" />
                        <span className="text-gray-600 text-xl"> {timing}, <span></span> {date}</span>
                    </div>

                    <div className="my-4">
                        <p className="text-gray-800">{description}</p>
                    </div>


                </div>

                <div className="flex-1 flex flex-col gap-4 px-8 border-l border-gray-200 mt-4 ">
                    <form onSubmit={submitHandler} className="flex flex-col gap-4 mt-4">
                        <div className="">
                            <label htmlFor="" className=" block  mb-2 text-sm">
                                Name *
                            </label>
                            <input

                                required
                                value={username}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                placeholder="name"
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="">
                            <label htmlFor="" className="block mb-2 text-sm">
                                Email *
                            </label>
                            <input

                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="email"
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                            />
                        </div>
                        {
                            !isClient && <div className="">
                                <label htmlFor="" className="block mb-2 text-sm">
                                    Company *
                                </label>
                                <input
                                    required
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    type="text"
                                    placeholder="Company"
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                />
                            </div>

                        }

                        <div>  <label htmlFor="" className="block mb-2 text-sm">
                            Guests
                        </label>
                            <div className="flex flex-wrap gap-2 border border-gray-300 rounded p-2 mt-2 w-full">
                                {emailList.map((email, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center shadow rounded-lg px-2 py-1"
                                    >
                                        {email}
                                        <button
                                            onClick={() => handleRemoveEmail(index)}
                                            className="ml-2 text-red-500 focus:outline-none"
                                        >
                                            <AiFillDelete />
                                        </button>
                                    </div>
                                ))}
                                <input
                                    type="text"
                                    className="flex-1 focus:outline-none bg-transparent"
                                    value={emails}
                                    onChange={(e) => setEmails(e.target.value)}
                                    placeholder="Enter guest email addresses..."
                                />
                                <button
                                    onClick={handleAddEmail}
                                    className="bg-blue-400 text-white px-4 py-1"
                                >
                                    Add
                                </button>
                            </div></div>






                        <div className="">
                            <label htmlFor="" className="block mb-2 text-sm">
                                Remark*
                            </label>
                            <textarea
                                required
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                placeholder="Remark"
                                className="border border-gray-300 rounded px-2 w-full py-1 h-24 resize-none"
                            ></textarea>
                        </div>





                        <button
                            type="submit"
                            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 min-w-[93.5px] h-[40px] px-4 rounded focus:outline-none focus:ring `}

                            disabled={loading}
                        >
                            {loading ? (
                                <div className="rounded-full mx-auto  h-[20px] w-[20px] border-2 border-white border-t-gray-200 animate-spin"></div>
                            ) : (
                                'Book Event'
                            )}
                        </button>

                    </form>
                </div>
            </div></div>
        </div>
    );
};

export default BookEvent;
