import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { createEvent } from '../redux/eventSlice';
import {  useNavigate } from 'react-router-dom';

const CreateEventFirst = () => {
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [eventName, setEventName] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [description, setDescription] = useState('');
    const [custom, setCustom] = useState(false);
    const [custormTime, setCustomTime] = useState('');
    const [timeDuration, setTimeDuration] = useState('');
    const [weekdays, setWeekdays] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


    const handleWeekdayChange = (e) => {
        const day = e.target.value;
        const isChecked = e.target.checked;

        if (isChecked) {
            setWeekdays((prevWeekdays) => [...prevWeekdays, day]);
        } else {
            setWeekdays((prevWeekdays) => prevWeekdays.filter((selectedDay) => selectedDay !== day));
        }
    };
    const handleTimeSlotAdd = () => {
        if (startTime && endTime) {
            const formattedStartTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const formattedEndTime = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const timeSlot = `${formattedStartTime} - ${formattedEndTime}`;
            setTimeSlots((prevTimeSlots) => [...prevTimeSlots, timeSlot]);
            setStartTime(null);
            setEndTime(null);
        }
    };

    const handleTimeSlotRemove = (slot) => {
        setTimeSlots((prevTimeSlots) => prevTimeSlots.filter((timeSlot) => timeSlot !== slot));
    };

    const handleEventNameChange = (e) => {
        setEventName(e.target.value);
    };

    const handleEventLocationChange = (e) => {
        setEventLocation(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };



    const handleTimeDurationChange = (e) => {
        setTimeDuration(e.target.value);
        if (e.target.value === "custom") {
            setCustom(true);
        }
        else {
            setCustom(false)
            setCustomTime('')
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(
            createEvent({
                name: eventName,
                location: eventLocation,
                description,
                duration: timeDuration === 'custom' ? custormTime : timeDuration,
                timeSlots,
                weekdays
            })
        );

        setEventName('')
        setTimeSlots('')
        setWeekdays('')
        setTimeDuration('')
        setDescription('')
        setEventLocation('')
        navigate('/user/scheduledevents');
    };



    return (
        <div className="container mx-auto py-8 px-4  lg:px-8">
            <div className="bg-white shadow-lg rounded-lg p-8 lg:w-[60%] md:w-[90%] w-full mx-auto">
                <h1 className="text-2xl text-gray-600 font-bold mb-6">Create an Event</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="eventName" className="text-gray-600 block font-bold mb-2">
                            Event Name
                        </label>
                        <input
                            type="text"
                            id="eventName"
                            value={eventName}
                            onChange={handleEventNameChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                            placeholder="Enter event name"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="eventLocation" className="text-gray-600 block font-bold mb-2">
                            Event Location
                        </label>
                        <input
                            type="text"
                            id="eventLocation"
                            value={eventLocation}
                            onChange={handleEventLocationChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                            placeholder="Enter event location"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="text-gray-600 block font-bold mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={handleDescriptionChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                            placeholder="Enter event description"
                            rows="4"
                            required
                        ></textarea>
                    </div>




                    <div className="mb-6">
                        <label htmlFor="timeDuration" className="text-gray-600 block font-bold mb-2">
                            Time Duration
                        </label>
                        <select
                            id="timeDuration"
                            value={timeDuration}
                            onChange={handleTimeDurationChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                            required
                        >
                            <option value="">Select a duration</option>
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">60 minutes</option>
                            <option value="custom" >Custom</option>
                        </select>
                    </div>
                    {
                        custom && <div className="mb-6">
                            <label htmlFor="custom-time" className="text-gray-600 block font-bold mb-2">
                                Time in min
                            </label>
                            <input
                                type="text"
                                id="custom-time"
                                value={custormTime}
                                onChange={(e) => setCustomTime(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-r focus:outline-none"
                                placeholder="Enter Time"
                                required
                            />
                        </div>
                    }


                    <div className="bg-white p-8 shadow-md rounded-md my-4 mx-auto">
                        <h2 className="text-2xl font-bold mb-6">Availability</h2>
                        <div className="mb-4">
                            <label htmlFor="weekdays" className="block mb-2 font-bold">
                                Available days
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {daysOfWeek.map((day, index) => (
                                    <div key={index + 1} className="flex flex-col border border-gray-300 px-4 py-2 rounded-md mb-2">
                                        <input
                                            type="checkbox"
                                            value={day}
                                            onChange={handleWeekdayChange}
                                            className="mr-2"
                                            checked={weekdays.includes(day)}
                                        />
                                        <label className="text-sm">{day}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="timeSlots" className="block mb-2 font-bold">
                                Available hours
                            </label>
                            <div className="flex flex-col gap-4">
                                {timeSlots.map((slot) => (
                                    <div
                                        key={slot}
                                        className="flex shadow-sm pl-4 py-2 items-center space-x-2 flex-wrap sm:flex-nowrap"
                                    >
                                        <span>{slot}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleTimeSlotRemove(slot)}
                                            className="bg-red-500 text-sm text-white px-2 py-1 rounded-md"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4">
                                <div className="">
                                    <DatePicker
                                        selected={startTime}
                                        onChange={(time) => setStartTime(time)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"
                                        className="border border-gray-300 px-4 py-2 rounded-md w-full outline-none"
                                    />
                                </div>
                                <span> - </span>
                                <div className="">
                                    <DatePicker
                                        selected={endTime}
                                        onChange={(time) => setEndTime(time)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"
                                        className="border border-gray-300 px-4 py-2 rounded-md w-full outline-none"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleTimeSlotAdd}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 sm:mt-0"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEventFirst;
