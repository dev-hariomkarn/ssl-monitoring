import twilio from 'twilio';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

export const sendThankYouMail = async (payload: any) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        const handlebarOptions: any = {
            viewEngine: {
                extName: '.handlebars',
                partialsDir: path.resolve('public/templates'),
                defaultLayout: false,
            },
            viewPath: path.resolve('public/templates'),
            extName: '.handlebars',
        };

        transporter.use('compile', hbs(handlebarOptions));

        const mailOptions = {
            from: `SSL Monitoring`,
            to: payload?.to,
            subject: payload?.title,
            template: payload.template,
            context: {
                data: payload?.data,
            },
            attachments: payload?.data.paperLink ? [{ path: payload?.data.paperLink }] : [],
        };

        const mailRes = await transporter.sendMail(mailOptions);
        return mailRes;

    } catch (error) {
        console.log('error: ', error);
    }
};

export const sendMail = async (payload: any) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_SERVICE,
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
        const handlebarOptions: any = {
            viewEngine: {
                extName: '.handlebars',
                partialsDir: path.resolve('public/templates'),
                defaultLayout: false,
            },
            viewPath: path.resolve('public/templates'),
            extName: '.handlebars',
        };

        transporter.use('compile', hbs(handlebarOptions));

        const mailOptions = {
            from: `"SSL Monitoring" <karnhariom@gmail.com>`,
            to: payload?.to,
            subject: payload?.title,
            template: payload.template,
            context: {
                data: payload?.data,
            },
        };
        const mailRes = await transporter.sendMail(mailOptions);
        console.log('mailRes', mailRes)
        return mailRes;

    } catch (error) {
        return;
    }
};

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const client = twilio(accountSid, authToken);

export const sendSms = async (payload: any) => {
    const message = await client.messages.create({
        body: payload.body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: payload.to
    });
    console.log('message', message)
    console.log('SMS sent:', message.sid);
};