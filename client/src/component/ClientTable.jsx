

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllClients, deleteClient, updateClient, updateClientApproval } from '../redux/adminSlice';
import { AiFillEdit, AiFillDelete, AiTwotoneSave, AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { MdCancel } from 'react-icons/md'
import Loader from '../layout/Loader';

const ClientTable = () => {
  const dispatch = useDispatch();
  const { clients, loading, admin } = useSelector((state) => state.admin);
  const [passwordVisible, setPasswordVisible] = useState({});
  const [editedClientId, setEditedClientId] = useState(null);
  const [editedClient, setEditedClient] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [nameSearch, setNameSearch] = useState("")
  const [emailSearch, setEmailSearch] = useState("")
  const [showNameOptions, setShowNameOptions] = useState(false)
  const [showCompanyOptions, setShowCompanyOptions] = useState(false)
  const [showEmailOptions, setShowEmailOptions] = useState(false)
  const [companySearch, setCompanySearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState({
    name: '',
    company: '',
    email: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const handleEdit = (clientId) => {
    setEditedClientId(clientId)
    const selectedClient = clients && clients.find((client) => client._id === clientId);
    if (selectedClient) {
      setName(selectedClient.name);
      setEmail(selectedClient.email);
      setCompany(selectedClient.company);
      setPassword(selectedClient.password);
    }
  };

  useEffect(() => {
    setCurrentPage(1)
  }, [nameSearch, companySearch, emailSearch])


  const togglePasswordVisibility = (clientId) => {
    setPasswordVisible((prevState) => ({
      ...prevState,
      [clientId]: !prevState[clientId]
    }));
  };


  const handleDelete = (clientId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this client?');
    if (!confirmDelete) {
      return;
    }
    dispatch(deleteClient(clientId));
  };

  const handleSave = async (_id) => {
    const confirmEdit = window.confirm('Are you sure you want to save changes for this client?');
    if (!confirmEdit) {
      return;
    }
    await dispatch(updateClient({ name, email, company, password, _id }))
    setEditedClientId(null);
  };




  const handleApproval = (_id) => {
    dispatch(updateClientApproval(_id))
  }


  const resetFilter = async () => {
    if (!nameSearch && !emailSearch && !companySearch) return
    setNameSearch("")
    setCompanySearch("")
    setEmailSearch("")
  }








  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearch({
        name: nameSearch,
        company: companySearch,
        email: emailSearch,
      });
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [nameSearch, companySearch, emailSearch]);

  useEffect(() => {
    dispatch(getAllClients(debouncedSearch));
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


  useEffect(() => {
    if (companySearch.length === 0) {
      setShowCompanyOptions(false)
    }
    else {
      setShowCompanyOptions(true)
    }
  }, [companySearch])


  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClients = clients && clients.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  return (
    <div>
      <div className="overflow-x-auto w-[98%] mx-auto ">
        <div className='flex-col md:flex-row gap-4 md:flex-wrap flex items-center'>
          <input
            type="text"
            placeholder="Search by name..."
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            className="px-4 py-2 my-4 w-full  md:w-[20%] border border-gray-200 hover:border-blue-500 outline-none rounded-lg"
            list='clientNameOptions'
          />
          {
            showNameOptions && <datalist id="clientNameOptions">
              {clients &&
                Array.from(new Set(clients.map((client) => client.name && client.name))).map(
                  (name) => (
                    <option key={name} value={name} />
                  )
                )}
            </datalist>
          }
          <input
            type="text"
            placeholder="Search by company..."
            value={companySearch}
            onChange={(e) => setCompanySearch(e.target.value)}
            className="px-4 py-2 my-4 w-full  md:w-[20%] border border-gray-200 hover:border-blue-500 outline-none rounded-lg"
            list='clientCompanyOptions'
          />

          {
            showCompanyOptions && <datalist id="clientCompanyOptions">
              {clients &&
                Array.from(new Set(clients.map((client) => client.company && client.company))).map(
                  (company) => (
                    <option key={company} value={company} />
                  )
                )}
            </datalist>
          }
          <input
            list='clientEmailOptions'
            type="text"
            placeholder="Search by email..."
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
            className="px-4 py-2 my-4 w-full  md:w-[20%] border border-gray-200 hover:border-blue-500 outline-none rounded-lg"
          />
          {
            showEmailOptions && <datalist id="clientEmailOptions">
              {clients &&
                Array.from(new Set(clients.map((client) => client.email && client.email))).map(
                  (email) => (
                    <option key={email} value={email} />
                  )
                )}
            </datalist>
          }
          <div className='flex gap-4'>

            <button onClick={resetFilter} className='bg-white border border-gray-200 py-1 px-4'>Reset All</button></div>
        </div>


        {loading ? (
          <Loader />
        ) : (
          <>

            <table className="min-w-full divide-y divide-gray-200 shadow-lg border border-gray-200" >
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="px-2 py-2 w-4 text-left text-sm font-bold">SNo.</th>
                  <th className="px-6 py-2 w-1/5 text-left text-sm font-bold">Customer Name</th>
                  <th className="px-6 py-2 w-1/5 text-left text-sm font-bold">Company Name</th>
                  <th className="px-6 py-2 w-1/5 text-left text-sm font-bold">Email</th>
                  {/* <th className="px-6 py-2 text-left text-sm font-bold min-w-[300px]">Password</th> */}
                  <th className="px-6 py-2 w-1/5 text-left text-sm font-bold">Actions</th>
                  <th className="px-6 py-2 w-1/5 text-left text-sm font-bold">Approved</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* filteredClients &&
                filteredClients.length > 0 &&
                filteredClients.map */}
                {
                  paginatedClients && paginatedClients.length > 0 && paginatedClients.map((client, index) => (
                    <tr key={client._id} className="hover:bg-gray-50">
                      <td className='px-2 py-2 whitespace-nowrap w-2'>   <span className="px-2 py-1">  {(currentPage - 1) * itemsPerPage + index + 1}</span></td>
                      <td className="px-6 py-2 whitespace-nowrap ">
                        {editedClientId === client._id ? (
                          <input
                            type="text"
                            name="name"
                            value={name}
                            // onChange={(event) => handleInputChange(event, client._id)}
                            onChange={(e) => setName(e.target.value)}
                            className="px-2 py-1 outline-none w-full box-border shadow"
                          />
                        ) : (
                          <span className="px-2 py-1">{client.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {editedClientId === client._id ? (
                          <input
                            type="text"
                            name="company"
                            value={company}
                            // onChange={(event) => handleInputChange(event, client._id)}
                            onChange={(e) => setCompany(e.target.value)}
                            className="px-2 py-1 outline-none w-full box-border shadow"
                          />
                        ) : (
                          <span className="px-2 py-1">{client.company}</span>
                        )}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {editedClientId === client._id ? (
                          <input
                            type="email"
                            name="email"
                            value={email}
                            // onChange={(event) => handleInputChange(event, client._id)}
                            onChange={(e) => setEmail(e.target.value)}
                            className="px-2 py-1 outline-none w-full box-border shadow"
                          />
                        ) : (
                          <span className="px-2 py-1">{client.email}</span>
                        )}
                      </td>
                      {/* <td className=" py-2 whitespace-nowrap w-[330px] px-6" >
                        {editedClientId === client._id ? (
                          <input
                            type="text"
                            name="password"
                            value={password}
                            // onChange={(event) => handleInputChange(event, client._id)}
                            onChange={(e) => setPassword(e.target.value)}
                            className="px-2 py-1 outline-none box-border shadow w-full"
                          />
                        ) : (
                          <div className=" py-1 flex justify-between items-center  gap-2">
                            <span>  {
                              passwordVisible[client._id] ? client.password : '*'.repeat(client.password.length)
                            }</span>

                            <button className='text-blue-500' onClick={() => togglePasswordVisibility(client._id)}>
                              {passwordVisible[client._id] ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </button>
                          </div>
                        )}
                      </td> */}
                      <td className="px-6 py-2 whitespace-nowrap">
                        {editedClientId === client._id ? (
                          <div>
                            <button
                              className="text-blue-500 text-xl hover:text-blue-800 mr-2"
                              onClick={() => handleSave(client._id)}
                            >
                              <AiTwotoneSave />
                            </button>
                            <button
                              className="text-red-500 text-xl hover:text-red-800 "
                              onClick={() => setEditedClientId(null)}
                            >
                              <MdCancel />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <button
                              className=" text-blue-500  hover:text-blue-800 text-xl mr-2"
                              onClick={() => handleEdit(client._id)}
                            >
                              <AiFillEdit />
                            </button>
                            <button
                              className=" text-red-500 text-xl hover:text-red-800"
                              onClick={() => handleDelete(client._id)}
                            >
                              <AiFillDelete />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-6 whitespace-nowrap text-center">
                        <input
                          type="checkbox"
                          checked={client.approve}
                          onChange={() => handleApproval(client._id)}
                          className="form-checkbox h-3 w-3 text-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {
              !clients || clients.length == 0 && <p className='text-2xl text-gray-600 text-center py-8'>Client not found...</p>
            }
          </>
        )}
      </div>


      {clients && clients.length > 0 && (
        <div className="flex item-center justify-center mt-4 w-full">
          <footer className="inline-flex rounded-md shadow">
            <ul className="flex space-x-2">
              {Array.from({ length: Math.ceil(clients.length / itemsPerPage) }, (_, index) => (
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
      )}

    </div>


  );
};

export default ClientTable;
