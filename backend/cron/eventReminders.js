import cron from "node-cron";
import Event from "../models/Event.js";
import EventNotification from "../models/EventNotification.js";
import GlobalEventNotification from "../models/GlobalEventNotification.js";
import sendEmail from "../utils/sendEmail.js";

async function sendReminders() {
  const now = new Date();

  // Fetch all upcoming events
  const events = await Event.find({ isActive: true });
  for (const event of events) {
    const startTime = new Date(event.startTime);
    const diffMs = startTime - now;
    const diffHours = diffMs / (1000 * 60 * 60);

    let label = null;
    if (diffHours <= 24 * 7 && diffHours > 24 * 6.5) label = "1 week";
    if (diffHours <= 24 * 3 && diffHours > 24 * 2.5) label = "3 days";
    if (diffHours <= 24 * 2 && diffHours > 24 * 1.5) label = "2 days";
    if (diffHours <= 24 * 1 && diffHours > 23) label = "1 day";
    if (diffHours <= 6 && diffHours > 5.5) label = "6 hours";

    if (label) {
      const subscribers = await EventNotification.find({ eventId: event._id });
      const globalSubscribers = await GlobalEventNotification.find();
      const allRecipients = [
        ...subscribers.map((s) => s.email),
        ...globalSubscribers.map((s) => s.email),
      ];
      const uniqueRecipients = [...new Set(allRecipients)];
      for (const email of uniqueRecipients) {
        await sendEmail({
          to: email,
          subject: `⏰ Reminder: ${event.title} is coming soon!`,
          html: `
  <div style="background: #fff4ec; padding: 30px; font-family: 'Georgia', serif;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.05);">
      <h2 style="text-align: center; color: #b83280;">🌸 ${event.title}</h2>
      <p style="font-size: 16px; color: #444;">This is your gentle reminder that the event <strong>${
        event.title
      }</strong> is starting soon.</p>
      <p><strong>📍 Location:</strong> ${event.location}</p>
      <p><strong>🗓️ Date:</strong> ${new Date(
        event.startTime
      ).toLocaleString()}</p>
      <p>🙏 We look forward to your graceful presence.</p>
      <hr style="margin: 30px 0; border-top: 1px solid #eee;" />
      <p style="text-align: center; font-size: 14px; color: #777;">In light, <br/> Team Eraya RATNA 🕊️</p>
    </div>
  </div>
  `,
        });
      }
    }
  }
}

// Run every hour
cron.schedule("0 * * * *", () => {
  console.log("⏰ Running event reminder job...");
  sendReminders().catch(console.error);
});
