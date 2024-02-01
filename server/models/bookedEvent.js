const mongoose = require('mongoose');

const bookedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    client: {
        type: mongoose.Schema.Types.Mixed,
        ref: "client",
        default: {}
    },
    from: {
        type: String
    },
    to: {
        type: String
    },
    event_name: {
        type: String
    }

});

const BookedEvents = mongoose.model('booked', bookedSchema);


module.exports = BookedEvents














