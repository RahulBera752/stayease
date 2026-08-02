import nodemailer from 'nodemailer';

/**
 * Creates a reusable Nodemailer transporter using SMTP credentials from env.
 * Works with Gmail SMTP, SendGrid SMTP, Mailtrap, or any standard SMTP provider —
 * just set SMTP_HOST/PORT/USER/PASS in .env.
 */
const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

/**
 * Sends an email. Throws on failure so calling controllers can decide
 * how to handle it (e.g. still succeed the signup but warn the user).
 */
const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"StayEase" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
