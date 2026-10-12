import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

export async function GET() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || 'dummy_private_key_bms_dev';
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 1800; // 30 minutes validity

  const signature = crypto
    .createHmac('sha1', privateKey)
    .update(token + expire)
    .digest('hex');

  return NextResponse.json({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_dummy_bms',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/bms',
  });
}
