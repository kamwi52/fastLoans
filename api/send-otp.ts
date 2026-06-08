import twilio from 'twilio';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.body || {};
  if (!phone) return res.status(400).json({ error: 'Missing phone' });

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env;
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_SERVICE_SID) {
    // Dev fallback: return a debug code so local development can proceed without Twilio
    const debugCode = Math.floor(100000 + Math.random() * 900000).toString();
    // eslint-disable-next-line no-console
    console.warn('Twilio not configured — returning debug OTP for', phone, debugCode);
    return res.status(200).json({ sent: true, debugCode });
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  try {
    await client.verify.services(TWILIO_SERVICE_SID).verifications.create({
      to: phone,
      channel: 'sms',
    });
    return res.status(200).json({ sent: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('send-otp error', err);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
}
