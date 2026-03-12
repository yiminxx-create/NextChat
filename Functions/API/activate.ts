// functions/api/activate.ts - 激活码验证接口
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing or invalid code' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 免费试用码列表（你可以随时加新码，expires 是 UTC 时间）
    const freeTrialCodes: { code: string; expires: string }[] = [
      { code: 'FREE-TRIAL-ABC123', expires: '2026-03-20T23:59:59Z' }, // 有效到 2026-03-20
      { code: 'FREE-TRIAL-DEF456', expires: '2026-03-25T23:59:59Z' },
      // 加更多免费码...
    ];

    // 检查是否是免费试用码
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

    // 这里可以加付费码验证逻辑（从 KV、数据库或固定列表查）
    // 示例：简单固定付费码
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

    // 都不是
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
