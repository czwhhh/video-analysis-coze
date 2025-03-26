import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { cookies } from 'next/headers';
import User, { IUser } from '../models/User';
import { connectDB } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const DISABLE_DB = process.env.NEXT_PUBLIC_DISABLE_DB === 'true';

// 生成JWT令牌
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// 验证JWT令牌
export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    console.error('Token验证失败', error);
    return null;
  }
}

// 从cookie中获取当前用户
export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      console.log('未找到token，用户未登录');
      return null;
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('Token验证失败');
      return null;
    }

    console.log('Token验证成功，用户ID:', decoded.userId);
    
    // 演示模式：如果禁用数据库，返回模拟用户
    if (DISABLE_DB) {
      console.log('数据库连接已禁用，返回模拟用户');
      return {
        _id: decoded.userId,
        username: '演示用户',
        email: 'demo@example.com',
        points: 999,
      };
    }
    
    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('数据库中未找到用户');
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('获取当前用户错误:', error);
    return null;
  }
}

// 更新用户积分
export async function updateUserPoints(userId: string, points: number): Promise<boolean> {
  try {
    // 演示模式：如果禁用数据库，直接返回成功
    if (DISABLE_DB) {
      console.log('数据库连接已禁用，不更新积分');
      return true;
    }
    
    await connectDB();
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { points } },
      { new: true }
    );
    
    return !!user;
  } catch (error) {
    console.error('更新用户积分错误:', error);
    return false;
  }
}

// 检查并更新每日登录奖励
export async function checkAndUpdateDailyLoginReward(user: IUser): Promise<number> {
  try {
    // 演示模式：如果禁用数据库，直接返回奖励积分
    if (DISABLE_DB) {
      console.log('数据库连接已禁用，返回固定奖励积分');
      return 10;
    }
    
    await connectDB();
    
    const now = new Date();
    const lastLogin = user.lastLoginDate;
    
    // 检查是否是新的一天
    if (!lastLogin || 
        lastLogin.getDate() !== now.getDate() || 
        lastLogin.getMonth() !== now.getMonth() || 
        lastLogin.getFullYear() !== now.getFullYear()) {
      
      // 更新最后登录日期并增加积分
      await User.findByIdAndUpdate(
        user._id,
        {
          lastLoginDate: now,
          $inc: { points: 10 }
        }
      );
      
      return 10; // 返回增加的积分
    }
    
    return 0; // 今天已经领取过奖励
  } catch (error) {
    console.error('检查每日登录奖励错误:', error);
    return 0;
  }
} 