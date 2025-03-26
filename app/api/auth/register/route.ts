import { NextResponse } from 'next/server';
import User from '../../../models/User';
import { connectDB } from '../../../utils/database';
import { generateToken } from '../../../utils/auth';
import { cookies } from 'next/headers';

const DISABLE_DB = process.env.NEXT_PUBLIC_DISABLE_DB === 'true';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // 验证输入
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: '请提供用户名、邮箱和密码' },
        { status: 400 }
      );
    }

    // 演示模式：如果禁用数据库，直接模拟注册成功
    if (DISABLE_DB) {
      console.log('数据库连接已禁用，使用模拟注册模式');
      
      // 生成令牌
      const token = generateToken('demo-user-id');
      
      // 设置cookie
      const cookieStore = cookies();
      cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1周
        path: '/',
      });

      return NextResponse.json({
        success: true,
        message: '注册成功',
        user: {
          id: 'demo-user-id',
          username,
          email,
          points: 100,
        },
      });
    }

    await connectDB();

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: '用户名或邮箱已被使用' },
        { status: 400 }
      );
    }

    // 创建新用户
    const newUser = await User.create({
      username,
      email,
      password,
      points: 100, // 初始积分
      lastLoginDate: new Date(),
    });

    // 生成令牌
    const token = generateToken(newUser._id.toString());
    
    // 设置cookie
    const cookieStore = cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1周
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: '注册成功',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        points: newUser.points,
      },
    });
  } catch (error: any) {
    console.error('注册错误:', error.message);
    return NextResponse.json(
      { success: false, message: '注册过程中发生错误' },
      { status: 500 }
    );
  }
} 