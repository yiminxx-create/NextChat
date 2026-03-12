// components/home.tsx (或直接替换 page.tsx 的 return)
'use client';

import { useState } from 'react';

export function Home() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isActivated, setIsActivated] = useState(false); // 假设登录后状态

  const handleActivate = async () => {
    if (!code.trim()) {
      setError('请输入激活码');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 调用你的后端 API 验证激活码（根据你的项目改 URL）
      const res = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsActivated(true); // 激活成功，显示聊天界面
        // 可选：存 localStorage 或 cookie
        localStorage.setItem('token', code); // 简单示例，实际用更安全方式
      } else {
        setError(data.message || '激活码无效或已过期');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 如果已激活，显示聊天界面（替换成你原来的聊天组件）
  if (isActivated) {
    return (
      <div className="h-screen flex flex-col">
        <header className="bg-green-600 text-white p-4 text-center">
          <h1 className="text-2xl font-bold">BingZe Token Chat - 已激活</h1>
        </header>
        <main className="flex-1 p-4 overflow-auto">
          {/* 这里放你原来的聊天 UI */}
          <p>聊天界面加载中...</p>
        </main>
      </div>
    );
  }

  // 未激活：显示登录/激活页
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
      <div className="max-w-lg w-full bg-white p-10 rounded-3xl shadow-2xl border border-gray-200">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-gray-900">BingZe Token</h1>
          <p className="mt-4 text-xl text-gray-700">
            无限 DeepSeek 聊天 · 仅 $9.9/月起
          </p>
        </div>

        <div className="space-y-6">
          <input
            type="text"
            placeholder="输入你的激活码 (例如 BTC-XXXX-YYYY-ZZZZ)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl text-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all"
          />

          <button
            onClick={handleActivate}
            disabled={loading || !code.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-5 rounded-2xl text-xl font-bold shadow-lg disabled:opacity-50 transition-all duration-200 flex items-center justify-center"
          >
            {loading ? '激活中...' : '立即激活并登录'}
          </button>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          <p className="text-center text-gray-600 mt-6 text-lg">
            没有激活码？{' '}
            <a
              href="你的 Gumroad 链接"
              target="_blank"
              className="text-blue-600 font-bold hover:text-blue-800 underline"
            >
              立即购买
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
// 在 home.tsx 文件末尾添加（如果没有就新建）
export const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      <span className="ml-4 text-lg text-gray-600">加载中...</span>
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
            <p>开始你的对话吧...</p>
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
