import { transporter } from "@/lib/nodemailer";
import { render } from '@react-email/render'; // 👈 Ye naya hai, react ko  HTML convert karne ke liye so that gmail can understand
import VerificationEmail from "@/emails/VerificationEmail"; // 👈 Import kiya
import { ApiResponse } from '@/types/ApiResponse'; 
//  sending mail will take time toh async aaya means promise return karega 
// async ka matlab hai: "Main kaam shuru kar raha hoon, par main baaki code ko rokunga nahi. 
// Jab kaam ho jayega tab bata dunga."
export async function sendVerificationEmail(
    //  we need email , username and verify code to send email
  email: string,
  username: string,
  verifyCode: string
//   Promise<ApiResponse> Yeh TypeScript ka vada (Promise) hai.
// Hum keh rahe hain: "Jab ye function khatam hoga, ye aapko ek ApiResponse
//  wala object wapas karega (jisme success aur message hoga)."
): Promise<ApiResponse> {
  try {
    //  verification mail me we have written react component but gmail ko html chahiye so render used
    const emailHtml = await render(VerificationEmail({ username, otp: verifyCode }));
   // await: Iska matlab hai "Ruko". Jab tak email chala nahi jata, agli line par mat jao
    // 🔄 Yahan Resend wala code hataya aur Nodemailer lagaya
    await transporter.sendMail({
      from: ' arpittyagi17551@gmail.com', // Yahan apna verified email ya naam likhein
      to: email,
      subject: 'Mystery Message | Verification Code',
      html: emailHtml, // 👈 React component ki jagah converted HTML pass kiya
    });

    return { success: true, message: 'Verification email sent successfully' };

} catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: 'Failed to send verification email' };
  }
}
