import dotenv from 'dotenv';

dotenv.config();

const {
    PORT,
    HOST,
    HUBTEL_SMS_URL,
    HUBTEL_CLIENT_ID,
    HUBTEL_CLIENT_SECRET,
    HUBTEL_SMS_NAME
} = process.env;

const config = {
    port: PORT,
    host: HOST,
    hubtel_sms_url: HUBTEL_SMS_URL,
    hubtel_client_id: HUBTEL_CLIENT_ID,
    hubtel_client_secret: HUBTEL_CLIENT_SECRET,
    hubtel_sms_name: HUBTEL_SMS_NAME
};

export default config;