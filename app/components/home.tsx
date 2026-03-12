// app/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  // 检查是否已激活（本地存储示例，实际可用更安全的 JWT 或 session）
  useEffect(() => {
    const token = localStorage.getItem('activation_token');
    if (token) {
      setIsActivated(true);
    }
  }, []);

  const handleActivate = async () => {
    if (!code.trim()) {
      setError('Please enter your activation code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('activation_token', data.token || code);
        setIsActivated(true);
        // 可选：跳转到聊天页
        // window.location.href = '/chat';
      } else {
        setError(data.message || 'Invalid or expired activation code');
      }
    } catch (err) {
      setError('Network error, please try again later');
    } finally {
      setLoading(false);
    }
  };

  // 已激活：显示聊天界面（替换成你原来的聊天 UI）
  if (isActivated) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <header className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">BingZe Token Chat</h1>
          <span className="text-sm opacity-90">Unlimited · Powered by DeepSeek</span>
        </header>
        <main className="flex-1 overflow-hidden">
          {/* 这里放你原来的聊天组件 */}
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Chat interface loaded successfully!</p>
            {/* 替换成你实际的聊天 UI，例如 <ChatWindow /> */}
          </div>
        </main>
      </div>
    );
  }

  // 未激活：登录/激活页面（全英文）
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white p-10 rounded-3xl shadow-2xl border border-gray-200">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">BingZe Token</h1>
          <p className="mt-4 text-xl text-gray-700 font-medium">
            Unlimited DeepSeek Chat · Starting at $9.9/month
          </p>
        </div>

        {/* Input + Button */}
        <div className="space-y-6">
          <input
            type="text"
            placeholder="Enter your activation code (e.g. BTC-XXXX-YYYY-ZZZZ)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl text-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all"
          />

          <button
            onClick={handleActivate}
            disabled={loading || !code.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-5 px-6 rounded-2xl text-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Activating...
              </>
            ) : (
              'Activate and Login Now'
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* Buy Link */}
          <div className="text-center space-y-4 mt-8">
            <p className="text-gray-600 text-lg">
              No activation code?{' '}
              <a
                href="https://yiminspire45.gumroad.com/l/nextchatcode" // ← 替换成你的真实 Gumroad 链接
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-bold hover:text-blue-800 underline"
              >
                Buy Now ($9.9/month Unlimited)
              </a>
            </p>

            <a
              href="/trial" // 如果有免费试用页，替换；否则删掉或指向其他
              className="text-blue-600 hover:text-blue-800 font-medium text-lg underline block"
            >
              Free Trial: 1M Tokens (Limited Time)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
// 在 home.tsx 文件最底部添加（放在 export default Home 之后或之前都行）
export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 bg-green-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="text-lg font-medium text-gray-600">Loading...</p>
    </div>
  );
};
// 在 home.tsx 文件末尾添加（放在 export default Home 之后或之前都行）
export const WindowContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white rounded-2xl shadow-inner border border-gray-200">
      {/* 头部（可选：标题、模型选择） */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">DeepSeek Chat</h2>
        <span className="text-sm opacity-80">无限对话 · BingZe Token</span>
      </div>

      {/* 聊天内容区域 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {children || (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Lets's chat ...</p>
          </div>
        )}
      </div>

      {/* 底部输入框（如果需要） */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="输入消息..."
            className="flex-1 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
          <button className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition">
            发送
          </button>
        </div>
      </div>
    </div>
  );
};
