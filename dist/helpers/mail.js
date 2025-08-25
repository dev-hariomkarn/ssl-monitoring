"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSms = exports.sendMail = exports.sendThankYouMail = void 0;
const twilio_1 = __importDefault(require("twilio"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const path_1 = __importDefault(require("path"));
const sendThankYouMail = async (payload) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        const handlebarOptions = {
            viewEngine: {
                extName: '.handlebars',
                partialsDir: path_1.default.resolve('public/templates'),
                defaultLayout: false,
            },
            viewPath: path_1.default.resolve('public/templates'),
            extName: '.handlebars',
        };
        transporter.use('compile', (0, nodemailer_express_handlebars_1.default)(handlebarOptions));
        const mailOptions = {
            from: `SSL Monitoring`,
            to: payload === null || payload === void 0 ? void 0 : payload.to,
            subject: payload === null || payload === void 0 ? void 0 : payload.title,
            template: payload.template,
            context: {
                data: payload === null || payload === void 0 ? void 0 : payload.data,
            },
            attachments: (payload === null || payload === void 0 ? void 0 : payload.data.paperLink) ? [{ path: payload === null || payload === void 0 ? void 0 : payload.data.paperLink }] : [],
        };
        const mailRes = await transporter.sendMail(mailOptions);
        return mailRes;
    }
    catch (error) {
        console.log('error: ', error);
    }
};
exports.sendThankYouMail = sendThankYouMail;
const sendMail = async (payload) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_SERVICE,
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
        const handlebarOptions = {
            viewEngine: {
                extName: '.handlebars',
                partialsDir: path_1.default.resolve('public/templates'),
                defaultLayout: false,
            },
            viewPath: path_1.default.resolve('public/templates'),
            extName: '.handlebars',
        };
        transporter.use('compile', (0, nodemailer_express_handlebars_1.default)(handlebarOptions));
        const mailOptions = {
            from: `"SSL Monitoring" <karnhariom@gmail.com>`,
            to: payload === null || payload === void 0 ? void 0 : payload.to,
            subject: payload === null || payload === void 0 ? void 0 : payload.title,
            template: payload.template,
            context: {
                data: payload === null || payload === void 0 ? void 0 : payload.data,
            },
        };
        console.log('payload', payload);
        const mailRes = await transporter.sendMail(mailOptions);
        return mailRes;
    }
    catch (error) {
        return;
    }
};
exports.sendMail = sendMail;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = (0, twilio_1.default)(accountSid, authToken);
const sendSms = async (payload) => {
    const message = await client.messages.create({
        body: payload.body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: payload.to
    });
    console.log('message', message);
    console.log('SMS sent:', message.sid);
};
exports.sendSms = sendSms;
