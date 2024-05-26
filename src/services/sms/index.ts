import config from "../../../config/index.js";
import { SmsType } from "./types.js";

export default async function sendSms(
  options: SmsType
): Promise<{ error?: string, data?: string }> {
  try {
    const { hubtel } = config;
    const query = new URLSearchParams({
      to: options.to,
      content: options.content,
      from: hubtel.sms_name,
      clientid: hubtel.client_id,
      clientsecret: hubtel.client_secret,
    } as Record<string, string>).toString();

    const resp = await fetch(`${hubtel.sms_url}?${query}`, {
      method: "GET",
    });

    const data = await resp.text();
    console.log('SMS RESPONSE------>', data);
    console.log('SMS OTP------>', options.content);
    return { data };
  } catch (error: any) {
    return { error: error?.message };
  }
}

export const constructVerificationSms = (otp: string): string => {
  return `Your verification code is ${otp}. Please do not share this code with anyone.`;
}
