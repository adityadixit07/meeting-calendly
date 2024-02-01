import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { url } from './store';



const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        message: null,
        error: null,
        isAdmin: null,
        admin: null,
        clients: null,
        users: null,
        events: []
    },
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        clearMessage: (state) => {
            state.message = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.pending, (state) => {
                state.loading = true;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.loading = false;
                // state.message = action.payload;
                state.isAdmin = true
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAdmin = false
            })
            .addCase(getAdmin.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.admin = action.payload;
                state.isAdmin = true
            })
            .addCase(getAdmin.rejected, (state, action) => {
                state.loading = false;
                state.isAdmin = false
                state.admin = null
            })
            .addCase(adminLogout.pending, (state) => {
                state.loading = true;
            })
            .addCase(adminLogout.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
                state.isAdmin = false
                state.admin = null
            })
            .addCase(adminLogout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAdmin = true

            })
            .addCase(createClient.pending, (state) => {
                state.loading = true;
            })
            .addCase(createClient.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
            })
            .addCase(createClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

            })
            .addCase(getAllClients.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllClients.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload;
            })
            .addCase(getAllClients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.clients = null

            })
            .addCase(updateClient.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateClient.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload;
            })
            .addCase(updateClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

            })
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.users = null

            })
            .addCase(updateUserApproval.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserApproval.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(updateUserApproval.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

            })
            .addCase(updateClientApproval.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateClientApproval.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload;
            })
            .addCase(updateClientApproval.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

            })
            .addCase(deleteClient.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteClient.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload;
            })
            .addCase(deleteClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

            })
            .addCase(getAllBookedEvents.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllBookedEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(getAllBookedEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

            })

    },
});




export const adminLogin = createAsyncThunk('admin/login', async (info, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${url}/v2/login`, {
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
export const getAdmin = createAsyncThunk('admin/me', async (info, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${url}/v2/me`, {
            withCredentials: true
        });
        return data.admin;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
export const adminLogout = createAsyncThunk('admin/logout', async (demo, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${url}/v2/logout`, {
            withCredentials: true
        });
        return data.message;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
export const createClient = createAsyncThunk('admin/new-client', async (info, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${url}/v2/new-client`, {
            name: info.name,
            company: info.company,
            email: info.email,
            password: info.password,
            phone:info.phone

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
export const getAllClients = createAsyncThunk('admin/get-clients', async (info, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${url}/v2/clients?name=${info.name}&company=${info.company}&email=${info.email}`,
            // {
            //     params: {
            //         name: info.name || "",
            //         company: info.company || "",
            //         email: info.email || ""
            //     }
            // },
            {
                withCredentials: true
            });
        return data.clients;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
export const getAllUsers = createAsyncThunk('admin/get-users', async (info, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${url}/v2/users?name=${info.name}&email=${info.email}`, {
            withCredentials: true
        });
        return data.users;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const updateUserApproval = createAsyncThunk(
    'admin/update-user-approval',
    async (_id, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${url}/v2/users`, { _id }, {
                withCredentials: true
            });
            return data.users;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);
export const updateClient = createAsyncThunk(
    'admin/update-client',
    async (user, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${url}/v2/client`, { _id: user._id, name: user.name, company: user.company, password: user.password, email: user.email }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            return data.clients;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);
export const deleteClient = createAsyncThunk(
    'admin/delete-client',
    async (_id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`${url}/v2/client/${_id}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            return data.clients;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);



export const updateClientApproval = createAsyncThunk(
    'admin/update-client-approval',
    async (_id, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${url}/v2/client/approve`, { _id }, {
                withCredentials: true
            });
            return data.clients;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);
export const getAllBookedEvents = createAsyncThunk(
    'admin/booked',
    async (_id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${url}/v2/booked-events`, {
                withCredentials: true
            });
            return data.bookedEvents;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);


export const { clearError, clearMessage } = adminSlice.actions

export default adminSlice.reducer;
