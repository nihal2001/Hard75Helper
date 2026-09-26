// Signed-cookie sessions (HMAC-SHA256). No session table needed for two users.

const enc = new TextEncoder();

async function hmacKey(secret) {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

function b64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function sign(secret, payload) {
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(secret), enc.encode(payload));
  return `${payload}.${b64url(sig)}`;
}

export async function verify(secret, token) {
  if (!token) return null;
  const i = token.lastIndexOf('.');
  if (i < 0) return null;
  const payload = token.slice(0, i);
  const expected = await sign(secret, payload);
  if (!timingSafeEqual(expected, token)) return null;
  return payload;
}

export function timingSafeEqual(a, b) {
  const ea = enc.encode(a);
  const eb = enc.encode(b);
  let diff = ea.length ^ eb.length;
  for (let i = 0; i < Math.max(ea.length, eb.length); i++) diff |= (ea[i] || 0) ^ (eb[i] || 0);
  return diff === 0;
}

export function getCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

export function cookie(name, value, maxAge) {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

// Session payload: "<user>|<expiresEpochSec>"
export async function makeSession(env, user) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365;
  return sign(env.SESSION_SECRET, `${user}|${exp}`);
}

export async function readSession(env, request) {
  const payload = await verify(env.SESSION_SECRET, getCookie(request, 'h75'));
  if (!payload) return null;
  const [user, exp] = payload.split('|');
  if (Number(exp) < Date.now() / 1000) return null;
  return user;
}

export function randomToken(bytes = 32) {
  return b64url(crypto.getRandomValues(new Uint8Array(bytes)));
}

export async function sha256b64url(str) {
  return b64url(await crypto.subtle.digest('SHA-256', enc.encode(str)));
}
