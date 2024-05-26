import dotenv from 'dotenv';

dotenv.config();

const {
    PORT,
    HOST,
    HUBTEL_SMS_URL,
    HUBTEL_CLIENT_ID,
    HUBTEL_CLIENT_SECRET,
    HUBTEL_SMS_NAME,
    JWT_SECRET,
    TYPESENSE_API_KEY,
    TYPESENSE_HOST,
    TYPESENSE_PORT,
    TYPESENSE_PROTOCOL,
    TYPESENSE_CONNECTION_TIMEOUT_SECONDS,
} = process.env;

const config = {
    port: PORT,
    host: HOST,
    hubtel: {
        sms_url: HUBTEL_SMS_URL,
        client_id: HUBTEL_CLIENT_ID,
        client_secret: HUBTEL_CLIENT_SECRET,
        sms_name: HUBTEL_SMS_NAME,
    },
    login_attempts: 3,
    otp_expiry: 60000,
    jwt_secret: JWT_SECRET,
    typesense: {
        api_key: TYPESENSE_API_KEY,
        host: TYPESENSE_HOST,
        port: TYPESENSE_PORT,
        protocol: TYPESENSE_PROTOCOL,
        connection_timeout_seconds: TYPESENSE_CONNECTION_TIMEOUT_SECONDS
    },
    pagination_limit: 10,
    search_radius: 25
};

export default config;