const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendOtpEmail(to, otp) {
  await sgMail.send({
    to,
    from: process.env.MAIL_USER, // must be verified in SendGrid
    subject: "Your SU-PYQ Login OTP",
    html: `
      <h2>SU-PYQ Login</h2>
      <p>Your OTP is: <strong style="font-size:24px">${otp}</strong></p>
      <p>This OTP expires in 10 minutes.</p>
    `,
  });
}

async function sendCustomEmail(to, subject, message) {
  await sgMail.send({
    to,
    from: process.env.MAIL_USER,
    subject,
    html: `<p>${message}</p>`,
  });
}

module.exports = { sendOtpEmail, sendCustomEmail };