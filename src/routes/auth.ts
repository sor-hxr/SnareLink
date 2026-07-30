import type { Env } from '../index';

const TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function handleLogin(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body = await request.json<{ email?: string }>().catch(() => null);
  const email = body?.email?.trim().toLowerCase();

  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Valid email required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Find or create the user
  let user = await env.link_tracker_db
    .prepare('SELECT id FROM users WHERE email = ?')
    .bind(email)
    .first<{ id: string }>();

  if (!user) {
    const userId = crypto.randomUUID();

    await env.link_tracker_db
      .prepare(
        'INSERT INTO users (id, email, plan_tier, created_at) VALUES (?, ?, ?, ?)'
      )
      .bind(userId, email, 'free', Date.now())
      .run();

    user = { id: userId };
  }

  const token = crypto.randomUUID();
  const expiresAt = Date.now() + TOKEN_EXPIRY_MS;

  await env.link_tracker_db
    .prepare(
      'INSERT INTO magic_tokens (token, user_id, email, expires_at, used) VALUES (?, ?, ?, ?, 0)'
    )
    .bind(token, user.id, email, expiresAt)
    .run();

  const verifyUrl = `${new URL(request.url).origin}/api/verify?token=${token}`;

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: 'SnareLink <onboarding@resend.dev>',
      to: [email],
      subject: 'Your SnareLink login link',
      html: `
        <p>Click to log in:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>This link expires in 15 minutes.</p>
      `,
    }),
  });

  if (!emailRes.ok) {
    const errText = await emailRes.text();

    return new Response(
      JSON.stringify({
        error: 'Failed to send email',
        detail: errText,
      }),
      {
        status: 502,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }

  return new Response(
    JSON.stringify({
      ok: true,
      message: 'Check your email for a login link',
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
}

export async function handleVerify(request: Request, env: Env): Promise<Response> {
  const token = new URL(request.url).searchParams.get('token');

  if (!token) {
    return new Response('Missing token', {
      status: 400,
    });
  }

  const tokenRow = await env.link_tracker_db
    .prepare(
      'SELECT token, user_id, expires_at, used FROM magic_tokens WHERE token = ?'
    )
    .bind(token)
    .first<{
      token: string;
      user_id: string;
      expires_at: number;
      used: number;
    }>();

  if (!tokenRow || tokenRow.used || tokenRow.expires_at < Date.now()) {
    return new Response(
      'Invalid or expired link. Please request a new one.',
      {
        status: 401,
      }
    );
  }

  await env.link_tracker_db
    .prepare('UPDATE magic_tokens SET used = 1 WHERE token = ?')
    .bind(token)
    .run();

  const sessionId = crypto.randomUUID();
  const sessionExpiry = Date.now() + SESSION_EXPIRY_MS;

  await env.link_tracker_db
    .prepare(
      'INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)'
    )
    .bind(sessionId, tokenRow.user_id, sessionExpiry, Date.now())
    .run();

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
      'set-cookie': `session=${sessionId}; Max-Age=${
        SESSION_EXPIRY_MS / 1000
      }; Path=/; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}
