import EventNotification from "../models/EventNotification.js";
import Event from "../models/Event.js";
import sendEmail from "../utils/sendEmail.js";
import GlobalEventNotification from "../models/GlobalEventNotification.js";

export const subscribeToEvent = async (req, res) => {
  try {
    const { eventId, email } = req.body;
    if (!eventId || !email) {
      return res
        .status(400)
        .json({ message: "Event ID and email are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Prevent duplicate subscription
    const existing = await EventNotification.findOne({ eventId, email });
    if (existing) {
      return res.status(200).json({ message: "Already subscribed" });
    }

    // Create subscription
    await EventNotification.create({ eventId, email });

    // ✅ Immediately send a confirmation email
    await sendEmail({
      to: email,
      subject: `✅ Subscribed to ${event.title} notifications!`,
      html: `
  <div style="background: #fff7f5; padding: 30px; font-family: 'Georgia', serif;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.05);">
      <h2 style="text-align: center; color: #b83280;">🌸 ${event.title}</h2>
      <p style="font-size: 16px; color: #444;">Thank you for subscribing! You will receive reminders as the event approaches.</p>
      <p><strong>📍 Location:</strong> ${event.location}</p>
      <p><strong>🗓️ Date:</strong> ${new Date(
        event.startTime
      ).toLocaleString()}</p>
      <p style="margin-top: 20px;">🙏 We look forward to your presence!</p>
      <hr style="margin: 30px 0; border-top: 1px solid #eee;" />
      <p style="text-align: center; font-size: 14px; color: #777;">With love and light, <br/> Team Eraya RATNA 🕊️</p>
    </div>
  </div>
  `,
    });

    res
      .status(201)
      .json({ message: "Subscribed for notifications successfully!" });
  } catch (err) {
    console.error("subscribeToEvent error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const subscribeToAllEvents = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existing = await GlobalEventNotification.findOne({ email });
    if (existing) {
      return res
        .status(200)
        .json({ message: "Already subscribed to all events" });
    }

    await GlobalEventNotification.create({ email });

    // ✅ Immediate confirmation email
    await sendEmail({
      to: email,
      subject: `✅ Subscribed to all future event notifications!`,
      html: `
  <div style="background: #fff7f5; padding: 30px; font-family: 'Georgia', serif;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.05);">
      <h2 style="text-align: center; color: #b83280;">🌸 All Future Events</h2>
      <p style="font-size: 16px; color: #444;">You are now subscribed to receive notifications for <strong>all future events</strong>.</p>
      <p>🙏 Stay tuned for upcoming spiritual gatherings!</p>
      <hr style="margin: 30px 0; border-top: 1px solid #eee;" />
      <p style="text-align: center; font-size: 14px; color: #777;">In gratitude, <br/> The Eraya RATNA Team 🌸</p>
    </div>
  </div>
  `,
    });

    res.status(201).json({ message: "Subscribed to all future events!" });
  } catch (err) {
    console.error("subscribeToAllEvents error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const unsubscribeFromEvent = async (req, res) => {
  try {
    const { eventId, email } = req.body;
    if (!eventId || !email)
      return res
        .status(400)
        .json({ message: "Event ID and email are required" });

    await EventNotification.deleteOne({ eventId, email });
    res.status(200).json({ message: "Unsubscribed successfully!" });
  } catch (err) {
    console.error("unsubscribeFromEvent error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserSubscriptions = async (req, res) => {
  try {
    const { email } = req.params;
    const subs = await EventNotification.find({ email }).select("eventId");
    const eventIds = subs.map((s) => s.eventId.toString());
    res.status(200).json(eventIds);
  } catch (err) {
    console.error("getUserSubscriptions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Unsubscribe from all future events
export const unsubscribeFromAllEvents = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existing = await GlobalEventNotification.findOne({ email });
    if (!existing) {
      return res
        .status(404)
        .json({ message: "You are not subscribed to all events" });
    }

    await GlobalEventNotification.deleteOne({ email });

    // ✅ Immediate confirmation email
    await sendEmail({
      to: email,
      subject: `✅ Unsubscribed from all event notifications`,
      html: `
  <div style="background: #fff5f5; padding: 30px; font-family: 'Georgia', serif;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.05);">
      <h2 style="text-align: center; color: #b83280;">❌ Unsubscribed</h2>
      <p style="font-size: 16px; color: #444;">You have successfully unsubscribed from all future event notifications.</p>
      <p>🙏 You can subscribe again anytime from our Events section.</p>
      <hr style="margin: 30px 0; border-top: 1px solid #eee;" />
      <p style="text-align: center; font-size: 14px; color: #777;">Wishing you peace and joy, <br/> Eraya RATNA Team 🌸</p>
    </div>
  </div>
  `,
    });

    res
      .status(200)
      .json({ message: "Unsubscribed from all future events successfully!" });
  } catch (err) {
    console.error("unsubscribeFromAllEvents error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const checkAllEventSubscription = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ subscribed: false });

    const existing = await GlobalEventNotification.findOne({ email });
    res.status(200).json({ subscribed: !!existing });
  } catch (err) {
    console.error("checkAllEventSubscription error:", err);
    res.status(500).json({ subscribed: false });
  }
};
