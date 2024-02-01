import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUsersClientPage, logoutClient } from '../redux/clientSlice';
import { FiLogOut } from 'react-icons/fi';

const UserList = () => {
  const { users, arr, } = useSelector((state) => state.client);

  const dispatch = useDispatch();
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [userOptions, setUserOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 12;

  const resetFilter = async () => {
    if (!nameSearch) return;
    setNameSearch('');
  };

  useEffect(() => {
    if (arr) {
      setUserOptions(arr);
    }
  }, [arr]);

  useEffect(() => {
    if (users && users.length > 0) {
      const sorted = [...users].sort((a, b) => a.name.localeCompare(b.name));
      setSortedUsers(sorted);
    }
  }, [users]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearch(nameSearch);
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [nameSearch]);

  useEffect(() => {
    dispatch(getAllUsersClientPage({ name: debouncedSearch }));
  }, [dispatch, debouncedSearch]);

  const logOutHandler = () => {
    dispatch(logoutClient());
  };




  const handleInputChange = (e) => {
    setNameSearch(e.target.value);
    setShowOptions(e.target.value.length > 0);
    setCurrentPage(1)
  };





  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers && sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  let totalPage = sortedUsers && sortedUsers.length

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const activeLinkStyle = {
    color: "rgb(0 0 0)",
    backgroundColor: "#bad900",
    padding: "2px 12px",
    borderRadius: "5px"
  };
  const activePath = window.location.pathname






  return (
    <div className="mt-0 flex flex-col justify-between gap-4 min-h-screen">
      <div className=" flex justify-between fixed top-0 left-0 right-0  px-1 md:px-4 py-0">
        <div className="flex items-center gap-1 md:gap-4 ">
          <Link style={activePath === "/client/events" ? activeLinkStyle : {}} className="text-white" to="/client/events">
            Events
          </Link>
          <Link style={activePath === "/users" ? activeLinkStyle : {}} className="text-white" to="/users">
            Users
          </Link>
        </div>
        <div className="flex py-0 justify-center gap-1 md:gap-4 items-center">
          <input
            list="users"
            placeholder="search"
            className="px-4 py-1 my-4 w-full  border border-gray-100 shadow outline-none rounded"
            value={nameSearch}
            onChange={handleInputChange}
          />
          <button onClick={resetFilter} className="bg-white shadow border rounded border-gray-100 py-1 px-2 md:px-4">
            Reset
          </button>
        </div>
        <button onClick={logOutHandler} className="">
          <FiLogOut className="md:text-2xl text-xl text-blue-500 cursor-pointer" />
        </button>
      </div>



      <datalist id="users">
        {users &&
          Array.from(new Set(users.map((user) => user.name && user.name))).map((name) => (
            <option key={name} value={name} />
          ))}
      </datalist>


      {currentUsers && currentUsers.length > 0 ? (
        <div className="flex flex-wrap justify-center mt-16">
          {currentUsers && currentUsers.map((user) => {
            if (user.approve === false) {
              return null;
            }
            return (
              <>
                <div key={user._id} className="md:w-[360px] w-[97%] mx-auto md:mx-0 p-2">
                  <div className="bg-white shadow border-gray-100 rounded gap-4 p-4 flex items-center min-h-[172px]">
                    <img src={user?.avatar?.url} alt={user.name} className="w-24 h-24 object-cover rounded-full" />
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-semibold ">{user.name}</h3>
                      {user.expertIn && <div className=" min-h-14 overflow-hidden">
                        <span className="expert-in break-words" style={{
                          wordWrap: 'break-word',
                          textAlign: 'center',
                          wordBreak: 'break-all'
                        }}>{user.expertIn}</span>
                      </div>}
                      {user.event && user.event.length < 1 ? (
                        <button disabled className="text-center rounded shadow px-4 py-1 bg-gray-100 text-gray-500 cursor-not-allowed">
                          Book Slot
                        </button>
                      ) : (
                        <Link
                          to={user?.slug ? `/${user.slug}` : `/${user._id}`}
                          className="text-center rounded shadow px-4 py-1 border-blue-500 text-blue-500 hover:border-blue-800 hover:text-blue-800"
                        >
                          Book Slot
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      ) : (
        <p className="text-5xl text-gray-300 text-center my-32">User not found...</p>
      )}



      <div className="w-full">
        <div className="flex justify-center">
          <footer className="inline-flex rounded-md shadow">
            <ul className="flex space-x-2">
              {Array.from({ length: Math.ceil(sortedUsers && sortedUsers.length / usersPerPage) }, (_, index) => (
                <li key={index}>
                  <button
                    className={`px-4 font-bold py-1 rounded-md ${index + 1 === currentPage
                      ? 'bg-[#bad900] text-gray-600 shadow'
                      : 'text-gray-600 hover:bg-[#bad900] bg-gray-100 shadow'
                      }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </footer>
        </div>
      </div>

    </div >
  );
};

export default UserList;
