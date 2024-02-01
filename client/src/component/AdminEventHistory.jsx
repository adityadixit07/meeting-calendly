import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAdmin, getAllBookedEvents, getAllUsers, updateUserApproval } from '../redux/adminSlice';
import Loader from '../layout/Loader';

const AdminEventHistory = () => {
  // const pageinationHeight=
  const [events, setEvents] = useState(null);
  const [nameSearch, setNameSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [clientNameSearch, setClientNameSearch] = useState('');
  const [clientEmailSearch, setClientEmailSearch] = useState('');
  const [eventNameSearch, setEventNameSearch] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchResults, setSearchResults] = useState('');
  const [showNameOptions, setShowNameOptions] = useState(false);
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const [showClientNameOptions, setShowClientNameOptions] = useState(false);
  const [showClientEmailOptions, setShowClientEmailOptions] = useState(false);
  const [showEventNameOptions, setShowEventNameOptions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15
  const dispatch = useDispatch();
  const { admin, loading, events: bookedEvents } = useSelector((state) => state.admin);
  console.log(events);
  useEffect(() => {
    if (bookedEvents) {
      setEvents(bookedEvents)
    }
  }, [bookedEvents]);


  useEffect(() => {
    dispatch(getAllBookedEvents())
  }, [dispatch])

  useEffect(() => {
    const filterEvents = () => {
      const filteredEvents = events?.filter((item) => {
        const { user, client, from, event_name } = item;
        const userNameMatch =
          !nameSearch || (user && user.name.toLowerCase().includes(nameSearch.toLowerCase()));
        const userEmailMatch =
          !emailSearch || (user && user.email.toLowerCase().includes(emailSearch.toLowerCase()));
        const clientNameMatch =
          !clientNameSearch || (client && client.name.toLowerCase().includes(clientNameSearch.toLowerCase()));
        const clientEmailMatch =
          !clientEmailSearch || (client && client.email.toLowerCase().includes(clientEmailSearch.toLowerCase()));
        const eventNameMatch =
          !eventNameSearch || event_name.toLowerCase().includes(eventNameSearch.toLowerCase());
        const eventDate = new Date(from).toLocaleDateString();
        const formattedSelectedFromDate = startDate?.toLocaleDateString();
        const formattedSelectedToDate = endDate?.toLocaleDateString();
        return (
          (nameSearch === '' || userNameMatch) &&
          (emailSearch === '' || userEmailMatch) &&
          (clientNameSearch === '' || clientNameMatch) &&
          (clientEmailSearch === '' || clientEmailMatch) &&
          (eventNameSearch === '' || eventNameMatch) &&
          (!formattedSelectedFromDate ||
            eventDate === formattedSelectedFromDate ||
            (formattedSelectedFromDate &&
              formattedSelectedToDate &&
              eventDate >= formattedSelectedFromDate &&
              eventDate <= formattedSelectedToDate))
        );
      });

      setSearchResults(filteredEvents);
    };

    filterEvents();
  }, [nameSearch, emailSearch, clientNameSearch, clientEmailSearch, eventNameSearch, startDate, endDate, events]);

  const resetFilters = () => {
    setNameSearch('');
    setEmailSearch('');
    setClientNameSearch('');
    setClientEmailSearch('');
    setEventNameSearch('');
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}`;
    return `${formattedDate}, ${formattedTime}`;
  };

  const userNames = events?.map((event) => event.user?.name).filter(Boolean);
  const userEmails = events?.map((event) => event.user?.email).filter(Boolean);
  const clientNames = events?.map((event) => event.client?.name).filter(Boolean);
  const clientEmails = events?.map((event) => event.client?.email).filter(Boolean);
  const eventNames = events?.map((event) => event.event_name).filter(Boolean);

  const handleNameSearchInputChange = (e) => {
    setNameSearch(e.target.value);
    setShowNameOptions(e.target.value.length > 0);
  };

  const handleEmailSearchInputChange = (e) => {
    setEmailSearch(e.target.value);
    setShowEmailOptions(e.target.value.length > 0);
  };

  const handleClientNameSearchInputChange = (e) => {
    setClientNameSearch(e.target.value);
    setShowClientNameOptions(e.target.value.length > 0);
  };

  const handleClientEmailSearchInputChange = (e) => {
    setClientEmailSearch(e.target.value);
    setShowClientEmailOptions(e.target.value.length > 0);
  };

  const handleEventNameSearchInputChange = (e) => {
    setEventNameSearch(e.target.value);
    setShowEventNameOptions(e.target.value.length > 0);
  };


  const isDateInPast = (dateString) => {
    const givenDate = new Date(dateString);
    const currentDate = new Date();

    givenDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    return givenDate < currentDate;
  };


  const sortEventsByFromDate = (events) => {
    return events.sort((a, b) => new Date(b.from) - new Date(a.from));
  };
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedEvents = searchResults && sortEventsByFromDate(searchResults).slice(startIndex, endIndex);



  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (

    <div className='flex flex-col justify-between gap-4 h-screen' >
      <div className="px-2">
        <div className="mb-4 flex flex-wrap gap-4 px-4 items-center mx-auto">
          <input
            type="text"
            placeholder="Search by Expert Name"
            value={nameSearch}
            onChange={handleNameSearchInputChange}
            list="userNameOptions"
            className="outline-none border border-gray-300 rounded px-2 py-1 mr-2"
          />
          {showNameOptions && (
            <datalist id="userNameOptions">
              {userNames &&
                Array.from(new Set(userNames)).map((name) => (
                  <option key={name} value={name} />
                ))}
            </datalist>
          )}

          <input
            type="text"
            placeholder="Search by Expert Email"
            value={emailSearch}
            onChange={handleEmailSearchInputChange}
            list="userEmailOptions"
            className="outline-none border border-gray-300 rounded px-2 py-1 mr-2"
          />
          {showEmailOptions && (
            <datalist id="userEmailOptions">
              {userEmails &&
                Array.from(new Set(userEmails)).map((email) => (
                  <option key={email} value={email} />
                ))}
            </datalist>
          )}

          <input
            type="text"
            placeholder="Search by Client Name"
            value={clientNameSearch}
            onChange={handleClientNameSearchInputChange}
            list="clientNameOptions"
            className="outline-none border border-gray-300 rounded px-2 py-1 mr-2"
          />
          {showClientNameOptions && (
            <datalist id="clientNameOptions">
              {clientNames &&
                Array.from(new Set(clientNames)).map((name) => (
                  <option key={name} value={name} />
                ))}
            </datalist>
          )}

          <input
            type="text"
            placeholder="Search by Client Email"
            value={clientEmailSearch}
            onChange={handleClientEmailSearchInputChange}
            list="clientEmailOptions"
            className="outline-none border border-gray-300 rounded px-2 py-1 mr-2"
          />
          {showClientEmailOptions && (
            <datalist id="clientEmailOptions">
              {clientEmails &&
                Array.from(new Set(clientEmails)).map((email) => (
                  <option key={email} value={email} />
                ))}
            </datalist>
          )}

          <input
            type="text"
            placeholder="Search by Event Name"
            value={eventNameSearch}
            onChange={handleEventNameSearchInputChange}
            list="eventNameOptions"
            className="outline-none border border-gray-300 rounded px-2 py-1 mr-2"
          />
          {showEventNameOptions && (
            <datalist id="eventNameOptions">
              {eventNames &&
                Array.from(new Set(eventNames)).map((event_name) => (
                  <option key={event_name} value={event_name} />
                ))}
            </datalist>
          )}

          <input
            type="date"
            placeholder="Select Start Date"
            value={startDate ? startDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="outline-none border border-gray-300 rounded px-2 py-1 mr-2"
          />
          <input
            type="date"
            placeholder="Select End Date"
            value={endDate ? endDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            className="outline-none border border-gray-300 rounded px-2 py-1"
          />
          <button onClick={resetFilters} className="bg-white px-2 py-1 shadow">
            Reset
          </button>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="w-[99%] mx-auto bg-white border rounded-lg shadow-lg overflow-x-auto">
            <table className="">

              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="py-1 px-2 text-left text-sm font-bold">SNo.</th>
                  <th className="py-1 px-6 text-left text-sm font-bold">Event Name</th>
                  <th className="py-1 px-6 text-left text-sm font-bold">Expert Name</th>
                  <th className="py-1 px-6 text-left text-sm font-bold">Expert Email</th>
                  <th className="py-1 px-6 text-left text-sm font-bold">Client Name</th>
                  <th className="py-1 px-6 text-left text-sm font-bold">Client Email</th>
                  <th className="py-1 px-6 text-left text-sm font-bold">From</th>
                  <th className="py-1 px-6 text-left text-sm font-bold">To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedEvents && paginatedEvents.length > 0 ? (
                  paginatedEvents.map((item, index) => (
                    <tr key={item._id} className={isDateInPast(item.from) ? "bg-gray-100 text-gray-600" : "hover:bg-gray-50"}>
                      <td className="py-1 px-2 whitespace-nowrap">  {(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                      <td className="py-1 px-6 whitespace-nowrap">{item.event_name}</td>
                      <td className="py-1 px-6 whitespace-nowrap">{item.user && item.user.name}</td>
                      <td className="py-1 px-6 whitespace-nowrap">{item.user && item.user.email}</td>
                      <td className="py12 px-6 whitespace-nowrap">{item.client && item.client.name}</td>
                      <td className="py-1 px-6 whitespace-nowrap">{item.client && item.client.email}</td>
                      <td className="py-1 px-6 whitespace-nowrap">
                        {formatDate(item.from)}
                      </td>
                      <td className="py-1 px-6 whitespace-nowrap">
                        {formatDate(item.to)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-4 px-6 text-center">
                      No events found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={" w-full"}><div className="flex justify-center" >
        <footer className="inline-flex rounded-md shadow">
          <ul className="flex space-x-2">
            {Array.from({ length: Math.ceil(searchResults && searchResults.length / PAGE_SIZE) }, (_, index) => (
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
        </footer>
      </div>
      </div>
    </div>
  );
};

export default AdminEventHistory;
