'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // 记录错误到错误报告系统
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">出错了</h1>
      <h2 className="text-xl font-semibold text-gray-600 mb-8">
        很抱歉，发生了意外错误
      </h2>
      <p className="text-gray-500 mb-8 max-w-md">
        您可以尝试刷新页面，或返回首页。如果问题持续存在，请联系我们的支持团队。
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => reset()}
          className="btn btn-primary"
        >
          重试
        </button>
        <Link href="/" className="btn btn-secondary">
          返回首页
        </Link>
      </div>
    </div>
  );
} 