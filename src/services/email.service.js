/*
Q.1 What are third-party services?

These are external tools, APIs, or platforms created by other companies that your app connects to.

🔹 Common examples
Database services → MongoDB, Firebase
Authentication → Google login, JWT libraries
Payment gateways → Razorpay, Stripe
Email/SMS services → Nodemailer, Twilio
Cloud storage → AWS S3, Cloudinary
Maps / APIs → Google Maps API
🔹 Why keep them in a services folder?
Keeps your code clean and organized
All external integrations are in one place
Easy to change or update later (e.g., switch Stripe → Razorpay)
🔹 Simple structure example
project/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── services/
 │     ├── paymentService.js
 │     ├── emailService.js
 │     ├── authService.js
 │     └── cloudService.js

*/
// all the third party service will be handled in the services directory 
// all the third party services related to email will be handled in this file

// require('dotenv').config();
const nodemailer = require('nodemailer');
// This transporter is used to send emails using Gmail (Google SMTP server)
// We will use this in the auth controller to send emails (like welcome emails after user registration)

// To connect with Gmail, we need some credentials like:
// - email (user)
// - client ID
// - client secret
// - refresh token
// These credentials are created in Google Cloud Console by enabling Gmail API
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
// Email content can be in HTML format, so we pass html as a parameter
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"BACKEND LEDGER" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // HTML message (for design and formatting)
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Backend Ledger!';
    const text = `Hi ${name},\n\nThank you for registering at Backend Ledger. We're excited to have you on board! If you have any questions or need assistance, feel free to reach out to our support team.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hi ${name},</p><p>Thank you for registering at <strong>Backend Ledger</strong>. We're excited to have you on board! If you have any questions or need assistance, feel free to reach out to our support team.</p><p>Best regards,<br>The Backend Ledger Team</p>`;
    await sendEmail(userEmail, subject, text, html);
}
module.exports = 
{
    sendRegistrationEmail
};
