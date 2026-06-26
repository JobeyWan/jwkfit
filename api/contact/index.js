const nodemailer = require("nodemailer");

const recipientEmail = process.env.CONTACT_TO_EMAIL || "Jobeywankenobifitness@gmail.com";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = async function (context, req) {
  const { name, email, goal, message } = req.body || {};

  if (!name || !email || !goal) {
    context.res = {
      status: 400,
      body: { message: "Name, email, and training goal are required." },
    };
    return;
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    context.log.error("Missing Gmail SMTP environment variables.");
    context.res = {
      status: 500,
      body: { message: "Email service is not configured." },
    };
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeGoal = escapeHtml(goal);
  const safeMessage = escapeHtml(message || "No additional message provided.");

  try {
    await transporter.sendMail({
      from: `"Jobey Wan Kenobi Fitness" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `New Training Inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Training Goal: ${goal}`,
        "",
        "Message:",
        message || "No additional message provided.",
      ].join("\n"),
      html: `
        <h2>New Training Inquiry</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Training Goal:</strong> ${safeGoal}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage.replace(/\n/g, "<br>")}</p>
      `,
    });

    context.res = {
      status: 200,
      body: { message: "Inquiry sent successfully." },
    };
  } catch (error) {
    context.log.error("Failed to send contact email.", error);
    context.res = {
      status: 500,
      body: { message: "Unable to send inquiry right now." },
    };
  }
};
