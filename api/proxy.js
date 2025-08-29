import fetch from "node-fetch";

export default async function handler(req, res) {
  const BACKEND_URL = process.env.VITE_SERVER_API_URL || "http://52.3.42.186";
  
  try {
    // 클라이언트가 요청한 path
    const path = req.query.path || ""; // 예: /users

    // HTTP 백엔드 요청
    const backendRes = await fetch(`${BACKEND_URL}${path}`, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...req.headers,
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await backendRes.json();

    res.status(backendRes.status).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Proxy error" });
  }
}