import './styles/globals.css';
import { Metadata } from 'next';
import Navbar from './components/Navbar';

export const metadata: Metadata = {
  title: '视频解析工具 - 高效视频下载解析平台',
  description: '一站式视频解析下载平台，支持抖音、快手、微博等多平台视频无水印下载',
  keywords: '视频解析, 抖音下载, 视频无水印, 短视频解析, 视频下载工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        <div className="fixed inset-0 bg-grid-slate-900/[0.04]"></div>
        
        <Navbar />
        <main className="container mx-auto px-4 py-10 min-h-[calc(100vh-150px)]">
          {children}
        </main>
        
        <footer className="border-t border-blue-500/20 pt-8 pb-6 text-center text-blue-200/60 text-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
                </svg>
                <span className="text-blue-100">视频解析工具</span>
              </div>
              
              <div className="flex gap-6">
                <span className="hover:text-blue-300 transition-colors duration-200 cursor-pointer">用户协议</span>
                <span className="hover:text-blue-300 transition-colors duration-200 cursor-pointer">隐私政策</span>
                <span className="hover:text-blue-300 transition-colors duration-200 cursor-pointer">常见问题</span>
              </div>
              
              <div className="text-blue-300/70">
                版权所有 © {new Date().getFullYear()} 视频解析工具
              </div>
            </div>
            
            <div className="mt-6 text-xs text-blue-200/40">
              本站仅提供视频解析服务，不存储任何视频内容。用户对解析后内容的使用应遵守相关法律法规。
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
} 