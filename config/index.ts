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
    FIREBASE_SERVICE_ACCOUNT_TYPE,
    FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
    FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
    FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    FIREBASE_SERVICE_ACCOUNT_CLIENT_ID,
    FIREBASE_SERVICE_ACCOUNT_AUTH_URI,
    FIREBASE_SERVICE_ACCOUNT_TOKEN_URI,
    FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
    FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
    FIREBASE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN,
    FIREBASE_STORAGE_BUCKET,
} = process.env;

// Ensure the private key is properly formatted
const formattedPrivateKey = FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY
    ? FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

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
    serviceAccount: {
        type: FIREBASE_SERVICE_ACCOUNT_TYPE,
        project_id: FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
        private_key_id: FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
        private_key: formattedPrivateKey,
        client_email: FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
        client_id: FIREBASE_SERVICE_ACCOUNT_CLIENT_ID,
        auth_uri: FIREBASE_SERVICE_ACCOUNT_AUTH_URI,
        token_uri: FIREBASE_SERVICE_ACCOUNT_TOKEN_URI,
        auth_provider_x509_cert_url: FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
        universe_domain: FIREBASE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN,
    },
    firebaseStorageBucket: FIREBASE_STORAGE_BUCKET,
    pagination_limit: 10,
    search_radius: 25
};

export default config;