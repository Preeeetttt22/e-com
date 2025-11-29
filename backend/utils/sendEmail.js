import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"ERAYA RATNA" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: text || "",               // fallback plain text
    html: html || undefined,       // spiritual HTML support added ✅
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
