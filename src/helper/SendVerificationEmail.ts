import { ApiResponse } from "@/types/ApiResponse";
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

export async function SendVerificationEmail(
  email: string,
  username: string,
  verifycode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "noreply@mecoder.site",
      to: email,
      subject: "Account Verification code",
      react: VerificationEmail({ username, otp: verifycode }),
    });

    return { success: true, message: "Verification email send successfully" };
  } catch (error) {
    console.error("Error: ", error);
    return { success: false, message: "failed to send verification email" };
  }
}
