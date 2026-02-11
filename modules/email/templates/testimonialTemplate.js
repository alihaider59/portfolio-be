function getTestimonialEditHtml(name, editLink) {
  return `
    <p>Hello ${name || "there"},</p>
    <p>Thank you for your testimonial!</p>
    <p>You can edit or delete it anytime using the link below:</p>
    <p><a href="${editLink}" target="_self">${editLink}</a></p>
    <p>This link will remain valid until you edit your testimonial again.</p>
    <p>Best regards,<br/>AH Web Solutions</p>
  `;
}

module.exports = { getTestimonialEditHtml };
