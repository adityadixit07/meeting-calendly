import React, { useState, useRef, useEffect } from 'react';
import { MdOutlineContentCopy } from 'react-icons/md';
import { AiOutlineCheck } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { profile } from '../redux/userSlice';
import { editEvent } from '../redux/eventSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EventCard = ({ name, location, duration, id, deleteEventHandler, timeSlots, weekdays, description }) => {
  const dispatch = useDispatch();
  const modal = useRef(null);
  const [isCopied, setIsCopied] = useState(false);
  const [updateName, setUpdateName] = useState(name);
  const [updateDescription, setUpdateDescription] = useState(description);
  const [updateLocation, setUpdateLocation] = useState(location);
  const [updateDuration, setUpdateDuration] = useState(duration);
  const [updateWeekdays, setUpdateWeekdays] = useState(weekdays);
  const [updateTimeSlots, setUpdateTimeSlots] = useState(timeSlots);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [originalEventData, setOriginalEventData] = useState({});

  const copyEventLink = () => {
    const eventLink = `https://meet.ceoitbox.com`;
    navigator.clipboard.writeText(eventLink);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  function openModal() {
    setOriginalEventData({
      updateName: name,
      updateLocation: location,
      updateDuration: duration,
      updateWeekdays: weekdays,
      updateTimeSlots: timeSlots,
      updateDescription: description
    });
    modal.current.showModal();
  }

  function closeModal() {
    modal.current.close();
  }

  const handleTimeSlotAdd = () => {
    if (startTime && endTime) {
      const formattedStartTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const formattedEndTime = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const timeSlot = `${formattedStartTime} - ${formattedEndTime}`;
      setUpdateTimeSlots((prevTimeSlots) => [...prevTimeSlots, timeSlot]);
      setStartTime(null);
      setEndTime(null);
    }
  };

  const handleTimeSlotRemove = (slot) => {
    setUpdateTimeSlots((prevTimeSlots) => prevTimeSlots.filter((timeSlot) => timeSlot !== slot));
  };

  const handleWeekdayChange = (e, day) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setUpdateWeekdays((prevWeekdays) => [...prevWeekdays, day]);
    } else {
      setUpdateWeekdays((prevWeekdays) => prevWeekdays.filter((selectedDay) => selectedDay !== day));
    }
  };

  const handleSaveClick = async () => {
    const shouldSave = window.confirm('Are you sure you want to save this event?');
    if (!shouldSave) return;

    await dispatch(editEvent({
      id,
      updateName,
      updateLocation,
      updateDuration,
      updateWeekdays,
      updateTimeSlots,
      updateDescription
    }));

    dispatch(profile());
    closeModal();
  };

  useEffect(() => {
    if (modal.current && modal.current.open) {
      setUpdateName(originalEventData.updateName);
      setUpdateLocation(originalEventData.updateLocation);
      setUpdateDuration(originalEventData.updateDuration);
      setUpdateWeekdays(originalEventData.updateWeekdays);
      setUpdateTimeSlots(originalEventData.updateTimeSlots);
      setUpdateDescription(originalEventData.updateDescription)
    }
  }, [originalEventData]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className='text-gray-500 flex items-center gap-2'>
        <span className="font-bold w-[70px]">Name:</span>
        <span>{name}</span>
      </div>

      <div className="text-gray-500 flex items-center gap-2 my-2">
        <span className="font-bold w-[70px]">Duration:</span>
        <span>{duration} minutes</span>
      </div>

      <div className="text-gray-500 w-full flex items-center gap-2">
        <span className="font-bold w-[70px]">Location:</span>
        <span>{location}</span>
      </div>
      <div className="text-gray-500 flex items-center gap-2 mt-2">
        <span className="font-bold w-[70px]">Days:</span>
        <div className='flex flex-wrap gap-2'>{
          weekdays && weekdays.map((day) => {
            return <span className='shadow p-1 px-2'>{day}</span>
          })
        }</div>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button
          className="border border-gray-300 rounded-full px-4 py-1 text-gray-500 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-100 transition-colors focus:outline-none"
          onClick={openModal}
        >
          Edit
        </button>
        <button
          className="border border-gray-300 rounded-full px-4 py-1 text-gray-500 hover:text-red-600 hover:border-red-500 hover:bg-red-100 transition-colors focus:outline-none"
          onClick={() => deleteEventHandler(id)}
        >
          Delete
        </button>
        <button
          className="flex items-center w-32 text-blue-500 hover:text-blue-600 focus:outline-none ml-8"
          onClick={copyEventLink}
        >
          {isCopied ? <AiOutlineCheck className='text-xl' /> : <MdOutlineContentCopy />}
          <span className="text-gray-500">{isCopied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <dialog ref={modal}>
        <div>
          <h1 className='text-2xl my-2 text-gray-900'>Edit Event</h1>
          <div className="mb-2">
            <label htmlFor="eventName" className="text-gray-600 block font-bold mb-2">Event Name</label>
            <input type="text" value={updateName} onChange={(e) => setUpdateName(e.target.value)} className='w-full px-3 py-1 border border-gray-300 rounded focus:outline-none' />
          </div>
          <div className="mb-2">
            <label className="text-gray-600 block font-bold mb-2">Event Location</label>
            <input type="text" value={updateLocation} onChange={(e) => setUpdateLocation(e.target.value)} className='w-full px-3 py-1 border border-gray-300 rounded focus:outline-none' />
          </div>
          <div className="mb-2">
            <label className="text-gray-600 block font-bold mb-2">Time Duration (minutes)</label>
            <input type="text" value={updateDuration} onChange={(e) => setUpdateDuration(e.target.value)} className='w-full px-3 py-1 border border-gray-300 rounded focus:outline-none' />
          </div>
          <div className="mb-2">
            <label className="text-gray-600 block font-bold mb-2">Description</label>
            <input type="text" value={updateDescription} onChange={(e) => setUpdateDescription(e.target.value)} className='w-full px-3 py-1 border border-gray-300 rounded focus:outline-none' />
          </div>
          <div className="mb-2">
            <label className="text-gray-600 block font-bold mb-2">Available days</label>
            <div className="flex flex-wrap gap-2">{daysOfWeek.map((day) => (
              <div key={day} className='flex flex-col border border-gray-300 px-4 py-2 rounded-md mb-2'>
                <input
                  type="checkbox"
                  value={day}
                  checked={updateWeekdays.includes(day)}
                  onChange={(e) => handleWeekdayChange(e, day)}
                  className="mr-2"
                />
                <label className="text-sm">{day}</label>
              </div>
            ))}</div>
          </div>
          <div className="mb-2">
            <label className="text-gray-600 block font-bold mb-2">Available hours</label>
            <div className="flex flex-col gap-4 mb-1">{updateTimeSlots.map((slot) => (
              <div key={slot} className="flex shadow-sm pl-4 py-1 items-center space-x-2 flex-wrap sm:flex-nowrap">
                <span>{slot}</span>
                <button type="button" onClick={() => handleTimeSlotRemove(slot)} className="bg-red-500 text-sm text-white px-2 py-1 rounded-md">
                  Remove
                </button>
              </div>
            ))}</div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}>
              <DatePicker
                selected={startTime}
                onChange={(time) => setStartTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="border border-gray-300 px-4 py-1 rounded-md w-full outline-none w-[100px]"
              />
              <span> - </span>
              <DatePicker
                selected={endTime}
                onChange={(time) => setEndTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="border border-gray-300 px-4 py-1 rounded-md w-full outline-none w-[100px]"
              />
              <button type="button" className="bg-blue-500 text-white px-4 py-1 rounded-md" onClick={handleTimeSlotAdd}>
                Add
              </button>
            </div>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4" onClick={handleSaveClick}>Save</button>
          <button className="bg-red-500  text-white px-4 py-2 rounded-md" onClick={closeModal}>Close</button>
        </div>
      </dialog >
    </div >
  );
};

export default EventCard;
