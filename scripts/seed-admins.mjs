#!/usr/bin/env node
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const emails = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

if (emails.length === 0 || emails.some((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
  throw new Error('ADMIN_EMAILS must contain one or more valid comma-separated email addresses.');
}

initializeApp({ credential: applicationDefault() });
const db = getFirestore();
await db.doc('config/admins').set({ emails }, { merge: true });
console.log(`Updated config/admins with ${emails.length} administrator email(s).`);
