// functions/api/activate.ts
interface RequestContext {
  request: Request;
  // 可以加更多属性，如 env, params 等，如果需要
}

export const onRequestPost = async (context: RequestContext) => {
  const { request } = context;

  // 你的原有代码...
  // ... 后面不变
};
// functions/api/activate.ts - Activation Code Verification (Cloudflare Pages Functions)

export const onRequestPost = async (context) => {
  const { request } = context;

  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing or invalid code' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Free trial codes (add more as needed, expires in UTC ISO format)
    const freeTrialCodes = [
      { code: 'FREE-TRIAL-ABC123', expires: '2026-03-20T23:59:59Z' }, // Expires Mar 20, 2026
      { code: 'FREE-TRIAL-DEF456', expires: '2026-03-25T23:59:59Z' },
      // Add new codes here...
    ];

    // Check if it's a free trial code
    const trial = freeTrialCodes.find(t => t.code.toUpperCase() === code.toUpperCase());

    if (trial) {
      const now = new Date().toISOString();
      if (now > trial.expires) {
        return new Response(
          JSON.stringify({ success: false, message: 'Free trial code expired' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `Free trial activated! Expires on ${trial.expires}`,
          token: `trial-${code}`,
          expires: trial.expires,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Paid code logic (example: fixed list, later can use KV or database)
    const paidCodes = ['PAID-SECRET-123456', 'PAID-SECRET-789012'];

    if (paidCodes.includes(code)) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Paid code activated! Unlimited access granted',
          token: `paid-${code}`,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Invalid code
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid activation code' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
