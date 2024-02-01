const jwt = require('jsonwebtoken')
const ClientSchema = require("../models/client")
const verifyClientToken = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res
                .status(400)
                .json({ success: false});
        }
        const decode = jwt.verify(token, process.env.CLIENT_SECRET_KEY);

        if (!decode || !decode.email) {
            return res
                .status(400)
                .json({ success: false});
        }
        // const { username } = jwt.verify(token, process.env.ADMIN_SECRET_KEY);

        req.client = await ClientSchema.findOne({ email: decode.email })
    

        next();
    } catch (error) {
        console.log(error.message)
        return res
            .status(500)
            .json({ success: false });
    }
};

module.exports = verifyClientToken