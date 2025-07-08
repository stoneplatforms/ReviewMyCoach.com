import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Check if required environment variables are set
const requiredVars = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
};

const missingVars = Object.entries(requiredVars)
  .filter(([_, value]) => !value)
  .map(([key, _]) => key);

if (missingVars.length > 0) {
  console.error('Missing Firebase Admin environment variables:', missingVars);
  throw new Error(`Missing Firebase Admin environment variables: ${missingVars.join(', ')}`);
}

const firebaseAdminConfig = {
  credential: cert({
    projectId: requiredVars.projectId,
    clientEmail: requiredVars.clientEmail,
    privateKey: requiredVars.privateKey?.replace(/\\n/g, '\n'),
  }),
};

// Initialize Firebase Admin
const app = !getApps().length ? initializeApp(firebaseAdminConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };