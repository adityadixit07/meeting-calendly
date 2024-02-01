import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../layout/Loader';
import { getAllBookedEvents, profile } from '../redux/userSlice';

const UserEventHistory = () => {
  const dispatch = useDispatch();
  const [events, setEvents] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchEventName, setSearchEventName] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const { user, loading, events: bookedEvent } = useSelector((state) => state.auth);

  useEffect(() => {
    if (bookedEvent) {
      setEvents(bookedEvent);
    }
  }, [bookedEvent]);


  useEffect(() => {
    dispatch(getAllBookedEvents())
  }, [dispatch])

  useEffect(() => {
    filterEvents();
  }, [searchName, searchEmail, searchEventName, searchCompany, events, selectedFromDate, selectedToDate]);

  const filterEvents = () => {
    const filteredEvents = events?.filter((item) => {
      if (!item.client) return null;
      const { name, email, company } = item?.client;
      const { from, event_name } = item;
      const nameMatch = name && name.toLowerCase().includes(searchName.toLowerCase());
      const emailMatch = email && email.toLowerCase().includes(searchEmail.toLowerCase());
      const eventNameMatch = event_name && event_name.toLowerCase().includes(searchEventName.toLowerCase());
      const companyMatch = company && company.toLowerCase().includes(searchCompany.toLowerCase());
      
      const eventDate = new Date(from).toLocaleDateString();
      const formattedSelectedFromDate = selectedFromDate?.toLocaleDateString();
      const formattedSelectedToDate = selectedToDate?.toLocaleDateString();

      // Check if the event occurs on the selected date or within the selected date range
      return (
        (searchName === '' || nameMatch) &&
        (searchEmail === '' || emailMatch) &&
        (searchEventName === '' || eventNameMatch) &&
        (searchCompany === '' || companyMatch) &&
        (!selectedFromDate ||
          eventDate === formattedSelectedFromDate ||
          (formattedSelectedFromDate &&
            formattedSelectedToDate &&
            eventDate >= formattedSelectedFromDate &&
            eventDate <= formattedSelectedToDate))
      );
    });

    setSearchResults(filteredEvents);
  };

  const resetFilters = () => {
    setSearchName('');
    setSearchEmail('');
    setSearchEventName('');
    setSearchCompany('');
    setSelectedFromDate(null);
    setSelectedToDate(null);
  };

  const handleFromDateChange = (e) => {
    const selectedDateString = e.target.value;
    const selectedDateObject = new Date(selectedDateString);
    setSelectedFromDate(selectedDateObject);
  };

  const handleToDateChange = (e) => {
    const selectedDateString = e.target.value;
    const selectedDateObject = new Date(selectedDateString);
    setSelectedToDate(selectedDateObject);
  };

  useEffect(() => {
    dispatch(profile());
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
  const isDateInPast = (dateString) => {
    const givenDate = new Date(dateString);
    const currentDate = new Date();

    givenDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    return givenDate < currentDate;
  };


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;



  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = searchResults && searchResults.slice(startIndex, endIndex);

  return (
    <div className='min-h-screen'> <div className="container mx-auto">
      <div className="mb-4 flex-wrap flex items-center gap-4 px-2">
        <input
          type="text"
          placeholder="Client Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-[150px] bg-white outline-none border border-gray-300 rounded-md py-2 px-4 mb-2 w-72"
          list="nameOptions"
        />
        <input
          type="text"
          placeholder="Company"
          value={searchCompany}
          onChange={(e) => setSearchCompany(e.target.value)}
          className="w-[150px] bg-white outline-none border border-gray-300 rounded-md py-2 px-4 mb-2 w-72"
          list="companyOptions"
        />
        <input
          type="text"
          placeholder="Event Name"
          value={searchEventName}
          onChange={(e) => setSearchEventName(e.target.value)}
          className="w-[150px] bg-white outline-none border border-gray-300 rounded-md py-2 px-4 mb-2 w-72"
          list="eventOptions"
        />
        <datalist id="nameOptions">
          {events &&
            Array.from(new Set(events.map((event) => event.client && event.client.name))).map(
              (name) => (
                <option key={name} value={name} />
              )
            )}
        </datalist>
        <datalist id="emailOptions">
          {events &&
            Array.from(new Set(events.map((event) => event.client && event.client.email))).map(
              (email) => (
                <option key={email} value={email} />
              )
            )}
        </datalist>
        <datalist id="companyOptions">
          {events &&
            Array.from(new Set(events.map((event) => event.client && event.client.company))).map(
              (company) => (
                <option key={company} value={company} />
              )
            )}
        </datalist>
        <datalist id="eventOptions">
          {events &&
            Array.from(new Set(events.map((event) => event.event_name))).map((eventName) => (
              <option key={eventName} value={eventName} />
            ))}
        </datalist>
        <div className="flex items-center gap-2">
          <label className="text-white font-semibold">From:</label>
          <input
            type="date"
            placeholder="Select From Date"
            value={selectedFromDate ? selectedFromDate.toISOString().split('T')[0] : ''}
            onChange={handleFromDateChange}
            className="w-[200px] cursor-pointer bg-white outline-none border border-gray-300 rounded-md py-2 px-4 mb-2 w-72"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-white font-semibold">To:</label>
          <input
            type="date"
            placeholder="Select To Date"
            value={selectedToDate ? selectedToDate.toISOString().split('T')[0] : ''}
            onChange={handleToDateChange}
            className="w-[200px] cursor-pointer bg-white outline-none border border-gray-300 rounded-md py-2 px-4 mb-2 w-72"
          />
        </div>
        <button onClick={resetFilters} className="bg-white px-2 py-1 shadow">
          Reset
        </button>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-lg">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-3 px-6 text-left text-sm font-bold">SNo.</th>
                <th className="py-3 px-6 text-left text-sm font-bold">Event Name</th>
                <th className="py-3 px-6 text-left text-sm font-bold">Client Name</th>
                <th className="py-3 px-6 text-left text-sm font-bold">Client Email</th>
                <th className="py-3 px-6 text-left text-sm font-bold">Company</th>
                <th className="py-3 px-6 text-left text-sm font-bold">From</th>
                <th className="py-3 px-6 text-left text-sm font-bold">To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedResults && paginatedResults.length > 0 ? (
                paginatedResults.map((item, index) => (
                  <tr key={item._id} className={isDateInPast(item.from) ? "bg-gray-100" : "hover:bg-gray-50"}>
                    <td className="py-2 px-6 whitespace-nowrap">{index + 1}</td>
                    <td className="py-2 px-6 whitespace-nowrap">{item.event_name}</td>
                    <td className="py-2 px-6 whitespace-nowrap">{item?.client?.name}</td>
                    <td className="py-2 px-6 whitespace-nowrap">{item?.client?.email}</td>
                    <td className="py-2 px-6 whitespace-nowrap">{item?.client?.company}</td>
                    <td className="py-2 px-6 whitespace-nowrap">{formatDate(item.from)}</td>
                    <td className="py-2 px-6 whitespace-nowrap">{formatDate(item.to)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 px-6 text-center">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>


      <div className={searchResults && searchResults.length < 15 ? "flex justify-center  fixed bottom-0 w-full" : "flex justify-center  w-full"}>
        <footer className="inline-flex rounded-md shadow">
          <ul className="flex space-x-2">
            {Array.from({ length: Math.ceil(searchResults && searchResults.length / itemsPerPage) }, (_, index) => (
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
      </div></div>
  );
};

export default UserEventHistory;
