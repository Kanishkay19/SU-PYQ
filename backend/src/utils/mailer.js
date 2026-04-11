const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // force IPv4
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "Your SU-PYQ Login OTP",
    html: `
      <h2>SU-PYQ Login</h2>
      <p>Your OTP is: <strong style="font-size:24px">${otp}</strong></p>
      <p>This OTP expires in 10 minutes.</p>
      <p>If you didn't request this, ignore this email.</p>
    `,
  });
}

async function sendCustomEmail(to, subject, message) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html: `<p>${message}</p>`,
  });
}

module.exports = { sendOtpEmail, sendCustomEmail };