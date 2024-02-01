import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { url } from './store';



const clientSlice = createSlice({
    name: 'event',
    initialState: {
        message: null,
        error: null,
        events: null,
        user: null,
        isClient: null,
        client: null,
        users: null,
        totalPages: null,
        currentPage: null,
        totalUsersCount: null,
        arr: null,
        bookedEvents: []
    },
    reducers: {
        clearError: (state, action) => {
            state.error = null
        },
        clearMessage: (state) => {
            state.message = null
        },
        setValue: (state, action) => {
            state.users = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createClientEvent.pending, (state) => {
                state.loading = true;
            })
            .addCase(createClientEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
            })
            .addCase(createClientEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = null
            })
            .addCase(getAllBookedEvents.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllBookedEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.bookedEvents = action.payload;
            })
            .addCase(getAllBookedEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(syncGoogleEvent.pending, (state) => {
                state.loading = true;
            })
            .addCase(syncGoogleEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(syncGoogleEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.events = null
            })
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null
            })
            .addCase(clientLogin.pending, (state) => {
                state.loading = true;
            })
            .addCase(clientLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.isClient = true
            })
            .addCase(clientLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isClient = false
            })
            .addCase(getClientProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(getClientProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.isClient = true
                state.client = action.payload
            })
            .addCase(getClientProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutClient.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutClient.fulfilled, (state, action) => {
                state.loading = false;
                state.isClient = false
                state.message = action.payload
            })
            .addCase(logoutClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isClient = true
            })
            .addCase(getAllUsersClientPage.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllUsersClientPage.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users
                state.arr = action.payload.arr
                state.currentPage = action.payload.currentPage
                state.totalPages = action.payload.totalPages
                state.totalUsersCount = action.payload.totalUsersCount
            })
            .addCase(getAllUsersClientPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});




export const createClientEvent = createAsyncThunk('auth/create-client-event', async (info, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${url}/v1/create-calendar-event`, {
            eventId: info.eventId, timing: info.timing, organizor: info.organizor, date: info.date, client_email: info.client, loggedEmail: info.loggedEmail, ownerId: info.ownerId,
            emails: info.emailList, remark: info.remark,
            username: info.username,
            company:info.company

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
export const clientLogin = createAsyncThunk('client/login', async (info, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${url}/v3/login`, {
            email: info.email,
            password: info.password
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
export const syncGoogleEvent = createAsyncThunk('auth/async-event', async (ownerId, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${url}/v1/sync-event/${ownerId}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return data.events;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
export const getProfile = createAsyncThunk('auth/get-profile/', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${url}/v1/get-profile/${id}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return data.user;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
export const getClientProfile = createAsyncThunk('cliient/profile/', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${url}/v3/me`, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        });
        return data.client;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
export const logoutClient = createAsyncThunk('cliient/logout/', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${url}/v3/logout`, {
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
export const getAllUsersClientPage = createAsyncThunk('cliient/users/', async (info, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${url}/v1/users?name=${info.name}&page=1`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
export const getAllBookedEvents = createAsyncThunk('client/booked/', async (info, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${url}/v3/booked-events`);
       
        return data.events;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});



export const { clearError, clearMessage, setValue } = clientSlice.actions

export default clientSlice.reducer;
