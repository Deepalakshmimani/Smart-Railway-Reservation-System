import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP connection on app initialization
transporter.verify((error) => {
  if (error) {
    console.error("❌ Email service configuration error:", error.message);
  } else {
    console.log("⚡ Email service ready to send messages");
  }
});