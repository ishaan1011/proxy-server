// api/proxy.js
export default async function handler(req, res) {
  // 1) Always allow CORS (for GET and preflight)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  // Respond to preflight:
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const upstream = await fetch(url);
    const text     = await upstream.text();

    let contents;
    try {
      contents = JSON.parse(text);
    } catch {
      return res
        .status(502)
        .json({ error: 'Upstream did not return JSON', body: text });
    }

    // 2) Success response (already has CORS header)
    return res.status(200).json({ contents });

  } catch (err) {
    // 3) Error path — still has CORS header
    return res.status(500).json({ error: err.message });
  }
}
