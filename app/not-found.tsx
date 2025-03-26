import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-8">页面未找到</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        您访问的页面不存在或已被移除。请检查您输入的URL是否正确，或返回首页。
      </p>
      <Link href="/" className="btn btn-primary">
        返回首页
      </Link>
    </div>
  );
} 