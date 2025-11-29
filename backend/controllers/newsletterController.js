import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

export const sendNewsletter = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res
        .status(400)
        .json({ message: "Subject and message are required." });
    }

    const users = await User.find({}, "email"); // get all registered users' emails

    const spiritualTemplate = (content) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Newsletter</title>
    </head>
    <body style="font-family: Arial, sans-serif; background: #fff7f5; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="text-align: center; color: #b83280; font-family: 'Georgia', serif;">🌸 A Spiritual Message 🌸</h2>
        <div style="font-size: 16px; color: #444; line-height: 1.6;">
          ${content || "<p>No message content provided.</p>"}
        </div>
        <hr style="margin: 30px 0;" />
        <footer style="text-align: center; font-size: 14px; color: #777;">
          With light and peace,<br/>The Eraya RATNA Team 🕊️
        </footer>
      </div>
    </body>
  </html>
`;
    console.log("Message content:", message);
    const emailPromises = users.map((user) =>
      sendEmail({
        to: user.email,
        subject,
        html: spiritualTemplate(message),
      })
    );

    await Promise.all(emailPromises);

    res.status(200).json({ message: "Newsletter sent to all users." });
  } catch (error) {
    console.error("Newsletter error:", error);
    res.status(500).json({ message: "Failed to send newsletter." });
  }
};
