import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MY_EMAIL, // Your Gmail
    pass: process.env.APP_PASSWORD, // App Password
  },
});

const sendEmail = async (email) => {
  try {
    const info = await transporter.sendMail({
      from: '"Akasha"',
      to: email, // recipient email
      subject: "Welcome to Our E-Commerce App ✔", // Subject line
      text: "Thank you for registering with us! You can now start shopping and enjoy all the amazing deals on our platform.", // Plain text body
      html: `
        <h1>Welcome to Our E-Commerce App!</h1>
        <p>Thank you for registering with us! You can now start shopping and enjoy all the amazing deals on our platform.</p>
        <p><strong>Start exploring now!</strong></p>
      `, // HTML body
    });

    return { message: `Message sent: ${info.messageId}` };
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
};
export { sendEmail };
