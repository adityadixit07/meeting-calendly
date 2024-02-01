const BookedEvents = require("../models/bookedEvent")
const ClientSchema = require("../models/client")
const jwt = require('jsonwebtoken')
class ClientController {
    static login = async (req, res) => {
        const { email, password } = req.body
        if (!email || !password) return res.status(400).json({ success: false, message: "All fields are required." })

        let client = await ClientSchema.findOne({ email })

        if (!client) return res.status(400).json({ success: false, message: "Incorrect email or password." })


        let isMatch = client.password === password
        if (!isMatch) return res.status(400).json({ success: false, message: "Incorrect email or password." })


        if (isMatch && client.approve === false) return res.status(400).json({ success: false, message: "Not Approved" })

        const token = await jwt.sign({ email: client.email }, process.env.CLIENT_SECRET_KEY);

        res.cookie('token', token, {
            maxAge: 86400000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }).json({
            success: true, message: "Logged in successfully."
        })

    }

    static clientLogout = async (req, res) => {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            }).json({ success: true, message: 'Logged out successfully.' });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Something went wrong." })
        }
    }


    static profile = async (req, res) => {
        try {
            const events = await BookedEvents.find({ client: req.client._id }).populate("user")
       
            const client = await ClientSchema.findOne({ email: req.client.email }).populate({
                path: "events", populate: {
                    path: "user",
                    model: "user"
                }
            })
            if (!client) return res.status(400).json({ success: false, message: "Unauthorized." })
            let data = {
                email: client.email,
                events,
                name: client.name
            }
            res.status(200).json({
                success: true, client: data
            })

        } catch (error) {
            return res.status(500).json({ success: false, message: "Something went wrong." })
        }
    }



    static getAllBookedEvents = async (req, res) => {
        try {
            console.log("hello");
            console.log(bookedEvents);
            const bookedEvents = await BookedEvents.find({
                client: req.client._id
            }).lean();

            for (const event of bookedEvents) {
                if (event.client && typeof event.client === 'object' && !event.client._id) {
                    continue;
                }

                await BookedEvents.populate(event, [
                    { path: "user", model: "user" },
                    { path: "client", model: "client" },
                ]);
            }


            console.log(bookedEvents);
            res.status(200).json({ success: true, events: bookedEvents })
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ success: false, message: "Something went wrong." })
        }
    }
}

module.exports = ClientController