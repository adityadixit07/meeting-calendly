const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    slug: {
        type: String
    },
    avatar: {
        public_id: String,
        url: String

    },
    email: {
        required: true,
        type: String
    },
    phone: {
        type: String
    },
    password: {
        // required: true,
        type: String
    },
    calendars: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "calendar",
        }
    ],
    refresh_token: {
        type: String
    },
    refresh_token_expires: {
        type: Date,
    },
    registered: {
        type: Boolean,
        default: false
    },
    event: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "event",
    }
    ],
    events: [{
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
    }],

    weekdays: [String],
    timeSlots: [String],
    holidays: [String],
    approve: {
        type: Boolean,
        default: false
    },
    expertIn: {
        type: String
    }


})




userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECERET, {
        expiresIn: process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    });
};

userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};


userSchema.methods.setRefreshTokenExpiration = function () {
    const currentDate = new Date();
    this.refresh_token_expires = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
};


const User = mongoose.model("user", userSchema)
module.exports = User