const jwt = require('jsonwebtoken')
const AdminSchema = require("../models/admin")
const verifyAdminToken = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res
                .status(400)
                .json({ success: false, message: "Unauthorized" });
        }
        const decode = jwt.verify(token, process.env.ADMIN_SECRET_KEY);
        if (!decode || !decode.username) {
            return res
                .status(400)
                .json({ success: false, message: "Unauthorized" });
        }
        // const { username } = jwt.verify(token, process.env.ADMIN_SECRET_KEY);

        req.admin = await AdminSchema.findOne({ email: decode.username })
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Resource not found." });
    }
};

module.exports = verifyAdminToken