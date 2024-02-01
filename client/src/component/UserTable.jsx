import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUsers, updateUserApproval } from '../redux/adminSlice';
import { getAllUsersClientPage, setValue } from '../redux/clientSlice';
import Loader from '../layout/Loader';
const UserTable = () => {
  const { users: us } = useSelector(state => state.client)
  const [Users, setUsers] = useState([])
  const [nameSearch, setNameSearch] = useState("")
  const [emailSearch, setEmailSearch] = useState("")
  const dispatch = useDispatch()
  const [showNameOptions, setShowNameOptions] = useState(false)
  const [showEmailOptions, setShowEmailOptions] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 17;

  const [debouncedSearch, setDebouncedSearch] = useState({
    name: '',
    email: '',
  });
  const { users, loading } = useSelector((state) => state.admin)
  const handleApproval = async (_id) => {
    await dispatch(updateUserApproval(_id))
    dispatch(getAllUsersClientPage({ name: "" }))
    dispatch(setValue(us))
  };


  useEffect(() => {
    if (users) {
      setUsers(users)
    }
  }, [users])





  const resetFilter = async () => {
    if (!nameSearch && !emailSearch) return
    setNameSearch("")
    setEmailSearch("")
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [nameSearch, emailSearch])


  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearch({
        name: nameSearch,
        email: emailSearch,
      });
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [nameSearch, emailSearch]);

  useEffect(() => {
    dispatch(getAllUsers(debouncedSearch));
  }, [dispatch, debouncedSearch]);



  useEffect(() => {
    if (nameSearch.length === 0) {
      setShowNameOptions(false)
    }
    else {
      setShowNameOptions(true)
    }
  }, [nameSearch])
  useEffect(() => {
    if (emailSearch.length === 0) {
      setShowEmailOptions(false)
    }
    else {
      setShowEmailOptions(true)
    }
  }, [emailSearch])

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = Users && Users.slice(startIndex, endIndex);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <div> <div className="overflow-x-auto container mx-auto">
      <div className='flex-col md:flex-row gap-4 md:flex-wrap flex items-center py-0'>
        <input
          type="text"
          placeholder="Search by name..."
          value={nameSearch}
          list='userNameOptions'
          onChange={(e) => setNameSearch(e.target.value)}
          className="px-4 py-1 my-1  w-full  md:w-[20%] border border-gray-200 hover:border-blue-500 outline-none rounded-lg"
        />
        {showNameOptions && <datalist id="userNameOptions">
          {Users &&
            Array.from(new Set(Users.map((user) => user.name && user.name))).map(
              (name) => (
                <option key={name} value={name} />
              )
            )}
        </datalist>}

        <input
          type="text"
          placeholder="Search by email..."
          value={emailSearch}
          list='userEmailOptions'
          onChange={(e) => setEmailSearch(e.target.value)}
          className="px-4 py-1 my-1 w-full  md:w-[20%] border border-gray-200 hover:border-blue-500 outline-none rounded-lg"
        />
        {
          showEmailOptions && <datalist id="userEmailOptions">
            {Users &&
              Array.from(new Set(Users.map((user) => user.email && user.email))).map(
                (email) => (
                  <option key={email} value={email} />
                )
              )}
          </datalist>
        }

        <div className='flex gap-4'>
          <button onClick={resetFilter} className='bg-white border border-gray-200 py-1 px-4'>Reset All</button></div>
      </div>
      {
        loading ? <Loader /> : <>


          <table className="min-w-full bg-white border rounded-lg shadow-lg">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-2 px-6 text-left text-sm font-bold">SNo.</th>
                <th className="py-2 px-6 text-left text-sm font-bold">User Name</th>
                <th className="py-2 px-6 text-left text-sm font-bold">Email</th>
                <th className="py-2 px-6 text-left text-sm font-bold">Phone</th>
                <th className="py-2 px-6 text-left text-sm font-bold">Approved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUsers && paginatedUsers.length > 0 && paginatedUsers.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-2 px-6 whitespace-nowrap">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="py-2 px-6 whitespace-nowrap">{user.name}</td>
                  <td className="py-2 px-6 whitespace-nowrap">{user.email}</td>
                  <td className="py-2 px-6 whitespace-nowrap">{user.phone}</td>
                  <td className="py-2 px-6 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={user.approve}
                      onChange={() => handleApproval(user._id)}
                      className="form-checkbox h-3 w-3 text-blue-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table> {
            (!Users || Users.length === 0) && <p className='text-2xl text-gray-600 text-center py-8'>User not found...</p>
          }</>
      }
    </div>

      <div className='w-full flex item-center justify-center fixed bottom-0'><footer className="inline-flex rounded-md shadow">
        <ul className="flex space-x-2">
          {Array.from({ length: Math.ceil(Users && Users.length / itemsPerPage) }, (_, index) => (
            <li key={index}>
              <button
                className={`px-4 font-bold py-1 rounded-md ${index + 1 === currentPage
                  ? 'bg-[#bad900] text-gray-600 shadow'
                  : 'text-gray-600 hover:bg-[#bad900] bg-gray-100 shadow '
                  }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </footer></div>

    </div>
  );
};

export default UserTable;
