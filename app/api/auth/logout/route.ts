import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // 清除cookie
    const cookieStore = cookies();
    cookieStore.set('token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: '已退出登录',
    });
  } catch (error: any) {
    console.error('退出登录错误:', error.message);
    return NextResponse.json(
      { success: false, message: '退出过程中发生错误' },
      { status: 500 }
    );
  }
} 