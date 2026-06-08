#!/usr/bin/env node
// Simple test script that mimics api/verify-otp.ts dev fallback logic.
const phone = process.argv[2] || '';
const code = process.argv[3] || '';
if (!phone || !code) {
  console.error('Usage: node verifyOtpTest.js <phone> <code>');
  process.exit(2);
}

function verifyOtpDev(phone, code, debugCodeFromEnv) {
  // Accept if code matches debugCode or DEBUG_OTP env or '000000'
  const valid = (debugCodeFromEnv && code === debugCodeFromEnv) || code === '000000';
  return { valid };
}

const debugEnv = process.env.DEBUG_OTP || null;
const result = verifyOtpDev(phone, code, debugEnv);
console.log(JSON.stringify(result));
