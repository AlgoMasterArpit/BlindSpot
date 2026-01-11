import nodemailer from 'nodemailer';
// new Nodemailer(...): Humne Nodemailer ka ek "Transporter" banaya.
// Ye waisa hi hai jaise Resend ka client tha, bas ye SMTP use karega.
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // Gmail: smtp.gmail.com
  port: Number(process.env.SMTP_PORT), // Gmail: 587
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Aapka email
    pass: process.env.SMTP_PASS, // Aapka App Password
  }
});