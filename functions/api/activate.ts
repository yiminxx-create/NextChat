// functions/api/activate.ts - Activation Code Verification (Cloudflare Pages Functions)

type RequestContext = {
  request: Request;
  export const onRequestPost = async (context) => {
  const { request } = context;

  // CORS headers (允许前端调用)
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // 处理 OPTIONS 预检请求 (CORS 必须)
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing or invalid code' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 免费试用码列表（可随时添加，expires 是 UTC 时间）
    const freeTrialCodes = [
      { code: 'FREE-TRIAL-ABC123', expires: '2026-03-20T23:59:59Z' },
      { code: 'FREE-TRIAL-DEF456', expires: '2026-03-25T23:59:59Z' },
      // 添加新码在这里，例如：
      // { code: 'FREE-TRIAL-NEW999', expires: '2026-04-01T23:59:59Z' },
    ];

    const trial = freeTrialCodes.find(t => t.code.toUpperCase() === code.toUpperCase());

    if (trial) {
      const now = new Date().toISOString();
      if (now > trial.expires) {
        return new Response(
          JSON.stringify({ success: false, message: 'Free trial code expired' }),
          { status: 400, headers: corsHeaders }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `Free trial activated! Expires on ${trial.expires}`,
          token: `trial-${code}`,
          expires: trial.expires,
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // 付费码（示例：固定列表，后期可改 KV）
    const paidCodes = ['PAID-SECRET-123456', 'PAID-SECRET-789012'];

    if (paidCodes.includes(code)) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Paid code activated! Unlimited access granted',
          token: `paid-${code}`,
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: 'Invalid activation code' }),
      { status: 400, headers: corsHeaders }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, message: 'Server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
};
