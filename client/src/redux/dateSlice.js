

import { createSlice } from '@reduxjs/toolkit';

const dateSlice = createSlice({
    name: 'date',
    initialState: {
        timing: null,
        eventId: null,
        date: null,
        duration: null,
        organizor: null,
        description: null,
        name: null,
        loggedEmail: null,
        ownerId: null,
        bookedPerson: null
    },
    reducers: {
        updateSelectedDateTime: (state, action) => {
            state.date = action.payload.date
            state.name = action.payload.name
            state.description = action.payload.description
            state.organizor = action.payload.organizor
            state.timing = action.payload.timing
            state.duration = action.payload.duration
            state.eventId = action.payload.eventId
            state.loggedEmail = action.payload.loggedEmail
            state.ownerId = action.payload.ownerId
            state.bookedPerson = action.payload.bookedPerson
        }
    }
});

export const { updateSelectedDateTime } = dateSlice.actions;
export default dateSlice.reducer;
