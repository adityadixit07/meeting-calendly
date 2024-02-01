const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    approve: {
        type: Boolean,
        default: false
    },
    events: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
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
    }],
})




// clientSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

const ClientSchema = mongoose.model("client", clientSchema)

module.exports = ClientSchema