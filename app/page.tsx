'use client';

import { useState } from 'react';
import axios from 'axios';
import VideoResult from './components/VideoResult';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ url: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('请输入视频链接');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await axios.post('/api/video/analyze', { url });
      if (response.data.success) {
        setResult(response.data.data);
      } else {
        setError(response.data.message || '解析失败');
      }
    } catch (err: any) {
      console.error('解析错误:', err);
      setError(err.response?.data?.message || '解析请求失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4 relative z-10">
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full filter blur-3xl"></div>

        <div className="text-center mb-12 relative">
          <h1 className="text-4xl font-bold mb-3 tech-title inline-flex items-center justify-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              视频解析下载工具
            </span>
            <div className="absolute -top-2 -right-6 flex space-x-1">
              <span className="animate-ping absolute h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            </div>
          </h1>
          <p className="text-blue-200/80 text-lg">支持抖音、快手、微博等多平台视频在线解析</p>
        </div>
        
        <div className="tech-card p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="url" className="block text-blue-300 mb-2 font-medium">输入视频链接</label>
              <div className="flex relative">
                <input
                  type="text"
                  id="url"
                  className="w-full form-input pr-12 pl-4 py-3 rounded-lg"
                  placeholder="请粘贴视频分享链接"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-0 top-0 bottom-0 bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-r-lg transition-all duration-200 flex items-center gap-2 font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>解析中</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>解析</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
          
          {error && (
            <div className="alert alert-error mt-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          )}
          
          {result && <VideoResult videoUrl={result.url} />}
        </div>
        
        <div className="tech-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 filter blur-xl"></div>
          
          <h2 className="text-xl font-semibold mb-6 tech-title text-blue-200">使用说明</h2>
          <ol className="list-decimal pl-5 space-y-3 text-blue-100/90 relative z-10">
            <li className="transition-all duration-200 hover:text-white">
              复制您想要解析的视频分享链接
            </li>
            <li className="transition-all duration-200 hover:text-white">
              粘贴到输入框中，点击"解析"
            </li>
            <li className="transition-all duration-200 hover:text-white">
              解析成功后，可以在线观看或下载视频
            </li>
          </ol>

          <div className="mt-8 border-t border-blue-500/20 pt-4 text-xs text-blue-300/60 flex justify-between">
            <div>版本 1.0.0</div>
            <div>更新日期: {new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}