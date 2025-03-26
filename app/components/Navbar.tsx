'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-slate-900/90 backdrop-blur-md text-white shadow-lg border-b border-blue-500/30 relative z-10">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70"></div>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold tech-title flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
            </svg>
            视频解析工具
          </Link>
        </div>
      </div>
    </nav>
  );
} 