import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { url } from './store';


const eventSlice = createSlice({
    name: 'event',
    initialState: {
        event: null,
        loading: false,
        error: null,
        message: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createEvent.pending, (state) => {
                state.loading = true;
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.event = action.payload;
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.event = null
            })
            .addCase(deleteEvent.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getSingleEvent.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSingleEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.event = action.payload;
            })
            .addCase(getSingleEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.event = null
            })
            .addCase(editEvent.pending, (state) => {
                state.loading = true;
            })
            .addCase(editEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
            })
            .addCase(editEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});




export const createEvent = createAsyncThunk('auth/create-event', async (info,{rejectWithValue}) => {
    try {
        const { data } = await axios.post(`${url}/v1/create-event`, {
            name: info.name,
            description: info.description,
            location: info.location,
            duration: info.duration,
            timeSlots: info.timeSlots,
            weekdays: info.weekdays

        }, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        });
        return data.event;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
export const deleteEvent = createAsyncThunk('auth/delete-event', async (eventId, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${url}/v1/delete-event/${eventId}`, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        });
        return data.message;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
export const getSingleEvent = createAsyncThunk('auth/single-event', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${url}/v1/single-event/${id}`, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        });
        return data.event;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
export const editEvent = createAsyncThunk('auth/edit-event', async (info, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${url}/v1/event/${info.id}`, {
            name: info.updateName,
            duration: info.updateDuration,
            location: info.updateLocation,
            timeSlots: info.updateTimeSlots,
            weekdays: info.updateWeekdays,
            description: info.updateDescription

        }, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        });
        return data.event;
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }
});


export default eventSlice.reducer;
