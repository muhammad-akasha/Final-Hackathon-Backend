import AppoinmentModel from "../models/Appoinment.model.js";

const createAppointment = async (req, res) => {
  const { AppointmentDate, ClientName, ClientEmail, ClientPhone, Notes } =
    req.body;

  // Validate the required fields
  if (!AppointmentDate || !ClientName || !ClientEmail || !ClientPhone) {
    return res
      .status(400)
      .json({ message: "Please provide all required details" });
  }

  try {
    // Create a new appointment
    const appointment = await AppoinmentModel.create({
      AppointmentDate,
      ClientName,
      ClientEmail,
      ClientPhone,
      Notes,
    });

    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { createAppointment };
