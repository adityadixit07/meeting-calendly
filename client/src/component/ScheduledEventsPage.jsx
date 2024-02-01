import React, { useEffect, useState } from 'react';
import EventCard from './EventCard';
import { useDispatch, useSelector } from 'react-redux';
import { profile } from '../redux/userSlice';
import { deleteEvent } from '../redux/eventSlice';

const ScheduledEventsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [arr, setArr] = useState([])


  const deleteEventHandler = async (eventId) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this event?');
    if (!shouldDelete) return
    await dispatch(deleteEvent(eventId))
    dispatch(profile())
  }

  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);




  useEffect(() => {
    if (user) {
      setArr(user.event)
    }
  }, [user])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Scheduled Events</h1>
      <div className="flex flex-wrap items-center gap-8">
        {arr.map((event) => (
          <EventCard
            timeSlots={event.timeSlots}
            weekdays={event.weekdays}
            key={event._id}
            name={event.name}
            location={event.location}
            link={event.link}
            duration={event.duration}
            id={event._id}
            description={event.description}
            deleteEventHandler={deleteEventHandler}
          />
        ))}
      </div>
     
    </div>
  );
};

export default ScheduledEventsPage;
