const cloudinary = require("cloudinary")
const User = require('../models/user')
const mongoose = require("mongoose")
const sendToken = require("../sendToken")
const BookedEvents = require("../models/bookedEvent")
class Controller {

    static details = async (req, res) => {
        const { phone, avatar, expertIn } = req.body

        try {

            let user = await User.findById(req.user._id)
            if (avatar) {
                const upload = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "calendly"
                })
                user.avatar.public_id = upload.public_id
                user.avatar.url = upload.secure_url
            }
            if (phone) user.phone = phone
            if (expertIn) user.expertIn = expertIn

            await user.save()
            res.status(200).json({ success: true, message: "Details save successfully." })
        } catch (error) {
            console.log(error);
        }
    }

    static availability = async (req, res) => {
        const { weekdays, timeSlots } = req.body;
        try {
            let user = await User.findById(req.user._id)
            user.weekdays = weekdays
            user.timeSlots = timeSlots
            await user.save()

            res.status(200).json({ success: true, message: "User availability saved." })
        } catch (error) {
            console.log(error);
        }
    }
    static signup = async (req, res) => {
        try {
            const { name, email, password, avatar } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ success: false, message: "All field are requied." })
            }

            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ success: false, message: "Already exist." })
            }

            user = new User({
                name,
                email,
                password,

            });

            await user.save();
            sendToken(user, res, 201, "User registered successfully.");

        } catch (error) {
            console.log(error);
        }
    }



    static signin = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: "All field are requied." })
            }
            let user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ success: false, message: "Incorrect email or password" })
            }
            const match = await user.comparePassword(password);
            if (!match) {
                return res.status(400).json({ success: false, message: "Incorrect email or password" })
            }
            sendToken(user, res, 200, "Logged in successfully.");
        } catch (error) {
            console.log(error);
        }
    }

    static logout = async (req, res) => {
        // res.status(200).cookie("token", null, {
        //     expires: new Date(
        //         Date.now()
        //     ),
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "none",
        // })
        // console.log(req.cookies.token);

        // res.clearCookie('token')


        try {
            await new Promise((resolve, reject) => {
                req.session.destroy((err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            });

            res.clearCookie('token');
            res.json({ success: true, message: "Logged out successfully." })
        } catch (err) {
            console.log('Error destroying session:', err);
            res.status(500).json({ success: false, message: 'Error occurred while logging out' });
        }
    }

    static me = async (req, res) => {
        try {

            const user = await User.findById(req.user._id).populate("event holidays").populate({
                path: 'events',
                populate: {
                    path: 'client',
                    model: 'client',
                },
            })

            res.status(200).json({ success: true, user })
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error." })
        }
    }

    static getProfile = async (req, res) => {
        try {
            const id = req.params.id
            let user = null
            if (mongoose.Types.ObjectId.isValid(id)) {
                user = await User.findById(req.params.id).populate("event holidays")
            }
            if (!mongoose.Types.ObjectId.isValid(id)) {
                user = await User.findOne({ slug: id }).populate("event holidays")
            }

            res.status(200).json({ success: true, user })
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error." })
        }
    }
    static addHolidays = async (req, res) => {
        try {
            const { holiday } = req.body
            if (!holiday) return res.status(400).json({ success: false, message: "Holiday is required." })
            const user = await User.findById(req.user._id)


            user.holidays.push(holiday)

            await user.save()


            res.status(200).json({ success: true, message: "Holiday saved" })
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal Server Error." })
        }
    }
    static deleteHolidays = async (req, res) => {
        try {
            const { holiday } = req.body
            if (!holiday) return res.status(400).json({ success: false, message: "Holiday is required." })
            const user = await User.findById(req.user._id)


            user.holidays = user.holidays.filter((item) => {
                return holiday !== item
            })

            await user.save()


            res.status(200).json({ success: true, message: "Holiday Deleted" })
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error." })
        }
    }

    static updateProfile = async (req, res) => {
        try {
            const { name, avatar, phone, expertIn, link } = req.body

            let user = await User.findById(req.user._id)

            if (name) user.name = name
            if (phone) user.phone = phone
            if (expertIn) user.expertIn = expertIn
            if (avatar) {
                if (avatar !== user.avatar.url) {
                    if (user.avatar.public_id) {
                        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
                        const upload = await cloudinary.v2.uploader.upload(avatar, {
                            folder: "calendly",
                        });
                        user.avatar = {
                            public_id: upload.public_id,
                            url: upload.secure_url,
                        };

                    }
                    const upload = await cloudinary.v2.uploader.upload(avatar, {
                        folder: "calendly",
                    });
                    user.avatar = {
                        public_id: upload.public_id,
                        url: upload.secure_url,
                    };
                }

            }
            if (link) {
                let x = await User.findOne({ slug: link })
                if (x && user.slug !== link) return res.status(400).json({ success: false, message: "Username must be unique." })
                user.slug = link
            }
            await user.save();
            res
                .status(200)
                .json({ success: true, message: "Profile updated successfully." });



        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, message: "Internal Server Error." })
        }
    }


    static getAllBookedEvents = async (req, res) => {
        try {
            const bookedEvents = await BookedEvents.find({
                user: req.user._id
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




            res.status(200).json({ success: true, events: bookedEvents })
        } catch (error) {
            return res.status(500).json({ success: false, message: "Something went wrong." })
        }
    }
}


module.exports = Controller