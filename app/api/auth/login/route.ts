import { NextResponse } from 'next/server';
import User from '../../../models/User';
import { connectDB } from '../../../utils/database';
import { generateToken, checkAndUpdateDailyLoginReward } from '../../../utils/auth';
import { cookies } from 'next/headers';

const DISABLE_DB = process.env.NEXT_PUBLIC_DISABLE_DB === 'true';

// 演示用户数据
const DEMO_USERS = [
  {
    _id: 'demo1',
    username: 'demo',
    email: 'demo@example.com',
    password: 'password',
    points: 999,
    comparePassword: (pass: string) => pass === 'password'
  },
  {
    _id: 'demo2',
    username: 'user',
    email: 'user@example.com',
    password: 'password',
    points: 999,
    comparePassword: (pass: string) => pass === 'password'
  }
];

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    console.log('登录请求:', username, password);

    // 验证输入
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: '请提供用户名和密码' },
        { status: 400 }
      );
    }

    // 演示模式：如果禁用数据库，使用模拟用户数据
    if (DISABLE_DB) {
      console.log('数据库连接已禁用，使用模拟登录模式');
      
      // 任何用户名密码组合都允许登录 - 在演示模式下
      const demoUser = {
        _id: 'demo-user',
        username: username || '演示用户',
        email: `${username}@example.com`,
        password: 'password',
        points: 999,
      };
      
      // 生成令牌
      const token = generateToken(demoUser._id);
      console.log('生成的token:', token);
      
      // 设置cookie
      const cookieStore = cookies();
      cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1周
        path: '/',
      });
      
      console.log('模拟登录成功，返回用户数据:', demoUser);
      return NextResponse.json({
        success: true,
        message: '登录成功',
        user: {
          id: demoUser._id,
          username: demoUser.username,
          email: demoUser.email,
          points: demoUser.points,
        },
        dailyReward: true,
        rewardPoints: 10,
      });
    }

    await connectDB();

    // 查找用户
    const user = await User.findOne({
      $or: [{ email: username }, { username }],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户名或密码不正确' },
        { status: 401 }
      );
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: '用户名或密码不正确' },
        { status: 401 }
      );
    }

    // 检查每日登录奖励
    const rewardPoints = await checkAndUpdateDailyLoginReward(user);

    // 生成令牌
    const token = generateToken(user._id.toString());
    
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
      message: '登录成功',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        points: user.points + rewardPoints,
      },
      dailyReward: rewardPoints > 0,
      rewardPoints,
    });
  } catch (error: any) {
    console.error('登录错误:', error.message);
    return NextResponse.json(
      { success: false, message: '登录过程中发生错误' },
      { status: 500 }
    );
  }
} 