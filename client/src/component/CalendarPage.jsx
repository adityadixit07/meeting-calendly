import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateSelectedDateTime } from '../redux/dateSlice';
import { BiTime } from 'react-icons/bi';
import { FiLogOut } from "react-icons/fi"
import { AiOutlineArrowLeft } from "react-icons/ai"
import moment from 'moment'; // Import Moment.js

import { syncGoogleEvent, getProfile, logoutClient } from '../redux/clientSlice';
import Loader from '../layout/Loader';

const CalendarPage = () => {
  const { loading } = useSelector(state => state.client)
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [disabledDates, setDisabledDates] = useState([]);

  const [event, setEvent] = useState('')
  const { events, user } = useSelector(state => state.client);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [weekdays, setWeekDays] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState("")
  const params = useParams();

  const nextPage = async () => {
    if (!time) return;
    dispatch(updateSelectedDateTime({
      date: selectedDate, timing: time, description: event && event.description,
      organizor: event && event.owner && event.owner.name && event.owner.name,
      duration: event && event.duration, name: event && event.name, eventId: event && event._id,
      loggedEmail: user && user.email && user.email,
      bookedPerson: user && user.name && user.name,
      ownerId: params.user
    }))

    navigate(`/event/share/final`)
  }
  const handleDateClick = (date) => {
    const formattedDate = moment(date).format('MMM DD, YYYY'); // Format date using Moment.js
    setSelectedDate(formattedDate);
  };

  useEffect(() => {
    if (user) {
      const eventData = user.event && user.event.find((item) => item._id === params.eventId);
      setEvent(eventData);
      setWeekDays(eventData.weekdays);
      setHolidays(user.holidays)

      const standardizedTimeRanges = [];

      for (const timeRange of eventData?.timeSlots) {
        const [startTime, endTime] = timeRange.split(' - ');

        const formattedStartTime = moment(startTime, 'hh:mm A').format('HH:mm');
        const formattedEndTime = moment(endTime, 'hh:mm A').format('HH:mm');

        const standardizedTimeRange = `${formattedStartTime} - ${formattedEndTime}`;
        standardizedTimeRanges.push(standardizedTimeRange);
      }
      setTimeSlots(standardizedTimeRanges)
    }
  }, [user, params.eventId])

  useEffect(() => {
    if (event) {
      setDuration(event?.duration)
    }
  }, [event])

  useEffect(() => {
    dispatch(getProfile(params.user))
  }, [params.user, dispatch])

  useEffect(() => {
    const syncEventWithGoogle = async () => {
      if (params.user) {
        try {
          await dispatch(syncGoogleEvent(params.user));
        } catch (error) {
          console.error(error);
        }
      }
    };

    syncEventWithGoogle();
  }, [dispatch, params.user]);

  function divideTimeRange(startTime, endTime, durationInMinutes, timeSlots) {
    const intervals = [];
    const startDate = moment(`01/01/2000 ${startTime}`);
    const endDate = moment(`01/01/2000 ${endTime}`);
    const durationInMillis = durationInMinutes * 60000;
    let currentTime = startDate;

    while (currentTime <= endDate) {
      const timeString = currentTime.format('HH:mm');

      if (isTimeSlotAvailable(timeString, timeSlots, durationInMinutes)) {
        intervals.push(timeString)
      }
      currentTime = currentTime.add(durationInMillis, 'milliseconds');
    }

    return intervals;
  }

  function isTimeSlotAvailable(time, timeSlots, durationInMinutes) {
    const startTimeInMillis = moment(`01/01/2000 ${time}`).valueOf();
    const endTimeInMillis = startTimeInMillis + (durationInMinutes * 60000);

    for (let i = 0; i < timeSlots.length; i++) {
      const [slotStartTime, slotEndTime] = timeSlots[i].split('-').map(slot => slot.trim());
      const slotStartTimeInMillis = moment(`01/01/2000 ${slotStartTime}`).valueOf();
      const slotEndTimeInMillis = moment(`01/01/2000 ${slotEndTime}`).valueOf();

      if (
        startTimeInMillis >= slotStartTimeInMillis &&
        endTimeInMillis <= slotEndTimeInMillis
      ) {
        return true;
      }
    }

    return false;
  }

  let timeIntervals = [];
  for (let i = 0; i < timeSlots.length; i++) {
    const [startTime, endTime] = timeSlots[i].split('-').map(slot => slot.trim());
    timeIntervals.push(
      ...divideTimeRange(
        startTime,
        endTime,
        event && event.duration,
        timeSlots
      )
    );
  }

  useEffect(() => {
    const weekdaysMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6
    };

    const disabled = [0, 1, 2, 3, 4, 5, 6].filter(day => !weekdays.includes(Object.keys(weekdaysMap)[day]));

    setDisabledDates(disabled);

  }, [weekdays]);

  const disableCalendar = (date) => {
    const currentDate = moment();
    const targetDate = moment(date);

    if (disabledDates.includes(targetDate.day())) {
      return true;
    }

    if (targetDate.isBefore(currentDate, 'day')) {
      return true;
    }

    for (const range of holidays) {
      let [startDate, endDate] = range.split('to');
      startDate = startDate.trim();
      endDate = endDate.trim();
      const start = moment(startDate, 'YYYY-MM-DD');
      const end = moment(endDate, 'YYYY-MM-DD');

      if (targetDate.isBetween(start, end, 'day', '[]')) {
        return true;
      }
    }

    return false;
  };

  const isSameDay = (date1, date2) => {
    return date1.isSame(date2, 'day');
  };

  function disableSlot() {
    const index = [];

    if (events) {
      const date1 = moment(selectedDate);
      date1.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

      for (let i = 0; i < events.length; i++) {
        const date2 = moment(events[i].date);
        date2.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

        if (date1.isSame(date2)) {
          const [hours1, minutes1] = events[i].startTime.split(':').map(part => parseInt(part));
          const [hours2, minutes2] = events[i].endTime.split(':').map(part => parseInt(part));
          const eventDuration = duration;

          for (let j = 0; j < timeIntervals.length; j++) {
            const intervalTime = timeIntervals[j];
            const intervalEndTime = moment(timeIntervals[j]);
            intervalEndTime.add(eventDuration, 'minutes');

            const eventStartTime = moment(`01/01/2000 ${hours1}:${minutes1}`);
            const eventEndTime = moment(`01/01/2000 ${hours2}:${minutes2}`);

            const intervalStartTime = moment(`01/01/2000 ${intervalTime}`);
            const intervalEnTime = moment(`01/01/2000 ${timeIntervals[j]}`);
            intervalEnTime.add(eventDuration, 'minutes');

            if (
              (intervalStartTime.isSameOrAfter(eventStartTime) && intervalStartTime.isBefore(eventEndTime)) ||
              (intervalEndTime.isAfter(eventStartTime) && intervalEndTime.isSameOrBefore(eventEndTime))
            ) {
              index.push(j);
            }
          }
        }
      }
    }

    return index;
  }

  let index = disableSlot();

  const logOutHandler = () => {
    dispatch(logoutClient())
  }

  console.log(index)



  const availableSlots = timeIntervals
    .filter((item, i) => {
      const currentTime = moment();
      const selectedDateTime = moment(`${selectedDate} ${item}`);
      return !index.includes(i) && selectedDateTime.isAfter(currentTime);
    });

  return (
    <div className="">
      <div className='flex justify-between px-2 my-2'> <span onClick={() => navigate(-1)} className='cursor-pointer text-white bg-[#bad900] px-2 py-1 shadow'><AiOutlineArrowLeft className='text-xl' /></span>
        {/* <button onClick={logOutHandler} className=''>   <FiLogOut className='text-2xl text-white cursor-pointer' /></button> */}
        </div>
      {loading ? <Loader /> : <>
        <div className="flex flex-col md:flex-row bg-white container mx-auto border border-gray-200">
          <div className="flex-1 p-8 border-r border-gray-200">
            <h1 className="text-2xl">{event && event.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <BiTime className="text-xl text-gray-600" />
              <span className="text-gray-600 text-xl">{event && event.duration} min</span>
            </div>
            <div className="my-4">
              <p className="text-gray-800">{event && event.description}</p>
            </div>
          </div>
          <div className="w-full flex-[2] p-8 ">
            <Calendar
              className={"w-full mx-auto"}

              tileDisabled={({ date }) => disableCalendar(date)}
              onClickDay={handleDateClick}
              tileClassName={({ activeStartDate, date, view }) =>
                view === 'month' && selectedDate === moment(date).format('MMM DD, YYYY')
                  ? 'calendar__tile calendar__tile--active'
                  : 'calendar__tile'
              }
            />

          </div>
          <div className="flex-1 flex flex-col gap-2 px-8 border-l border-gray-200 mt-4 overflow-y-auto h-[90vh]">
            <button
              onClick={nextPage}
              className="border bg-blue-500 w-16 text-center text-white px-2 py-1 text-center rounded shadow"
              disabled={time ? false : true}

            >
              Next
            </button>
            <div>
              {selectedDate && (
                <p>{selectedDate}</p>
              )}
            </div>
            <div className="flex gap-4 flex-col mt-4">
              {selectedDate && availableSlots.length > 0 &&
                availableSlots.map((item) => (
                  <div
                    onClick={() => setTime(item)}
                    key={item}
                    className={`cursor-pointer border-2 text-center rounded shadow px-4 py-2 ${time === item
                      ? 'bg-blue-500 text-white'
                      : 'border-blue-500 text-blue-500 hover:border-blue-800 hover:text-blue-800'
                      }`}
                  >
                    {item}
                  </div>
                ))
              
              
              }
            </div>
          </div>
        </div>
      </>
      }
    </div>
  );
};

export default CalendarPage;



// timeIntervals.length > 0 &&
// timeIntervals.filter((item, i) => {
//   const currentTime = moment();
//   const selectedDateTime = moment(`${selectedDate} ${item}`);
//   return selectedDateTime.isAfter(currentTime) && !(index.length > 0 && index.includes(i));
// })

  // .map((item, i) => (
  //   <div
  //     onClick={() => {
  //       if (index.length > 0 && index.includes(i)) {
  //         return;
  //       }
  //       setTime(item);
  //     }}
  //     key={item}
  //     className={`cursor-pointer border-2 text-center rounded shadow px-4 py-2 ${time === item
  //       ? 'bg-blue-500 text-white'
  //       : 'border-blue-500 text-blue-500 hover:border-blue-800 hover:text-blue-800'
  //       }`}
  //   >
  //     {item}
  //   </div>
  // ))