const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    events: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
            client: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "client",
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
        }
    ]
})

const AdminSchema = mongoose.model("admin", adminSchema)

module.exports = AdminSchema