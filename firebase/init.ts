import admin from 'firebase-admin';
import {getStorage} from 'firebase-admin/storage';
import config from '../config/index';

// Log service account details for debugging
const serviceAccount = config.serviceAccount;

const initializeApp = () => {
  if (!config.serviceAccount) {
    return admin.initializeApp();
  }

  // Make sure to properly format the private key
  const formattedServiceAccount = {
    ...config.serviceAccount,
    // Make sure private key is correctly formatted
    private_key: serviceAccount.private_key?.replace(/\\n/g, '\n')
  };

  return admin.initializeApp({
    credential: admin.credential.cert(formattedServiceAccount as admin.ServiceAccount),
    storageBucket: config.firebaseStorageBucket
  });
};

export const getFirebaseAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App;
  }

  return initializeApp();
};

export const storage = getStorage(getFirebaseAdminApp());
