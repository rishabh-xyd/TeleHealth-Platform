"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = exports.sendEmail = void 0;
const sendEmail = async (to, subject, text) => {
    // In a real application, use Nodemailer here.
    console.log(`[EMAIL SENT] To: ${to} | Subject: ${subject} | Body: ${text}`);
};
exports.sendEmail = sendEmail;
const sendSMS = async (to, text) => {
    // Integrate Twilio/SNS here
    console.log(`[SMS SENT] To: ${to} | Body: ${text}`);
};
exports.sendSMS = sendSMS;
