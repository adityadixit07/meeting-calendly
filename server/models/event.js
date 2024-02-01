const mongoose = require("mongoose")
const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },

    duration: {
        type: Number,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    weekdays: [String],
    timeSlots: [String],


});

const Event = mongoose.model("event", eventSchema)

module.exports = Event