import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from '../layout/Loader';
import {  getClientProfile, logoutClient } from '../redux/clientSlice';
import { FiLogOut } from 'react-icons/fi';

const ClientEventHistory = () => {
  const { client, loading } = useSelector((state) => state.client);
  const [events, setEvents] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [searchEvent, setSearchEvent] = useState('');

  const [showNameOptions, setShowNameOptions] = useState(false);
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const [showEventOptions, setShowEventOptions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [searchResults, setSearchResults] = useState([]);

  const dispatch = useDispatch();

  const logOutHandler = () => {
    dispatch(logoutClient());
  };




  useEffect(() => {
    if (client && client?.events) {
      setEvents(client?.events || []);
    }
  }, []);


  useEffect(() => {
    const filterEvents = () => {
      const filteredEvents = events?.filter((item) => {
        if (!item.user) return null;
        const { name, email } = item.user;
        const { from, to, event_name } = item;
        const nameMatch = name && name.toLowerCase().includes(searchName.toLowerCase());
        const emailMatch = email && email.toLowerCase().includes(searchEmail.toLowerCase());
        const eventMatch = event_name && event_name.toLowerCase().includes(searchEvent.toLowerCase());
        const eventDate = new Date(from).toLocaleDateString();
        const formattedSelectedFromDate = selectedFromDate?.toLocaleDateString();
        const formattedSelectedToDate = selectedToDate?.toLocaleDateString();

        // Check if the event occurs on the selected date or within the selected date range
        return (
          (searchName === '' || nameMatch) &&
          (searchEmail === '' || emailMatch) &&
          (searchEvent === '' || eventMatch) &&
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

    filterEvents();
  }, [searchName, searchEmail, searchEvent, events, selectedFromDate, selectedToDate]);



  const resetFilters = () => {
    setSearchName('');
    setSearchEmail('');
    setSearchEvent('');
    setSelectedFromDate(null);
    setSelectedToDate(null);
  };

  useEffect(() => {
    dispatch(getClientProfile());
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



  const nameOptions = [...new Set(events?.map((event) => event.user && event.user.name))];
  const eventOptions = [...new Set(events?.map((event) => event.event_name))];
  const emailOptions = [...new Set(events?.map((event) => event.user && event.user.email))];
  const handleNameChange = (e) => {
    setSearchName(e.target.value);
    setShowNameOptions(e.target.value.length > 0);
    setCurrentPage(1)
  };

  const handleEmailChange = (e) => {
    setSearchEmail(e.target.value);
    setShowEmailOptions(e.target.value.length > 0);
    setCurrentPage(1)
  };

  const handleEventChange = (e) => {
    setSearchEvent(e.target.value)
    setShowEventOptions(e.target.value.length > 0)
    setCurrentPage(1)
  }

  const handleFromDateChange = (e) => {
    const selectedDateString = e.target.value;
    const selectedDateObject = new Date(selectedDateString);
    setSelectedFromDate(selectedDateObject);
    setCurrentPage(1)
  };

  const handleToDateChange = (e) => {
    const selectedDateString = e.target.value;
    const selectedDateObject = new Date(selectedDateString);
    setSelectedToDate(selectedDateObject);
    setCurrentPage(1)
  };
  const sortByDateTime = (a, b) => {
    const parseDateTime = (datetime) => {
      console.log(datetime);
      const [datePart, timePart] = datetime.split('.')[0].split('T');
      console.log(new Date(`${datePart} ${timePart}`));
      const [day, month, year] = datePart.split('/')[0].split(' ');
      const [time, amPm] = timePart.split(' ');

      // Parse the time component with AM/PM adjustment
      const [hour, minute] = time.split(':').map(Number);
      let parsedHour = hour;
      if (amPm === 'PM' && hour !== 12) {
        parsedHour += 12;
      } else if (amPm === 'AM' && hour === 12) {
        parsedHour = 0;
      }

      // Create a new Date object with the parsed date and time
      const parsedDate = new Date(year, month - 1, day, parsedHour, minute);

      return parsedDate;
    };

    // Compare dates in descending order
    const dateComparison = parseDateTime(b.from) - parseDateTime(a.from);
    if (dateComparison !== 0) return dateComparison;

    // If the dates are equal, compare times in ascending order
    const timeComparison = parseDateTime(a.from).getTime() - parseDateTime(b.from).getTime();
    return timeComparison;
  };

  const sortedSearchResults = searchResults && [...searchResults].sort(sortByDateTime);









  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = sortedSearchResults && sortedSearchResults.slice(startIndex, endIndex);



  const activeLinkStyle = {
    color: "rgb(0 0 0)",
    backgroundColor: "#bad900",
    padding: "2px 12px",
    borderRadius: "5px"
  };

  const activePath = window.location.pathname

  return (
    <div className="mt-0 min-h-screen flex flex-col justify-between gap-4">
      <div>  <div className="flex h-[66px] z-10 justify-between fixed top-0 left-0 right-0  px-1 md:px-4">
        <div className="flex items-center gap-1 md:gap-4">
          <Link style={activePath === "/client/events" ? activeLinkStyle : {}} className=" px-2 py-1 rounded text-white" to="/client/events">
            Events
          </Link>
          <Link style={activePath === "/users" ? activeLinkStyle : {}} className=" px-2 py-1 rounded text-white" to="/users">
            Users
          </Link>
        </div>
        <button onClick={logOutHandler} className="">
          <FiLogOut className="text-2xl text-blue-500 cursor-pointer" />
        </button>
      </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="mt-16 flex-wrap flex items-center gap-4 px-2">
              <input
                type="text"
                placeholder="Search by Expert Name"
                value={searchName}
                onChange={handleNameChange}
                className="w-[200px] bg-white outline-none border border-gray-300 rounded-md py-1 px-4 mb-2 w-72"
                list="nameOptions"
              />
              {showNameOptions && (
                <datalist id="nameOptions">
                  {nameOptions.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              )}

              <input
                type="text"
                placeholder="Search by Event Name"
                value={searchEvent}
                onChange={handleEventChange}
                className="w-[200px] bg-white outline-none border border-gray-300 rounded-md py-1 px-4 mb-2 w-72"
                list="eventOptions"
              />
              {showEventOptions && (
                <datalist id="eventOptions">
                  {eventOptions.map((event) => (
                    <option key={event} value={event} />
                  ))}
                </datalist>
              )}

              <input
                type="text"
                placeholder="Search by Expert Email"
                value={searchEmail}
                onChange={handleEmailChange}
                className="w-[200px] bg-white outline-none border border-gray-300 rounded-md py-1 px-4 mb-2 w-72"
                list="emailOptions"
              />
              {showEmailOptions && (
                <datalist id="emailOptions">
                  {emailOptions.map((email) => (
                    <option key={email} value={email} />
                  ))}
                </datalist>
              )}

              <div className="flex items-center gap-2">
                <label className="text-white font-semibold">From : </label>
                <input
                  type="date"
                  placeholder="Select From Date"
                  value={selectedFromDate ? selectedFromDate.toISOString().split('T')[0] : ''}
                  onChange={handleFromDateChange}
                  className="w-[200px] cursor-pointer bg-white outline-none border border-gray-300 rounded-md py-1 px-4 mb-2 w-72"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-white font-semibold">To : </label>
                <input
                  type="date"
                  placeholder="Select To Date"
                  value={selectedToDate ? selectedToDate.toISOString().split('T')[0] : ''}
                  onChange={handleToDateChange}
                  className="w-[200px] cursor-pointer bg-white outline-none border border-gray-300 rounded-md py-1 px-4 mb-2 w-72"
                />
              </div>
              <button onClick={resetFilters} className="bg-white px-2 py-1 shadow">
                Reset
              </button>
            </div>

            <div className="overflow-x-auto py-2">
              <table className="min-w-full bg-white border rounded-lg shadow-lg">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="py-1 px-6 text-left text-sm font-bold">SNo.</th>
                    <th className="py-1 px-6 text-left text-sm font-bold">Event Name</th>
                    <th className="py-1 px-6 text-left text-sm font-bold">Expert Name</th>
                    <th className="py-1 px-6 text-left text-sm font-bold">Expert Email</th>
                    <th className="py-1 px-6 text-left text-sm font-bold">From</th>
                    <th className="py-1 px-6 text-left text-sm font-bold">To</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedResults && paginatedResults.length > 0 ? (
                    paginatedResults.map((item, index) => (
                      <tr key={item._id} className={isDateInPast(item.from) ? "bg-gray-100 " : "hover:bg-gray-50"} >
                        <td className="py-1 px-6 whitespace-nowrap">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="py-1 px-6 whitespace-nowrap">{item.event_name}</td>
                        <td className="py-1 px-6 whitespace-nowrap">
                          {item.user && item.user.name}
                        </td>
                        <td className="py-1 px-6 whitespace-nowrap">
                          {item.user && item.user.email}
                        </td>
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
                      <td colSpan={6} className="py-4 px-6 text-center">
                        No events found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}</div>

      <div className={" w-full "}><div className="flex justify-center" >
        <footer className="inline-flex rounded-md shadow">
          <ul className="flex space-x-2">
            {Array.from({ length: Math.ceil(sortedSearchResults && sortedSearchResults.length / itemsPerPage) }, (_, index) => (
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

export default ClientEventHistory;
