import { NextResponse } from 'next/server';
import { analyzeVideo } from '../../../utils/videoAnalysis';

export async function POST(request: Request) {
  try {
    // 获取视频URL
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json(
        { success: false, message: '请提供视频链接' },
        { status: 400 }
      );
    }

    // 解析视频
    const result = await analyzeVideo(url);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || '视频解析失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '解析成功',
      data: {
        url: result.videoUrl,
      },
    });
  } catch (error: any) {
    console.error('视频解析错误:', error.message);
    return NextResponse.json(
      { success: false, message: '解析过程中发生错误' },
      { status: 500 }
    );
  }
} 