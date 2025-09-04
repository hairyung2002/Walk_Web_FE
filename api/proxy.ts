import { VercelRequest, VercelResponse } from '@vercel/node';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://52.3.42.186';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, JSESSIONID, X-Session-ID',
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // URL에서 path 추출 및 쿼리 파라미터 처리
    const { path, ...otherParams } = req.query;
    
    if (!path || typeof path !== 'string') {
      return res.status(400).json({ error: 'Path parameter is required' });
    }

    // 디코딩된 path 사용
    const decodedPath = decodeURIComponent(path);
    
    // 쿼리 파라미터가 있는 경우 URL에 추가
    let targetUrl = `${BACKEND_BASE_URL}${decodedPath}`;
    
    if (Object.keys(otherParams).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(otherParams).forEach(([key, value]) => {
        if (typeof value === 'string') {
          searchParams.append(key, value);
        } else if (Array.isArray(value)) {
          // 배열인 경우 첫 번째 값 사용
          searchParams.append(key, value[0]);
        }
      });
      targetUrl += `?${searchParams.toString()}`;
    }
    
    console.log(`[Proxy] Original query:`, req.query);
    console.log(`[Proxy] Decoded path:`, decodedPath);
    console.log(`[Proxy] Other params:`, otherParams);
    console.log(`[Proxy] Final URL: ${req.method} ${targetUrl}`);

    // 요청 헤더 준비
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    // 클라이언트의 인증 헤더 전달
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization as string;
    }
    if (req.headers.jsessionid) {
      headers.JSESSIONID = req.headers.jsessionid as string;
    }
    if (req.headers['x-session-id']) {
      headers['X-Session-ID'] = req.headers['x-session-id'] as string;
    }

    // fetch 옵션 준비
    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
    };

    // POST, PUT, PATCH 요청의 경우 body 추가
    if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    // 백엔드로 요청 전달
    console.log(`[Proxy] Sending request to: ${targetUrl}`);
    console.log(`[Proxy] Method: ${req.method}`);
    console.log(`[Proxy] Headers:`, headers);
    console.log(`[Proxy] Body:`, req.body);
    
    const response = await fetch(targetUrl, fetchOptions);
    
    const data = await response.text();
    
    console.log(`[Proxy] Response: ${response.status} ${response.statusText}`);
    console.log(`[Proxy] Response headers:`, Object.fromEntries(response.headers.entries()));
    console.log(`[Proxy] Response data:`, data.substring(0, 500)); // 처음 500자만 로깅

    // 응답 헤더 전달
    response.headers.forEach((value, key) => {
      if (key.toLowerCase().startsWith('set-cookie')) {
        res.setHeader(key, value);
      }
    });

    // JSON 응답 처리
    try {
      const jsonData = JSON.parse(data);
      return res.status(response.status).json(jsonData);
    } catch {
      // JSON이 아닌 경우 텍스트로 반환
      return res.status(response.status).send(data);
    }
  } catch (error) {
    console.error('[Proxy] Error:', error);
    return res.status(500).json({
      error: 'Proxy server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
