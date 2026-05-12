const transporter = require("../../config/emailConfig");
const { getContactThankYouHtml } = require("./templates/contactThankYou");
const { getContactAlertHtml } = require("./templates/contactAlert");
const { getTestimonialEditHtml } = require("./templates/testimonialTemplate"); 

class EmailService {
  async sendMail(options) {
    const { to, subject, text, html, replyTo } = options;
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    const fromName = process.env.EMAIL_FROM_NAME || "AH Web Solutions";
    const from = `"${fromName}" <${fromEmail}>`;

    const mailOptions = {
      from,
      to: typeof to === "string" ? to.trim() : to,
      subject,
      text: text || "",
      html: html || undefined,
      ...(replyTo && { replyTo }),
    };

    return await transporter.sendMail(mailOptions);
  }

  // Contact form emails
  async sendContactThankYou(to, name) {
    const recipientEmail = typeof to === "string" ? to.trim() : "";
    if (!recipientEmail) {
      console.error("Contact thank-you email skipped: no recipient email");
      return;
    }
    const html = getContactThankYouHtml(name);
    const text = `Hi ${name || "there"},\n\nThank you for reaching out to us. We have received your message and will get back to you as soon as possible.\n\nBest regards,\nAH Web Solutions`;
    return this.sendMail({
      to: recipientEmail,
      subject: "Thank you for reaching out – AH Web Solutions",
      text,
      html,
    });
  }

  async sendContactAlertToOwner(contact) {
    const { name, email, message } = contact;
    const ownerEmail = process.env.EMAIL_USER;
    if (!ownerEmail) return;
    const html = getContactAlertHtml(name, email, message);
    const text = `New contact form submission\n\nName: ${name || "—"}\nEmail: ${email || "—"}\n\nMessage:\n${message || "—"}`;
    return this.sendMail({
      to: ownerEmail,
      subject: `New contact from ${name || email || "portfolio"}`,
      text,
      html,
      replyTo: email || undefined,
    });
  }

  // New: Send testimonial edit link email
  async sendTestimonialEditLink(to, name, editLink) {
    const recipientEmail = typeof to === "string" ? to.trim() : "";
    if (!recipientEmail) {
      console.error("Testimonial edit email skipped: no recipient email");
      return;
    }
    const html = getTestimonialEditHtml(name, editLink);
    const text = `Hi ${name || "there"},\n\nThank you for your testimonial! You can edit or delete it using this link:\n\n${editLink}\n\nBest regards,\nAH Web Solutions`;
    return this.sendMail({
      to: recipientEmail,
      subject: "Your testimonial edit link – AH Web Solutions",
      text,
      html,
    });
  }
}

module.exports = new EmailService();
