import express from "express";
import authenticateUser from "../middleware/auth.middleware.js";
import { createAppointment } from "../controllers/Appointment.controller.js";

const router = express.Router();

router.post("/addappoinment", authenticateUser, createAppointment);

export default router;
