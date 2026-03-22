export const otpTemplate = (data: { name: string; otp: string }) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OTP Verification</title>
</head>

<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:30px 15px;">
<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">

<!-- HEADER WITH LOGO -->
<tr>
<td style="background:#6a0dad;padding:25px;text-align:center;color:#ffffff;">

<img src="logo.png" alt="herDeen Logo" style="max-width:120px;margin-bottom:10px;display:block;margin-left:auto;margin-right:auto;">

<span style="font-size:24px;font-weight:bold;">
herDeen
</span>

</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:40px 30px;text-align:center;color:#333333;">

<h2 style="margin-top:0;color:#6a0dad;">OTP Verification</h2>

<p style="font-size:16px;line-height:1.5;">
As-Sallamu'alaykum ${data.name}<br/> Use the One-Time Password below to complete your verification.
</p>

<div style="margin:30px 0;">

<span style="
display:inline-block;
padding:16px 32px;
font-size:30px;
letter-spacing:6px;
font-weight:bold;
background:#f3e8ff;
color:#6a0dad;
border-radius:6px;
border:1px solid #e2d4ff;
">
${data.otp}
</span>

</div>

<p style="font-size:14px;color:#555555;">
This code will expire shortly.
</p>

</td>
</tr>

<!-- SECURITY NOTE -->
<tr>
<td style="background:#fafafa;padding:25px 30px;text-align:center;border-top:1px solid #eeeeee;">

<p style="font-size:14px;color:#666666;line-height:1.6;margin:0;">
For your security, never share this verification code with anyone.
herDeen will never ask for your OTP via phone, email, or messages.
</p>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#ffffff;padding:20px;text-align:center;font-size:13px;color:#777777;border-top:1px solid #eeeeee;">

<p style="margin:0;">
© ${new Date().getFullYear()} herDeen. All rights reserved.
</p>

<p style="margin:5px 0 0 0;">
Secure authentication powered by herDeen
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
