const Event = require('../models/event')
const User = require('../models/user')

class EventController {


    static getAllEvents = async (req, res) => {
        try {
            const events = await Event.find({})
            res.status(200).json({ success: true, events })
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error." })
        }
    }

    static createEvent = async (req, res) => {
        try {
            const { name, description, location, duration, weekdays, timeSlots } = req.body
            let user = await User.findById(req.user._id)

            if (!name || !description || !duration || !weekdays || !timeSlots || !location) return res.status(400).json({ success: false, message: "All Field are requied." })
            const event = await Event.create({ name, description, location, duration, owner: req.user._id, timeSlots, weekdays })
            user.event.unshift(event)
            await user.save()
            res.status(201).json({ success: true, message: "Event Create Successfully.", event })

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal Server Error." })
        }
    }


    static updateEvent = async (req, res) => {
        try {
            const { name, description, location, duration, timeSlots, weekdays } = req.body;
            const eventId = req.params.eventId;
            let event = await Event.findById(eventId)

            if (!event) return res.status(404).json({ success: false, message: "Event  not found." })
            if (timeSlots) event.timeSlots = timeSlots
            if (weekdays) event.weekdays = weekdays
            if (name) event.name = name
            if (description) event.description = description
            if (location) event.location = location
            if (duration) event.duration = duration

            await event.save()
            res
                .status(200)
                .json({ success: true, message: "Event updated successfully." });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal Server Error." });
        }
    }
    static deleteEvent = async (req, res) => {
        try {
            const eventId = req.params.eventId;
            const event = await Event.findByIdAndDelete(eventId);

            if (!event) {
                return res.status(404).json({ success: false, message: 'Event not found.' });
            }


            const user = await User.findById(req.user._id);


            const eventIndex = user.event.indexOf(eventId);
            if (eventIndex !== -1) {
                user.event.splice(eventIndex, 1);
            }

            await user.save();

            res.status(201).json({ success: true, message: 'Event deleted successfully.', event });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal Server Error.' });
        }
    };

    static singleEvent = async (req, res) => {
        try {
            const event = await Event.findById(req.params.id).populate("owner")
            if (!event) {
                return res.status(404).json({ success: false, message: 'Event not found.' });
            }
            res.status(200).json({ success: true, event })
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal Server Error.' });
        }
    }
}


module.exports = EventController