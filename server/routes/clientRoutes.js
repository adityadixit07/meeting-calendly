
const verifyClientToken = require('../middleware/clientVerify')

const express = require("express")
const ClientController = require("../controllers/ClientController")

const clientRouter = express.Router()


clientRouter.post("/login", ClientController.login)
clientRouter.get("/logout", verifyClientToken, ClientController.clientLogout)
clientRouter.get("/me", verifyClientToken, ClientController.profile)
clientRouter.get("/booked-events", verifyClientToken, ClientController.getAllBookedEvents)
module.exports = clientRouter


