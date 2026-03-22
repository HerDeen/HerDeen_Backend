export const welcomeAdminTemp = async (data: {
  email: string;
  tempPassword: string;
}) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Account Created</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, Helvetica, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:30px 15px;">
<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden;">

<!-- HEADER -->
<tr>
<td style="background:#6a0dad; padding:25px; text-align:center; color:#ffffff;">

<img src="logo.png" alt="herDeen Logo" style="max-width:120px; display:block; margin:0 auto 10px auto;">

<span style="font-size:24px; font-weight:bold;">
herDeen
</span>

</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:40px 30px; text-align:center; color:#333333;">

<h2 style="margin-top:0; color:#6a0dad;">Welcome, Admin</h2>

<p style="font-size:16px; line-height:1.6;">
Your <strong>herDeen Admin account</strong> has been successfully created.
Below are your login credentials.
</p>

</td>
</tr>

<!-- ADMIN CREDENTIALS -->
<tr>
<td style="padding:0 30px 30px 30px;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3e8ff; border:1px solid #e2d4ff; border-radius:6px; padding:20px;">

<tr>
<td style="font-size:14px; padding:8px 0; color:#555555;">
<strong>Admin ID:</strong> ${data.email}
</td>
</tr>

<tr>
<td style="font-size:14px; padding:8px 0; color:#555555;">
<strong>Temporary Password:</strong> ${data.tempPassword}
</td>
</tr>

</table>

</td>
</tr>

<!-- SECURITY NOTE -->
<tr>
<td style="background:#fafafa; padding:25px 30px; text-align:center; border-top:1px solid #eeeeee;">

<p style="font-size:14px; color:#666666; line-height:1.6; margin:0;">
For security reasons, please change your password immediately after your first login.
</p>

<p style="font-size:14px; color:#666666; line-height:1.6; margin-top:10px;">
Do not share your admin credentials with anyone.
</p>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#ffffff; padding:20px; text-align:center; font-size:13px; color:#777777; border-top:1px solid #eeeeee;">

<p style="margin:0;">
© ${new Date().getFullYear()} herDeen. All rights reserved.
</p>

<p style="margin:5px 0 0 0;">
Administrative access provided by herDeen
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
    `;
};
