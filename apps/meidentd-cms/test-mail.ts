import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testMailer() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password, not normal password
      },
    });

    // Verify SMTP connection
    await transporter.verify();
    console.log('✅ SMTP connection successful');

    // Send test mail
    const info = await transporter.sendMail({
      from: `"Mail Test" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL_RECEIVER,
      subject: 'Nodemailer Test',
      text: 'This is a test email from Nodemailer.',
      html: `<h2>Nodemailer Test</h2><p>This is a test email.</p>`,
    });

    console.log('✅ Mail sent');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  } catch (err) {
    console.error('❌ Mail test failed:', err);
  }
}

testMailer();