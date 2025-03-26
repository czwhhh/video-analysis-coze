# 视频解析网站

这是一个功能完善的视频解析网站，支持抖音、快手、微博等多平台视频在线解析与下载。

## 功能特性

- **登录系统**：自定义登录界面，登录成功后自动跳转至首页
- **注册系统**：注册成功后自动登录并跳转到首页，创建用户资料并设置初始积分
- **积分系统**：
  - 注册赠送100积分
  - 每日首次登录奖励10积分
  - 每次解析扣除1积分
  - 积分不足时无法使用解析功能
- **视频解析**：支持多平台视频链接解析，获取无水印视频
- **访问控制**：游客可以访问首页，但解析功能需要登录。游客点击解析时自动跳转到登录页

## 技术栈

- Next.js - React框架
- TypeScript - 类型安全的JavaScript
- MongoDB - 数据库
- Tailwind CSS - 样式框架
- Axios - HTTP客户端
- JWT - 用户认证

## 安装与运行

1. 克隆仓库
```
git clone https://github.com/yourusername/video-analysis-coze.git
cd video-analysis-coze
```

2. 安装依赖
```
npm install
```

3. 配置环境变量
在项目根目录创建`.env.local`文件，添加以下内容：
```
MONGODB_URI=mongodb://localhost:27017/video-analysis
JWT_SECRET=your-secret-key
NODE_ENV=development
```

4. 启动开发服务器
```
npm run dev
```

5. 访问网站
打开浏览器访问 http://localhost:3000

## API接口

### 用户认证
- POST `/api/auth/register` - 用户注册
- POST `/api/auth/login` - 用户登录
- POST `/api/auth/logout` - 用户退出

### 用户信息
- GET `/api/user/me` - 获取当前登录用户信息

### 视频解析
- POST `/api/video/analyze` - 解析视频

## 使用说明

1. 复制您想要解析的视频分享链接
2. 粘贴到首页输入框中，点击"开始解析"
3. 解析成功后，可以在线观看或下载视频
4. 每次解析消耗1积分，注册赠送100积分
5. 每日首次登录可获得10积分奖励 