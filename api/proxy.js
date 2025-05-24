// api/proxy.js
export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    res.status(400).json({ error: 'Missing url parameter' });
    return;
  }

  try {
    const upstream = await fetch(url);
    const text     = await upstream.text();
    let contents;
    try {
      contents = JSON.parse(text);
    } catch {
      // upstream might return XML/HTML or unstructured, wrap in error
      res.status(502).json({ error: 'Upstream did not return JSON', body: text });
      return;
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ contents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
