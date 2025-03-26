import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../utils/auth';
import { cookies } from 'next/headers';

const DISABLE_DB = process.env.NEXT_PUBLIC_DISABLE_DB === 'true';

export async function GET() {
  try {
    // 演示模式：如果禁用数据库，检查token并返回模拟用户
    if (DISABLE_DB) {
      console.log('数据库连接已禁用，使用模拟用户模式');
      
      const cookieStore = cookies();
      const token = cookieStore.get('token')?.value;
      
      console.log('当前token:', token);
      
      if (!token) {
        console.log('未找到token，用户未登录');
        return NextResponse.json(
          { success: false, message: '未登录' },
          { status: 401 }
        );
      }
      
      // 返回模拟用户数据
      console.log('返回模拟用户数据');
      return NextResponse.json({
        success: true,
        user: {
          id: 'demo-user-id',
          username: '演示用户',
          email: 'demo@example.com',
          points: 999,
        },
      });
    }
    
    // 正常模式：获取当前用户
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        points: user.points,
      },
    });
  } catch (error: any) {
    console.error('获取用户信息错误:', error.message);
    return NextResponse.json(
      { success: false, message: '获取用户信息失败' },
      { status: 500 }
    );
  }
} 