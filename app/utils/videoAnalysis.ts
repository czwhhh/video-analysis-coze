import axios from 'axios';

interface AnalysisResponse {
  code: number;
  cost: string;
  data: string;
  debug_url: string;
  msg: string;
  token: number;
}

interface AnalysisResult {
  success: boolean;
  videoUrl?: string;
  message?: string;
}

export async function analyzeVideo(url: string): Promise<AnalysisResult> {
  try {
    console.log('正在解析视频链接:', url);
    
    // 简单规范化URL，移除多余空格和不必要的字符
    const cleanUrl = url.trim();
    
    // 检查URL是否为空
    if (!cleanUrl) {
      return {
        success: false,
        message: '视频链接为空'
      };
    }
    
    // 使用指定的Coze API格式发送请求
    const response = await axios.post(
      'https://api.coze.cn/v1/workflow/run',
      {
        parameters: {
          input: cleanUrl
        },
        workflow_id: "7485642000294756378"
      },
      {
        headers: {
          'Authorization': 'Bearer pat_ur38mP94BhFewhCa6gVMa3fOfacxnuQLPxdTQ3O4zDN9XK5v3pLyBbJur4O0hcPH',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('API响应:', response.data);
    const result = response.data as AnalysisResponse;

    if (result.code !== 0) {
      console.error('API返回错误:', result);
      return {
        success: false,
        message: result.msg || '解析失败'
      };
    }

    // 解析返回的数据
    try {
      const parsedData = JSON.parse(result.data);
      console.log('解析后的数据:', parsedData);
      
      if (parsedData && parsedData.output && parsedData.output.length > 0) {
        return {
          success: true,
          videoUrl: parsedData.output[0].url
        };
      } else {
        return {
          success: false,
          message: '无法获取视频链接'
        };
      }
    } catch (error) {
      console.error('数据解析错误:', error, '原始数据:', result.data);
      return {
        success: false,
        message: '数据解析错误'
      };
    }
  } catch (error) {
    console.error('视频解析请求错误:', error);
    return {
      success: false,
      message: '网络请求错误'
    };
  }
} 