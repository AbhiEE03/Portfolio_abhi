const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const senderEmail = process.env.EMAIL_USER;
    const senderPassword = process.env.EMAIL_APP_PASSWORD;

    if (!senderEmail || !senderPassword) {
      return res.status(500).json({ message: 'Email configuration is missing' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: senderPassword,
      },
    });

    await transporter.sendMail({
      from: senderEmail,
      to: 'abhisheknoni78@gmail.com',
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>Portfolio Contact Form</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    });

    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error.message);
    return res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;
