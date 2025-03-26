import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    // 从URL参数中获取视频URL
    const url = new URL(request.url).searchParams.get('url');
    
    if (!url) {
      console.error('未提供视频URL');
      return NextResponse.json(
        { success: false, message: '未提供视频URL' },
        { status: 400 }
      );
    }
    
    console.log('开始下载视频:', url);
    
    // 检查视频URL是否包含允许下载的域
    // 这些域已知是可以直接下载的
    const allowedDomains = [
      'interactive-examples.mdn.mozilla.net',
      'media.w3.org',
      'techslides.com'
    ];
    
    const videoUrl = new URL(url);
    const hostname = videoUrl.hostname;
    const isAllowedDomain = allowedDomains.some(domain => hostname.includes(domain));
    
    console.log('视频主机名:', hostname, '是否允许域:', isAllowedDomain);
    
    // 默认Headers，使用Record<string, string>类型避免索引错误
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    };
    
    // 为允许域添加Referer和Origin
    if (isAllowedDomain) {
      headers['Referer'] = url;
      headers['Origin'] = videoUrl.origin;
    }
    
    console.log('使用以下头部尝试下载:', headers);
    
    try {
      // 尝试通过fetch下载
      const response = await fetch(url, {
        headers: headers,
        cache: 'no-cache',
        next: { revalidate: 0 }
      });
      
      if (!response.ok) {
        console.error('视频下载失败，状态码:', response.status);
        throw new Error(`下载失败，状态码: ${response.status}`);
      }
      
      // 获取视频内容类型
      const contentType = response.headers.get('content-type') || 'video/mp4';
      console.log('下载成功，内容类型:', contentType);
      
      // 将视频传输给客户端
      return new Response(response.body, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="video.mp4"`,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        }
      });
    } catch (error) {
      console.error('fetch下载失败:', error);
      
      // 尝试通过axios作为备用
      try {
        console.log('尝试使用axios下载...');
        const axiosResponse = await axios.get(url, {
          responseType: 'arraybuffer',
          headers: headers,
          timeout: 30000,
          maxRedirects: 5
        });
        
        const data = axiosResponse.data;
        const contentType = axiosResponse.headers['content-type'] || 'video/mp4';
        
        console.log('axios下载成功，内容类型:', contentType);
        
        return new Response(data, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="video.mp4"`,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
          }
        });
      } catch (axiosError) {
        console.error('axios下载也失败:', axiosError);
        throw axiosError;
      }
    }
  } catch (error: any) {
    console.error('视频下载最终失败:', error.message);
    
    let errorMessage = '视频下载失败';
    let statusCode = 500;
    
    if (error.response) {
      statusCode = error.response.status;
      
      if (statusCode === 403) {
        errorMessage = '该视频被保护，无法直接下载。请尝试在线观看。';
      } else if (statusCode === 404) {
        errorMessage = '找不到视频资源，请检查链接是否有效。';
      } else {
        errorMessage = `服务器返回错误: ${statusCode}`;
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = '视频下载超时，请稍后再试。';
      statusCode = 504;
    } else {
      errorMessage = error.message || '下载过程中发生未知错误';
    }
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
} 