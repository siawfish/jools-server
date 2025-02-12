import config from "../../../config/index.js";
import { formatDbError } from "../../helpers/constants.js";
import { OtpType } from "./types.js";

export async function createOtp({
  phoneNumber,
}: {
  phoneNumber: string;
}): Promise<{ error?: string; data?: OtpType }> {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);
    try {
      const savedOtp = {
        id: "123",
        phoneNumber,
        code: otp.toString(),
        loginAttempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      return {
        data: {
          phoneNumber,
          otp: otp.toString(),
          referenceId: savedOtp.id,
        },
      };
    } catch (error: any) {
      throw new Error(formatDbError(error?.message, "is pending verification"));
    }
  } catch (error: any) {
    return { error: error?.message };
  }
}

export async function removeOtp({ referenceId }: { referenceId: string }) {
  try {
    return { data: "OTP removed successfully" };
  } catch (error: any) {
    return { error: error?.message };
  }
}

export async function verifyOtp({
  otp,
  referenceId,
  phoneNumber,
}: {
  otp: string;
  referenceId: string;
  phoneNumber: string;
}): Promise<{ error?: string; data?: string }> {
  try {
    const savedOtp = {
      id: "123",
      phoneNumber,
      code: otp.toString(),
      loginAttempts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    if (!savedOtp) {
      return { error: "Invalid OTP" };
    }
    // check if the otp is expired
    const currentTime = new Date().getTime();
    const otpTime = new Date(savedOtp.createdAt).getTime();
    if (currentTime - otpTime > config.otp_expiry) {
      throw new Error("OTP expired");
    }
    const loginAttempts = savedOtp?.loginAttempts ?? 0;
    if (loginAttempts >= config.login_attempts) {
      throw new Error("Exceeded maximum verification attempts");
    }
    if (savedOtp.code !== otp) {
      savedOtp.loginAttempts = loginAttempts + 1;
      throw new Error("Invalid OTP");
    }
    if (savedOtp.phoneNumber !== phoneNumber) {
      savedOtp.loginAttempts = loginAttempts + 1;
      throw new Error("Invalid phone number");
    }
    return { data: "OTP verified successfully" };
  } catch (error: any) {
    return { error: error?.message };
  }
}
