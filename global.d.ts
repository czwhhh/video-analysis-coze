import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module 'next/server' {
  export class NextResponse {
    static json(body: any, init?: ResponseInit): NextResponse;
  }
  
  export interface ResponseInit {
    status?: number;
    headers?: Record<string, string>;
  }
}

declare module 'next/headers' {
  export function cookies(): {
    get: (name: string) => { value?: string } | undefined;
    set: (name: string, value: string, options?: any) => void;
  };
}

// 修复全局定义
declare global {
  var mongoose: {
    conn: any | null;
    promise: Promise<any> | null;
  };
}

export {}; 