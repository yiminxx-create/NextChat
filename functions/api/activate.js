export const onRequestPost = async (context) => {
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Interface is working! (JS version)',
      receivedAt: new Date().toISOString()
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
};
