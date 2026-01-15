import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Configure Nodemailer Transport
 * We use a standard SMTP service. For development, you might use Ethereal or a Gmail App Password.
 */
const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'smtp.gmail.com'
  auth: {
    user: process.env.EMAIL_USER, // Your Google Account
    pass: process.env.EMAIL_APP_PASSWORD // App Password (Not Login Password)
  }
});

/**
 * @desc Send Booking Status Update Email
 */
export const sendBookingStatusEmail = async (tuteeEmail, tutorEmail, session, status) => {
  try {
    const subject = `ElbiTutors: Session Status Update - ${status.toUpperCase()}`;
    const date = new Date(session.startTime).toDateString();
    const time = new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Email to Tutee
    const tuteeHtml = `
      <h1>Session ${status === 'approved' ? 'Confirmed' : 'Rejected'}</h1>
      <p>Your booking request for <strong>${session.topic}</strong> on ${date} at ${time} has been <strong>${status}</strong> by the LRC Admin.</p>
      ${status === 'approved' ? '<p>Please attend on time!</p>' : '<p>We are sorry for the inconvenience.</p>'}
    `;

    // 2. Email to Tutor (Only if approved)
    const tutorHtml = `
      <h1>New Session Scheduled</h1>
      <p>You have a confirmed session for <strong>${session.topic}</strong> on ${date} at ${time}.</p>
      <p>Tutee: ${session.createdByTuteeId.name} (${session.createdByTuteeId.email})</p>
    `;

    // Send Tutee Email
    await transporter.sendMail({
      from: `"ElbiTutors Support" <${process.env.EMAIL_USER}>`,
      to: tuteeEmail,
      subject,
      html: tuteeHtml
    });

    // Send Tutor Email if approved
    if (status === 'approved') {
      await transporter.sendMail({
        from: `"ElbiTutors Support" <${process.env.EMAIL_USER}>`,
        to: tutorEmail,
        subject: `ElbiTutors: New Session Scheduled`,
        html: tutorHtml
      });
    }

    console.log(`[Email] Notifications sent for Session ${session._id} (${status})`);
  } catch (error) {
    console.error("[Email Error] Failed to send notifications:", error);
    // Don't crash the server if email fails, just log it.
  }
};
