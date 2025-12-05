const nodemailer = require('nodemailer');

// Create transporter (using Gmail as example)
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

const sendReminderEmail = async (userEmail, contestName, contestUrl, startTime) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'contestsync@example.com',
      to: userEmail,
      subject: `🏆 Contest Reminder: ${contestName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Contest Reminder</h2>
          <p>Hi there!</p>
          <p>This is a friendly reminder that <strong>${contestName}</strong> is starting soon!</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">Contest Details:</h3>
            <p><strong>Contest:</strong> ${contestName}</p>
            <p><strong>Start Time:</strong> ${new Date(startTime).toLocaleString()}</p>
            ${contestUrl ? `<p><strong>Join Here:</strong> <a href="${contestUrl}" style="color: #3b82f6;">${contestUrl}</a></p>` : ''}
          </div>
          
          <p>Good luck and happy coding! 🚀</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            This email was sent by ContestSync. You received this because you set a reminder for this contest.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Reminder email sent to ${userEmail} for ${contestName}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return false;
  }
};

// Mock email service for demo (logs to console instead of sending real emails)
const sendMockReminderEmail = (userEmail, contestName, contestUrl, startTime) => {
  console.log(`
📧 MOCK EMAIL SENT:
To: ${userEmail}
Subject: 🏆 Contest Reminder: ${contestName}
Contest: ${contestName}
Start Time: ${new Date(startTime).toLocaleString()}
URL: ${contestUrl || 'N/A'}
  `);
  return true;
};

module.exports = {
  sendReminderEmail: process.env.NODE_ENV === 'production' ? sendReminderEmail : sendMockReminderEmail
};