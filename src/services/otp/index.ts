import config from "../../../config/index.js";
import { formatDbError } from "../../helpers/constants.js";
import { getXataClient } from "../../xata.js";
import { OtpType } from "./types.js";

const xata = getXataClient();

export async function createOtp({
  phoneNumber,
}: {
  phoneNumber: string;
}): Promise<{ error?: string; data?: OtpType }> {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);
    try {
      const savedOtp = await xata.db.otp.create({
        phoneNumber,
        code: otp.toString(),
        loginAttempts: 0,
      });
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
    await xata.db.otp.delete({ id: referenceId });
  } catch (error: any) {
    console.log('ERROR REMOVING OTP------>', error?.message);
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
    const savedOtp = await xata.db.otp.filter({ id: referenceId }).getFirst();
    if (!savedOtp) {
      return { error: "Invalid OTP" };
    }
    // check if the otp is expired
    const currentTime = new Date().getTime();
    const otpTime = new Date(savedOtp.xata.createdAt).getTime();
    if (currentTime - otpTime > config.otp_expiry) {
      await xata.db.otp.delete({ id: referenceId });
      throw new Error("OTP expired");
    }
    const loginAttempts = savedOtp?.loginAttempts ?? 0;
    if (loginAttempts >= config.login_attempts) {
      await xata.db.otp.delete({ id: referenceId });
      throw new Error("Exceeded maximum verification attempts");
    }
    if (savedOtp.code !== otp) {
      await savedOtp.update({
        loginAttempts: loginAttempts + 1,
      });
      throw new Error("Invalid OTP");
    }
    if (savedOtp.phoneNumber !== phoneNumber) {
      await savedOtp.update({
        loginAttempts: loginAttempts + 1,
      });
      throw new Error("Invalid phone number");
    }
    await xata.db.otp.delete({ id: referenceId });
    return { data: "OTP verified successfully" };
  } catch (error: any) {
    return { error: error?.message };
  }
}
