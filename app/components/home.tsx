// components/home.tsx - 完整优化版，直接覆盖
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  // 检查本地是否已激活
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
      } else {
        setError(data.message || 'Invalid or expired activation code');
      }
    } catch (err) {
      setError('Network error, please try again later');
    } finally {
      setLoading(false);
    }
  };

  // 已激活：显示聊天界面（占位，替换成你的真实聊天 UI）
  if (isActivated) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <header className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between shadow-md">
          <h1 className="text-2xl font-bold">BingZe Token Chat</h1>
          <span className="text-sm opacity-90">Unlimited · Powered by DeepSeek</span>
        </header>
        <main className="flex-1 overflow-hidden p-4">
          {/* 替换成你的聊天组件，例如消息列表 + 输入框 */}
          <div className="h-full flex items-center justify-center text-gray-600 text-lg">
            <p>Chat interface loaded successfully! Start chatting...</p>
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
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-5 rounded-2xl text-xl font-bold shadow-lg disabled:opacity-50 transition-all duration-200 flex items-center justify-center"
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

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* Buy + Trial */}
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

            <p className="text-sm text-gray-500">
              Want to try first? Use free trial code: <strong>FREE-TRIAL-ABC123</strong> (3 days)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
