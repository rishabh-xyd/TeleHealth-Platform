export const sendEmail = async (to: string, subject: string, text: string) => {
    // In a real application, use Nodemailer here.
    console.log(`[EMAIL SENT] To: ${to} | Subject: ${subject} | Body: ${text}`);
};

export const sendSMS = async (to: string, text: string) => {
    // Integrate Twilio/SNS here
    console.log(`[SMS SENT] To: ${to} | Body: ${text}`);
};
