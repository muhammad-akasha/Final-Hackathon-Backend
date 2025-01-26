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

const sendEmail = async (email, loanAmount, loanPurpose) => {
  try {
    const emailHtmlContent = `
    <h1>Loan Request Received</h1>
    <p>Thank you for applying for a loan with us. Your request is being reviewed and you will be notified shortly.</p>
    <p><strong>Loan Amount:</strong> ${loanAmount}</p>
    <p><strong>Loan Type:</strong> ${loanPurpose}</p>
    <p><em>We will reach out to you once your loan request is processed.</em></p>
  `;
    const info = await transporter.sendMail({
      from: '"Akasha"',
      to: email, // recipient email
      subject: "Welcome to Our E-Commerce App ✔", // Subject line
      text: "Thank you for registering with us! You can now start shopping and enjoy all the amazing deals on our platform.", // Plain text body
      html: `
       ${emailHtmlContent}
      `, // HTML body
    });

    return { message: `Message sent: ${info.messageId}` };
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
};
export { sendEmail };
