import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { url } from './store';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
        isLogged: false,
        message: null,
        events: [],
        updateUserLoader:false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(profile.pending, (state) => {
                state.loading = true;
            })
            .addCase(profile.fulfilled, (state, action) => {
                state.loading = false;
                state.isLogged = true
                state.user = action.payload.user;
            })
            .addCase(profile.rejected, (state, action) => {
                state.loading = false;
                state.isLogged = false
                state.error = action.payload;
            }).addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.isLogged = false
                state.user = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(userInfo.pending, (state) => {
                state.loading = true;
            })
            .addCase(userInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload
            })
            .addCase(userInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addHoliday.pending, (state) => {
                state.loading = true;
            })
            .addCase(addHoliday.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload
            })
            .addCase(addHoliday.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteHoliday.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteHoliday.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload
            })
            .addCase(deleteHoliday.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllBookedEvents.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllBookedEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload
            })
            .addCase(getAllBookedEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(updateProfile.pending, (state) => {
                state.updateUserLoader = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.updateUserLoader = false;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.updateUserLoader = false;
            })
    },
});



export const profile = createAsyncThunk('auth/me', async (demo, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${url}/v1/me`, {
            withCredentials: true
        });
        return data;
    } catch (error) {
        // return error.response.data.message
        return rejectWithValue(error.response.data.message);
    }
});
export const userInfo = createAsyncThunk('auth/details', async (info, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${url}/v1/details`, {
            phone: info.phone,
            avatar: info.avatar,
            expertIn: info.expertIn

        }, {
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
export const setAvailability = createAsyncThunk('auth/availability', async (availability, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${url}/v1/availability`, {
            weekdays: availability.weekdays, timeSlots: availability.timeSlots

        }, {
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
export const updateProfile = createAsyncThunk('auth/updateProfile', async (info, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${url}/v1/update`, {
            name: info.name,
            avatar: info.avatar,
            phone: info.phone,
            expertIn: info.expertIn,
            link: info.link

        }, {
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
export const addHoliday = createAsyncThunk('auth/holiday', async (holiday, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${url}/v1/add-holiday`, {
            holiday

        }, {
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
export const deleteHoliday = createAsyncThunk('auth/delete-holiday', async (holiday, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${url}/v1/delete-holiday`, {
            holiday

        }, {
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
export const logout = createAsyncThunk('auth/logout', async (info, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${url}/v1/logout`, {
            withCredentials: true
        });
        return data.message;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
export const getAllBookedEvents = createAsyncThunk('auth/events', async (info, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${url}/v1/booked-events`, {
            withCredentials: true
        });
        return data.events;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export default authSlice.reducer;
