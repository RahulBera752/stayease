const resetPasswordEmailTemplate = ({ name, resetUrl }) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#F8FAFC;font-family:'Poppins',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 30px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#4F46E5,#7C3AED);padding:32px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:26px;letter-spacing:1px;">StayEase</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px;">
              <h2 style="color:#0f172a;font-size:20px;margin:0 0 12px;">Hi ${name},</h2>
              <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 28px;">
                We received a request to reset your password. Click the button below to choose a new one.
                This link expires in 15 minutes.
              </p>
              <div style="text-align:center;margin-bottom:24px;">
                <a href="${resetUrl}" style="background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:600;font-size:15px;display:inline-block;">
                  Reset Password
                </a>
              </div>
              <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0;">
                If you did not request a password reset, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#F8FAFC;padding:20px;text-align:center;">
              <p style="color:#94a3b8;font-size:12px;margin:0;">&copy; ${new Date().getFullYear()} StayEase. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export default resetPasswordEmailTemplate;
