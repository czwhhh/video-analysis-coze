import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/video-analysis';
const DISABLE_DB = process.env.NEXT_PUBLIC_DISABLE_DB === 'true';

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  // 如果禁用数据库，则返回空值
  if (DISABLE_DB) {
    console.log('数据库连接已禁用，使用模拟模式');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB; 