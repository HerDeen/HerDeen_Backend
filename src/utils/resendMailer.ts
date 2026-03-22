import { Resend } from "resend";
import { resend_api_key, resend_email } from "../config/system.variable";

const resend = new Resend(resend_api_key);

export const sendEmail = async (
  data: { email: string; subject: string; emailInfo: any },
  cb: Function,
) => {
  try {
    const html = await cb(data.emailInfo);
    const response = await resend.emails.send({
      from: resend_email, // change to your domain later
      to: data.email,
      subject: data.subject,
      html: html,
    });

    console.log("Email sent");
  } catch (error) {
    console.error("Email error:", error);
  }
};

// import SibApiV3Sdk from "sib-api-v3-sdk";

// type EmailData = { email: string; subject: string; emailInfo: any };
// type HtmlCallback = (info: any) => Promise<string> | string;

// const client = SibApiV3Sdk.ApiClient.instance;
// client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY as string;

// const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// const brevo_email = "yourgmail@gmail.com";

// export const sendEmail = async (
//   data: EmailData,
//   cb: HtmlCallback,
// ): Promise<void> => {
//   try {
//     const html = await cb(data.emailInfo);

//     await emailApi.sendTransacEmail({
//       sender: { email: brevo_email, name: "HerDeen App" },
//       to: [{ email: data.email }],
//       subject: data.subject,
//       htmlContent: html,
//     });

//     console.log("Email sent");
//   } catch (error) {
//     console.error("Email error:", error);
//   }
// };
