export const loginTemplate = async (data: {
  name: string;
  ipAddress: string;
  userAgent: string;
}) => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login Alert</title>
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

<h2 style="margin-top:0; color:#6a0dad;">New Login Detected</h2>

<p style="font-size:16px; line-height:1.5;">
As-sallamu'alaykum ${data.name}<br/>
We noticed a new login to your <strong>herDeen</strong> account.
</p>

</td>
</tr>

<!-- LOGIN DETAILS -->
<tr>
<td style="padding:0 30px 30px 30px;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3e8ff; border:1px solid #e2d4ff; border-radius:6px; padding:20px;">

<tr>
<td style="font-size:14px; padding:8px 0; color:#555555;">
<strong>Device:</strong> ${data.userAgent}
</td>
</tr>

<tr>
<td style="font-size:14px; padding:8px 0; color:#555555;">
<strong>Location:</strong> ${data.ipAddress}
</td>
</tr>

<tr>
<td style="font-size:14px; padding:8px 0; color:#555555;">
<strong>Time:</strong> ${new Date().toUTCString()}
</td>
</tr>

</table>

</td>
</tr>

<!-- SECURITY NOTE -->
<tr>
<td style="background:#fafafa; padding:25px 30px; text-align:center; border-top:1px solid #eeeeee;">

<p style="font-size:14px; color:#666666; line-height:1.6; margin:0;">
If this was you, you can safely ignore this message.
</p>

<p style="font-size:14px; color:#666666; line-height:1.6; margin-top:10px;">
If you do not recognize this login, please reset your password immediately to secure your account.
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
Security monitoring powered by herDeen
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
