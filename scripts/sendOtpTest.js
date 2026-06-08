#!/usr/bin/env node
// Simple test script that mimics api/send-otp.ts dev fallback logic.
const phone = process.argv[2] || '';
if (!phone) {
  console.error('Usage: node sendOtpTest.js <phone>');
  process.exit(2);
}

function sendOtpDev(phone) {
  // In dev (no Twilio), return a debug code
  const debugCode = Math.floor(100000 + Math.random() * 900000).toString();
  console.warn('Twilio not configured — generated debug OTP for', phone, debugCode);
  return { sent: true, debugCode };
}

const result = sendOtpDev(phone);
console.log(JSON.stringify(result));
