const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",  // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOtpEmail(toEmail, otp) {
  await transporter.sendMail({
    from:    `"SU PYQ" <${process.env.SMTP_USER}>`,
    to:      toEmail,
    subject: "Your SU-PYQ Verification Code",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#1a1a1a">Verify your Sushant University email</h2>
        <p>Use the code below to complete your signup. It expires in <strong>10 minutes</strong>.</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;
                    color:#4f46e5;margin:24px 0">${otp}</div>
        <p style="color:#666;font-size:13px">
          If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  });
}

module.exports = { sendOtpEmail };