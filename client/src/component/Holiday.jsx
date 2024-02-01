import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addHoliday, deleteHoliday, profile } from '../redux/userSlice';
import { AiFillDelete } from 'react-icons/ai';

const HolidayInput = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const [holidays, setHolidays] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };


    const handleAddRange = async () => {
        if (startDate.trim() === '' || endDate.trim() === '') return;
        if (new Date(startDate) > new Date(endDate)) return
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set current time to 00:00:00

        if (new Date(startDate) < currentDate) return;

        const holidayRange = `${startDate} to ${endDate}`;

        await dispatch(addHoliday(holidayRange))
        dispatch(profile())
        setStartDate('');
        setEndDate('');
    };


    const deleteHolidays = async (holiday) => {

        const confirmDelete = window.confirm('Are you sure you want to delete this holiday?');
        if (confirmDelete) {
            await dispatch(deleteHoliday(holiday));
            setHolidays(holidays.filter((item) => item !== holiday));
        }
    }

    useEffect(() => {
        dispatch(profile())
    }, [dispatch])

    useEffect(() => {
        if (user) {
            setHolidays(user.holidays)
        }
    }, [user])


    const fomateDate = (date) => {
        let [startDate, endDate] = date.split('to');
        startDate = startDate.trim()
        endDate = endDate.trim()
        const [startYear, startMonth, startDay] = startDate.split('-');
        const [endYear, endMonth, endDay] = endDate.split('-');

        return `${startDay}/${startMonth}/${startYear} to ${endDay}/${endMonth}/${endYear}`
    }

    return (
        <div className='p-2'> <div className="max-w-md mx-auto p-4 bg-white rounded shadow mt-24">
            <h1 className="text-xl font-bold mb-4">Out Of Office</h1>
            <div className="flex items-center space-x-2">
                <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="border border-gray-300 p-2 rounded"
                />
                <span>to</span>
                <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="border border-gray-300 p-2 rounded"
                />
                <button
                    onClick={handleAddRange}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add
                </button>
            </div>
            <div className="mt-4">
                <h2 className="text-lg font-bold mb-2">Out Of Office:</h2>
                {holidays && holidays.length === 0 ? (
                    <p className='text-center text-2xl text-gray-500'>No holidays added yet.</p>
                ) : (
                    <ul className=" flex flex-col gap-4">
                        {holidays && holidays.map((holiday, index) => (
                            <div key={index} className='flex items-center justify-between shadow py-2 px-4 border border-gray-200'><li >{fomateDate(holiday)}</li>
                                <AiFillDelete onClick={() => deleteHolidays(holiday)} className='cursor-pointer text-xl text-red-500' />

                            </div>
                        ))}
                    </ul>
                )}
            </div>
        </div></div>
    );
};

export default HolidayInput;
