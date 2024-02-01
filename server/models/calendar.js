const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
    eventId: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    description: String,
    location: String
    // Add more fields as needed
});

const Calendar = mongoose.model('calendar', calendarSchema);


module.exports = Calendar