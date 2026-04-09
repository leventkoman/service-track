import {Resend} from "resend";
import 'dotenv/config'

export const mailService = async (email: string, subject: string, html: string): Promise<void> => {
    const resend = new Resend(process.env.RESEND_MAIL);

    // Todo: change from and to values after create domain in resend mail.
    const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!, 
        to: ['leventkoman@yahoo.com'], 
        subject,
        html,
    });

    if (error) {
        throw new Error(`Mail gönderilmesi : ${error?.message}`);
    }
}