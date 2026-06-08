import twilio from 'twilio';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, code, debugCode } = req.body || {};
  if (!phone || !code) return res.status(400).json({ error: 'Missing phone or code' });

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID, DEBUG_OTP } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_SERVICE_SID) {
    // Dev fallback: accept debugCode from request body or environment DEBUG_OTP
    const valid = (debugCode && code === debugCode) || (DEBUG_OTP && code === DEBUG_OTP) || code === '000000';
    // eslint-disable-next-line no-console
    console.warn('Twilio not configured — verify using debug fallback for', phone, 'valid=', valid);
    return res.status(200).json({ valid });
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  try {
    const check = await client.verify
      .services(TWILIO_SERVICE_SID)
      .verificationChecks.create({ to: phone, code });

    const valid = check && (check.status === 'approved' || check.status === 'approved');
    return res.status(200).json({ valid });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('verify-otp error', err);
    return res.status(500).json({ error: 'Failed to verify OTP' });
  }
}
