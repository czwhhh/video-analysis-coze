import React from 'react';
import Head from 'next/head';

interface PageHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export default function PageHead({
  title = '视频解析工具',
  description = '一站式视频解析下载平台，支持抖音、快手、微博等多平台视频在线解析',
  keywords = '视频解析,无水印,抖音,快手,微博,下载'
}: PageHeadProps) {
  const fullTitle = `${title} - 视频解析工具`;
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
} 