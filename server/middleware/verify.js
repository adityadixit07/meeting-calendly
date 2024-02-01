const jwt = require('jsonwebtoken');
const User = require('../models/user');
async function authenticate(req, res, next) {

    try {
        const token = req.cookies.token
        if (!token) {
            return res
                .status(400)
                .json({ success: false, message: "Login to continue." });
        }
        const { id } = jwt.verify(token, process.env.JWT_SECERET);
        req.user = await User.findById(id);
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Resource not found." });
    }
}


module.exports = authenticate