import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

export async function sendEmail({recipientEmail, subject, html, attachments}) {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: 't8870464@gmail.com',
                pass: 'hpwh fqnq ndvx kudu'
            }
        });

        let info = await transporter.sendMail({
            from: `myShopRMA <t8870464@gmail.com>`,
            to: recipientEmail,
            subject: subject,
            html: html,
            attachments: attachments
        });

        console.log(info.messageId);
        return {success: true};
    } catch (err) {
        console.error(err);
    }
}

export async function generateQRCode(data) {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data);
    return qrCodeDataURL;
  } catch (err) {
    console.error(err);
  }
}

export const secret = 'as19pP8FpnI5lA2Abp04ZMtJaFWpVsdfsdfsdgsdghsdasdasdshhrwegdfbfhfgIzfW8DqwslJQxunbwUAI2XMesBteACmhIoSonP9PMOmPQGHIzYpwQ9DOJRXTdR3QpRBva7eljY1kueD4M1LDTC38laqntmQ9VmLzEZicmX4yc6U90vX58DmdMJDrkqhdc8c90HUHoidfsbhdsiofhiuodfshoudfshbjodfshubsdUeH1QsLfCp5F';