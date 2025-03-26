import React, { useState } from 'react';

interface VideoResultProps {
  videoUrl: string;
}

export default function VideoResult({ videoUrl }: VideoResultProps) {
  // 创建代理下载URL
  const proxyDownloadUrl = `/api/video/download?url=${encodeURIComponent(videoUrl)}`;
  // 添加下载状态
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // 处理下载
  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDownloading) {
      e.preventDefault();
      return;
    }
    
    setIsDownloading(true);
    setDownloadError(null);
    
    try {
      // 直接使用window.open来触发下载
      window.open(proxyDownloadUrl, '_blank');
      setTimeout(() => {
        setIsDownloading(false);
      }, 2000); // 给用户一些视觉反馈时间
    } catch (error) {
      console.error('下载出错:', error);
      setDownloadError('下载视频时出错，请稍后再试');
      setIsDownloading(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="alert alert-success mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex flex-wrap items-center gap-x-3">
          <span>解析成功！</span>
        </div>
      </div>
      
      {downloadError && (
        <div className="alert alert-error mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{downloadError}</span>
        </div>
      )}
      
      <div className="tech-card mb-2 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        
        <div className="p-1">
          <video 
            src={videoUrl} 
            controls 
            className="w-full max-h-[400px] rounded bg-black"
          >
            您的浏览器不支持视频播放
          </video>
        </div>
      </div>
      
      <div className="flex justify-between gap-4 mt-4">
        <a 
          href={videoUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-slate-800/80 border border-blue-500/30 hover:border-blue-400/60 text-white px-4 py-2.5 rounded-md flex-1 text-center transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/10"
        >
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>在新窗口打开</span>
        </a>
        <a 
          href={isDownloading ? '#' : proxyDownloadUrl}
          className={`${
            isDownloading 
              ? 'bg-slate-700/80 cursor-not-allowed border-slate-600/40' 
              : 'bg-blue-600/90 hover:bg-blue-500/90 border-blue-500/50 hover:border-blue-400/60'
          } transition-all duration-200 text-white px-4 py-2.5 rounded-md flex-1 text-center border shadow-lg flex items-center justify-center gap-2`}
          onClick={handleDownload}
          download={isDownloading ? undefined : "douyin_video.mp4"}
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>下载中...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>下载视频</span>
            </>
          )}
        </a>
      </div>
    </div>
  );
} 