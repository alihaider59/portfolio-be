function escapeHtml(str) {
  if (typeof str !== "string") return "there";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getContactThankYouHtml(name) {
  const displayName = escapeHtml(name) || "there";
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for reaching out</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <tr>
            <td style="padding: 40px 40px 32px 40px;">
              <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 600; color: #18181b;">AH Web Solutions</h1>
              <p style="margin: 0; font-size: 14px; color: #71717a;">Thank you for getting in touch</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 24px 40px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #3f3f46;">Hi ${displayName},</p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #3f3f46;">Thank you for reaching out to us. We have received your message and appreciate you taking the time to get in touch.</p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #3f3f46;">Our team will review your inquiry and get back to you as soon as possible. We typically respond within 1–2 business days.</p>
              <p style="margin: 0; font-size: 16px; color: #3f3f46;">If your matter is urgent, please don’t hesitate to reach out again.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px 40px 40px; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; font-size: 14px; color: #71717a;">Best regards,</p>
              <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: 600; color: #18181b;">AH Web Solutions</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

module.exports = { getContactThankYouHtml };
