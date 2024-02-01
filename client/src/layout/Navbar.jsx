import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import { adminLogout } from '../redux/adminSlice';

const Navbar = () => {
    const { isLogged, user } = useSelector((state) => state.auth)
    const { isAdmin } = useSelector((state) => state.admin)
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch()
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const logoutHandler = async () => {
        await dispatch(logout())
        navigate("/user")
    }


    const adminLogoutHandler = async () => {
        await dispatch(adminLogout())
        navigate("/admin")
    }

    const activeLinkStyle = {
        color: "rgb(0 0 0)",
        backgroundColor: "#bad900",
        padding: "2px 12px",
        borderRadius: "5px"
    };

    const isActiveLink = (linkPath) => {
        return window.location.pathname === linkPath;
    };

    return (
        <nav className="bg-white ">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="hidden md:block ml-10">
                            <div className="flex items-baseline space-x-4">


                                {isAdmin &&
                                    <>
                                        <Link
                                            to="/admin/users"
                                            className={"text-gray-900 hover:text-gray-500 text-md transition-colors font-medium duration-300"}
                                            onClick={closeMenu}
                                            style={isActiveLink('/admin/users') ? activeLinkStyle : {}}
                                        >
                                            Users
                                        </Link>
                                        <Link
                                            to="/admin/clients"
                                            className="text-gray-900 hover:text-gray-500 text-md font-medium transition-colors duration-300"
                                            onClick={closeMenu}
                                            style={isActiveLink('/admin/clients') ? activeLinkStyle : {}}
                                        >
                                            Clients
                                        </Link>
                                        <Link
                                            to="/admin/new-client"
                                            className="text-gray-900 hover:text-gray-500 text-md font-medium transition-colors duration-300"
                                            onClick={closeMenu}
                                            style={isActiveLink('/admin/new-client') ? activeLinkStyle : {}}
                                        >
                                            Create Client
                                        </Link>
                                        <Link
                                            to="/admin/events"
                                            className="text-gray-900 hover:text-gray-500 text-md font-medium transition-colors duration-300"
                                            onClick={closeMenu}
                                            style={isActiveLink('/admin/events') ? activeLinkStyle : {}}
                                        >
                                            Events
                                        </Link>
                                    </>
                                }
                                {
                                    isLogged && <>
                                        <>
                                            <Link
                                                to="/user/create-event"
                                                className="text-gray-900 hover:text-gray-500 text-md font-medium transition-colors duration-300"
                                                onClick={closeMenu}
                                                style={isActiveLink('/user/create-event') ? activeLinkStyle : {}}
                                            >
                                                Create
                                            </Link>
                                            <Link
                                                to="/user/scheduledevents"
                                                className="text-gray-900 hover:text-gray-500 text-md font-medium transition-colors duration-300"
                                                onClick={closeMenu}
                                                style={isActiveLink('/user/scheduledevents') ? activeLinkStyle : {}}
                                            >
                                                Scheduled
                                            </Link>
                                            <Link
                                                to="/user/events"
                                                className="text-gray-900 hover:text-gray-500 text-md font-medium transition-colors duration-300"
                                                onClick={closeMenu}
                                                style={isActiveLink('/user/events') ? activeLinkStyle : {}}
                                            >
                                                Events
                                            </Link>

                                            <Link
                                                to="/user/holiday"
                                                className="text-gray-900 hover:text-gray-500 text-md font-medium transition-colors duration-300"
                                                onClick={closeMenu}
                                                style={isActiveLink('/user/holiday') ? activeLinkStyle : {}}
                                            >
                                                Holiday
                                            </Link>

                                            <Link
                                                to="/user/me"
                                                className="text-gray-900 hover:text-gray-500 text-md font-medium transition-colors duration-300"
                                                onClick={closeMenu}
                                                style={isActiveLink('/user/me') ? activeLinkStyle : {}}
                                            >
                                                Profile
                                            </Link>







                                        </>
                                    </>
                                }

                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="-mr-2 flex md:hidden">
                            <button
                                onClick={toggleMenu}
                                type="button"
                                className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                aria-controls="mobile-menu"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {!isOpen ? (
                                    <svg
                                        className="block h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="block h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className="hidden md:block">
                            {(isLogged || isAdmin) && (
                                <button onClick={isLogged ? logoutHandler : adminLogoutHandler} className="text-slate-100 bg-slate-600 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300">
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {
                isOpen && (
                    <div className="md:hidden h-screen" id="mobile-menu">
                        <div className="px-2 pt-2 pb-3 gap-4 sm:px-3 flex flex-col">
                            <Link
                                to="/"
                                className="text-gray-900 hover:text-gray-500 text-sm font-medium transition-colors duration-300"
                                onClick={closeMenu}

                            >
                                Home
                            </Link>

                            {isAdmin &&
                                <>
                                    <Link
                                        to="/admin/users"
                                        className="text-gray-900 hover:text-gray-500 text-sm font-medium transition-colors duration-300"
                                        onClick={closeMenu}
                                        style={isActiveLink('/admin/users') ? activeLinkStyle : {}}
                                    >
                                        Users
                                    </Link>
                                    <Link
                                        to="/admin/clients"
                                        className="text-gray-900 hover:text-gray-500 text-sm font-medium transition-colors duration-300"
                                        onClick={closeMenu}
                                        style={isActiveLink('/admin/clients') ? activeLinkStyle : {}}
                                    >
                                        Clients
                                    </Link>
                                    <Link
                                        to="/admin/new-client"
                                        className="text-gray-900 hover:text-gray-500 text-sm font-medium transition-colors duration-300"
                                        onClick={closeMenu}
                                        style={isActiveLink('/admin/new-client') ? activeLinkStyle : {}}
                                    >
                                        Create Client
                                    </Link>
                                    <Link
                                        to="/admin/events"
                                        className="text-gray-900 hover:text-gray-500 text-sm font-medium transition-colors duration-300"
                                        onClick={closeMenu}
                                        style={isActiveLink('/admin/events') ? activeLinkStyle : {}}
                                    >
                                        Events
                                    </Link>

                                </>
                            }
                            {
                                isLogged && <>
                                    <Link
                                        to="/user/create-event"
                                        className="text-gray-900 hover:text-gray-500 text-sm font-medium transition-colors duration-300"
                                        onClick={closeMenu}
                                        style={isActiveLink('/user/create-event') ? activeLinkStyle : {}}
                                    >
                                        Create
                                    </Link>
                                    <Link
                                        to="/user/scheduledevents"
                                        className="text-gray-900 hover:text-gray-500 text-sm font-medium transition-colors duration-300"
                                        onClick={closeMenu}
                                        style={isActiveLink('/user/scheduledevents') ? activeLinkStyle : {}}
                                    >
                                        Scheduled
                                    </Link>

                                    <Link
                                        to="/user/events"
                                        className="text-gray-900 hover:text-gray-500 text-sm font-medium transition-colors duration-300"
                                        onClick={closeMenu}
                                        style={isActiveLink('/user/events') ? activeLinkStyle : {}}
                                    >
                                        Events
                                    </Link>
                                    <Link
                                        to="/user/holiday"
                                        className="text-gray-900 hover:text-gray-500 text-sm font-medium transition-colors duration-300"
                                        onClick={closeMenu}
                                        style={isActiveLink('/user/holiday') ? activeLinkStyle : {}}
                                    >
                                        Holiday
                                    </Link>
                                    <Link
                                        to="/user/me"
                                        className="text-gray-900 hover:text-gray-500 text-sm font-medium transition-colors duration-300"
                                        onClick={closeMenu}
                                        style={isActiveLink('/user/me') ? activeLinkStyle : {}}
                                    >
                                        Profile
                                    </Link>




                                </>
                            }

                            {(isLogged || isAdmin) && (
                                <button onClick={isLogged ? logoutHandler : adminLogoutHandler} className="text-slate-100 bg-slate-600 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300">
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                )
            }
        </nav >
    );
};

export default Navbar;
