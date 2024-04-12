import config from "../../../config/index.js";
import { SmsType } from "./types.js";

export default async function sendSms(
  options: SmsType
): Promise<{ error?: string, data?: string }> {
  try {
    const query = new URLSearchParams({
      to: options.to,
      content: options.content,
      from: config.hubtel_sms_name,
      clientid: config.hubtel_client_id,
      clientsecret: config.hubtel_client_secret,
    } as Record<string, string>).toString();

    const resp = await fetch(`${config.hubtel_sms_url}?${query}`, {
      method: "GET",
    });

    const data = await resp.text();
    return { data };
  } catch (error: any) {
    return { error: error?.message };
  }
}

export const constructVerificationSms = (otp: string): string => {
  return `Your verification code is ${otp}. Please do not share this code with anyone.`;
}
