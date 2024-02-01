const nodemailer = require("nodemailer")


async function sendMail(user_email, subject, html) {
    try {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })



        const options = {
            from: process.env.EMAIL_USER,
            to: user_email,
            // cc: "sujit@ceoitbox.in",
            subject,
            html,

        }

        await transport.sendMail(options)


    } catch (error) {
        console.log(error)
    }
}

module.exports = sendMail