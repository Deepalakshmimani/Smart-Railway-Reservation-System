// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },

//   connectionTimeout: 30000,
//     greetingTimeout: 30000,
//     socketTimeout: 30000
// });

// // Verify SMTP connection on app initialization
// transporter.verify((error) => {
//   if (error) {
//     console.error("❌ Email service configuration error:", error.message);
//   } else {
//     console.log("⚡ Email service ready to send messages");
//   }
// });

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use STARTTLS
  family: 4,     // Force IPv4

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,

  tls: {
    rejectUnauthorized: false,
  },
});

// Verify SMTP connection on app initialization
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email service configuration error:");
    console.error(error);
  } else {
    console.log("⚡ Email service ready to send messages");
  }
});