const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendReminderEmail = async (userEmail, contestName, contestUrl, startTime, platform) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Contest Reminder: ${contestName}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #2563eb;">🏆 Contest Reminder</h2>
          <p>Hi there!</p>
          <p>This is a reminder for the upcoming contest:</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin: 0; color: #1e40af;">${contestName}</h3>
            <p style="margin: 10px 0;"><strong>Platform:</strong> ${platform}</p>
            <p style="margin: 10px 0;"><strong>Start Time:</strong> ${new Date(startTime).toLocaleString()}</p>
          </div>
          ${contestUrl ? `<a href="${contestUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Join Contest</a>` : ''}
          <p style="margin-top: 20px; color: #666;">Good luck! 🚀</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #999;">This is an automated reminder from ContestSync</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${userEmail} for ${contestName}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendReminderEmail };
