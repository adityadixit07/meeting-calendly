const express = require("express")
const mongoose = require("mongoose")
const { google } = require('googleapis');
require('dotenv').config({ path: "./.env" })
const FormData = require("form-data")
let form_ = new FormData()
const cloudinary = require("cloudinary")
const Calendar = require('./models/calendar')
const cookieParser = require('cookie-parser');
const passport = require("passport")
const expressSession = require("express-session")
const User2 = require('./models/User2')
const cors = require('cors')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dbConnect = require('./db/db')
const router = require("./routes/route")
const jwt = require('jsonwebtoken')
const axios = require('axios');
const User = require('./models/user');
const authenticate = require("./middleware/verify");
const Event = require("./models/event");
const adminRouter = require("./routes/adminRoutes");
const clientRouter = require("./routes/clientRoutes");
const sendMail = require("./utils/sendMail");
const path = require("path");
const ClientSchema = require("./models/client");
const AdminSchema = require("./models/admin");
const { DateTime } = require('luxon');
const BookedEvents = require("./models/bookedEvent");
const verifyClientToken = require("./middleware/clientVerify");
const app = express()




const oauth2client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.CLIENT_URL

)

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.set("trust proxy", 1)
app.use(cookieParser());
app.use(expressSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}))


const PORT = process.env.PORT || 4994
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000",
    // methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
app.use("/api/v1", router)
app.use("/api/v2", adminRouter)
app.use("/api/v3", clientRouter)

dbConnect()

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECERET,
});




passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {

                let user = await User.findOne({ email: profile.emails[0].value })
                if (user) {
                    user.refresh_token = refreshToken
                    user.registered = true
                    user.refresh_token_expires = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;

                    await user.save()
                } else {
                    user = new User({
                        // avatar: profile.photos[0].value,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        refresh_token: refreshToken,
                        refresh_token_expires: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,

                    });
                    await user.save();
                    oauth2client.setCredentials({ refresh_token: refreshToken })
                }
                done(null, user);
            } catch (error) {
                done(error, false);
            }
        }
    )
);






passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Initialize Passport middleware
app.use(passport.initialize());

// Restore session from Passport
app.use(passport.session());


app.get('/auth/google', passport.authenticate('google', {
    scope: ['openid', 'profile', 'email', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'], accessType: 'offline',
    prompt: 'consent',
}));



app.get('/auth/google/callback', passport.authenticate('google'), async (req, res) => {

    let user = await User.findOne({ email: req.user.email })


    if (!user) {
        user = await User.create({
            name: req.user.displayName,
            email: req.user.email,
        })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECERET, { expiresIn: "7d" });
    const options = {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
    };

    user.refresh_token_expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.save();

    oauth2client.setCredentials({ refresh_token: user.refresh_token })
    res.cookie("token", token, options)









    if (user.registered) {
        res.redirect('/user/create-event')
        // res.redirect('http://localhost:3000/user/create-event')
    } else {
        res.redirect('/user/detail')
        // res.redirect('http://localhost:3000/user/detail')

    }


    // res.redirect(`/user/detail`);

});



async function reminderExpToken(form_, user) {
    let x = new Date(user.refresh_token_expires)

    let offset = 5.5 * 60 * 60 * 1000
    let ist = new Date(x.getTime() + offset)
    form_.append("name", user.name)
    form_.append("email", user.email)
    form_.append("expire", JSON.stringify(ist))
    const { data } = await axios.post(process.env.SCRIPT_LINK,
        form_
        , {
            headers: {
                // 'Content-Type': 'application/json',
                'Content-Type': 'multipart/form-data',
                // 'Authorization': `Bearer ${token}`,
            }
        })
}





app.post('/api/v1/create-calendar-event', async (req, res) => {
    try {

        const { eventId, timing, organizor, date, client_email, username, ownerId, emails, remark,company } = req.body
        let user = null
        let client_id = null
        let comp=company
        if (mongoose.Types.ObjectId.isValid(ownerId)) {
            user = await User.findById(ownerId);
        }
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            user = await User.findOne({ slug: ownerId });
        }


        if (!user.refresh_token) return res.status(400).json({ success: false, message: "Login with google" })
        if (req?.cookies?.token) {
            await verifyClientToken(req, res, () => {
                client_id = req.client ? req.client._id : null;
                comp = req.client ? req.client.company : company;
            });
        }


        oauth2client.setCredentials({
            refresh_token:
                user.refresh_token
        })
        let guests_email = []
        guests_email.push(client_email)
        for (let i = 0; i < emails.length; i++) {
            guests_email.push(emails[i])
        }



        const locOpt = {
            timeZone: 'Asia/Kolkata',
            timeZoneName: 'short',
        };
        let event = await Event.findById(eventId)
        const dateTime = new Date(`${date} ${timing}`);

        const isoDateTime = dateTime.toLocaleString('en-US', locOpt);
        const end = new Date(`${date} ${timing}`);
        end.setMinutes(end.getMinutes() + event.duration);
        const endISO = end.toLocaleString('en-US', locOpt);
        // const guests = guestsStr.split(',')
        const calendar = google.calendar("v3")
        const gmail = google.gmail("v1")

        const response = await calendar.events.insert({
            auth: oauth2client,
            calendarId: 'primary',
            sendUpdates: 'all',
            requestBody: {
                summary: event.name,
                description: remark,
                location: event.location,
                colorId: '6',
                start: {
                    dateTime: new Date(isoDateTime)
                },
                end: {
                    dateTime: new Date(endISO)
                },
                attendees: guests_email.map((email) => ({ email }))
            }
        })

        let mailStartDate = isoDateTime.split(",")[1].split("GMT")[0]
        let mailEndDate = endISO.split(",")[1].split("GMT")[0]

        let html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Event Booking Confirmation</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f8f8f8;
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 10px;
                }
                h2 {
                    color: #007bff;
                    font-size: 22px;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #007bff;
                    padding-bottom: 10px;
                }
                .event-info {
                    background-color: #f2f2f2;
                    padding: 15px;
                    border-radius: 10px;
                }
                .info-label {
                    font-weight: bold;
                    color: #555;
                }
                .info-value {
                    color: #333;
                }
                .client-name {
                    font-weight: bold;
                    color: #222;
                    font-size: 18px;
                }
                .remark {
                    font-style: italic;
                    color: #666;
                    margin-top: 20px;
                }
                .button {
                    display: inline-block;
                    background-color: #007bff;
                    color: #fff;
                    text-decoration: none;
                    padding: 12px 25px;
                    border-radius: 5px;
                    font-size: 16px;
                    margin-top: 30px;
                    transition: background-color 0.3s ease;
                }
                .button:hover {
                    background-color: #0056b3;
                }
                .footer {
                    font-size: 12px;
                    color: #777;
                    margin-top: 40px;
                    text-align: center;
                }
                .footer a {
                    color: #007bff;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <h2>New Meeting Booked with <span class="client-name">${username}</span></h2>
            <div class="event-info">
                <p class="info-label">Date: ${date}</p>
                <p class="info-label">Time: ${mailStartDate} - ${mailEndDate}</p>
                
           
            <p class="info-label">Company Name: ${comp}</p>

            
                <p class="remark">Remark: ${remark}</p>
            </div>
            
        </body>
        </html>
        
        `

        await sendMail(user.email, `Meeting Booked with ${username}`, html)

        let events = await BookedEvents.create({
            user: user._id,
            client: client_id || { name: username, email: client_email },
            from: isoDateTime,
            to: endISO,
            event_name: event.name
        })



        await user.save()

        res.status(201).json({ success: true, message: "Event booked successfully." })

    } catch (error) {
        console.log(error);
        return res.status(200).json({ success: false, message: "something went wrong", error })
    }
})


app.get("/api/v1/users", async (req, res) => {
    try {

        const { name, page = 1 } = req.query;
        const perPage = 15
        let query = {};
        const usersList = await User.find(query).sort({ name: 1 })
        let arr = usersList.length > 0 && usersList.map((item) => {
            return item.name
        })
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        query.refresh_token_expires = { $gt: new Date() };


        const totalUsersCount = await User.countDocuments(query);

        const totalPages = Math.ceil(totalUsersCount / perPage);

        const skipCount = (page - 1) * perPage;
        const users = await User.find(query)
            // .skip(skipCount)
            // .limit(perPage)
            .populate("event");
        res.status(200).json({
            success: true, users,
            totalPages,
            currentPage: page,
            totalUsersCount,
            arr
        })
    } catch (error) {
        console.log(error);
        return res.status(200).json({ success: false, message: "something went wrong", error })
    }
})



app.get("/api/v1/sync-event/:ownerId", async (req, res) => {
    try {
        const { ownerId } = req.params;

        if (!ownerId) return res.status(400).json({ success: false, message: "Owner Id is required." });

        let user = null
        if (mongoose.Types.ObjectId.isValid(ownerId)) {
            user = await User.findById(ownerId);
        }
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            user = await User.findOne({ slug: ownerId });
        }

        if (!user.refresh_token) return res.status(400).json({ success: false, message: "Login with Google." });

        oauth2client.setCredentials({
            refresh_token: user.refresh_token
        });

        const calendar = google.calendar("v3");

        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
            auth: oauth2client,
        });

        const events = response.data.items;



        const dateAndTimeArray = events.map(event => {
            const startDateTime = DateTime.fromISO(event.start.dateTime, { zone: 'utc' }).setZone('Asia/Kolkata');
            const endDateTime = DateTime.fromISO(event.end.dateTime, { zone: 'utc' }).setZone('Asia/Kolkata');

            return {
                date: startDateTime.toISODate(),
                startTime: startDateTime.toFormat('HH:mm'),
                endTime: endDateTime.toFormat('HH:mm')
            };
        });



        res.status(200).json({ success: true, events: dateAndTimeArray });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error occurred while fetching events.' });
    }
});






app.get('/api/v1/logout', async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            req.logout((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        req.session = null; // Clear the session
        res.clearCookie('token'); // Clear the token cookie
        res.status(200).json({ success: true, message: "Logged out successfully." })
    } catch (error) {
        console.log('Error destroying session:', error);
        res.status(500).json({ success: false, message: 'Failed to logout' });
    }

});





app.use(express.static(path.join(__dirname, '../client/build')));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
});








app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})


