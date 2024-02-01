
const verifyAdminToken = require('../middleware/adminVerify')

const express = require("express")
const AdminController = require("../controllers/AdminController")

const adminRouter = express.Router()



adminRouter.post("/login", AdminController.adminLogin)
adminRouter.post("/register", AdminController.adminRegistration)
adminRouter.get("/me", verifyAdminToken, AdminController.profile)
adminRouter.get("/logout", verifyAdminToken, AdminController.adminLogout)
adminRouter.post("/new-client", AdminController.createClient)
adminRouter.post("/add-client/:token", AdminController.createClientForScript)
adminRouter.get("/all-users/:token", AdminController.getUserDetailsToScheduling)
adminRouter.get("/clients", verifyAdminToken, AdminController.getAllClients)
adminRouter.get("/users", verifyAdminToken, AdminController.getAllUsers)
adminRouter.put("/users", verifyAdminToken, AdminController.updateApprove)
adminRouter.put("/client/approve", verifyAdminToken, AdminController.updateClientApprove)
adminRouter.put("/client", verifyAdminToken, AdminController.updateClient)
adminRouter.delete("/client/:id", verifyAdminToken, AdminController.deleteClient)
adminRouter.get("/booked-events", verifyAdminToken, AdminController.getAllBookedEvents)
module.exports = adminRouter


