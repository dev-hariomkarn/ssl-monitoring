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
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: "93128f001@smtp-brevo.com",
                pass: "xFGOzLJbaPrvsjfS"
            }
        });
        const mailOptions = {
            from: `SSL Monitoring <hariomkarn@outlook.com>`,
            to: payload?.to,
            subject: payload?.title,
            text: payload?.text || "Hello World!", // optional plain text
            html: payload?.html || "<h2>Welcome!</h2>", // use custom HTML from payload
        };
        const mailRes = await transporter.sendMail(mailOptions);
        console.log('mailRes', mailRes)
        return mailRes;

    } catch (error) {
        console.log('error', error)
        return;
    }
};