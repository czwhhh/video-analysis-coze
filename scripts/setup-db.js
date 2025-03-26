/**
 * 数据库初始化脚本
 * 运行方式: node scripts/setup-db.js
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/video-analysis';

async function setupDatabase() {
  console.log('开始初始化数据库...');
  
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('成功连接到MongoDB');
    
    const db = client.db();
    
    // 创建用户集合
    if (!(await collectionExists(db, 'users'))) {
      await db.createCollection('users');
      console.log('创建users集合');
      
      // 创建用户名和邮箱唯一索引
      await db.collection('users').createIndex({ username: 1 }, { unique: true });
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('为users集合创建索引');
    } else {
      console.log('users集合已存在');
    }
    
    console.log('数据库初始化完成');
    await client.close();
    
  } catch (error) {
    console.error('数据库初始化失败:', error);
  }
}

async function collectionExists(db, collectionName) {
  const collections = await db.listCollections({ name: collectionName }).toArray();
  return collections.length > 0;
}

setupDatabase(); 