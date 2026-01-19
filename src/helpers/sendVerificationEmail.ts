import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmailTemplate";
import { apiResponse } from "@/types/apiResponce";

async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
) : Promise<apiResponse>{
    try{
        await resend.emails.send({
        from: 'dev@hiteshchoudhary.com',
        to: email,
        subject: 'Mystery Message Verification Code',
        react: VerificationEmail({ username, otp: verifyCode }),
    });
        return { success: true, messages: 'Verification email sent successfully.' };
    }catch(emailError){
        console.error('Error sending verification email:', emailError);
        return { success: false, messages: 'Failed to send verification email.' };
    }
}

export default sendVerificationEmail