// Vercel Serverless Function: Fetch and merge iClassPro camps pages from a single camps URL
// Input (POST): { url: string }
// Output: { success: true, merged: iClassProResponse, pages: number }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const { url } = req.body || {};
    if (typeof url !== 'string' || url.length < 10) {
      res.status(400).json({ success: false, error: 'Missing or invalid url' });
      return;
    }

    // Validate expected camps URL
    // Example: https://app.iclasspro.com/api/open/v1/{slug}/camps?locationId=...&typeId=...&limit=50&page=1&sortBy=time
    const isCampsEndpoint = /\/api\/open\/v1\/[^/]+\/camps\?/i.test(url);
    if (!isCampsEndpoint) {
      res.status(400).json({ success: false, error: 'URL must be an iClassPro camps API endpoint' });
      return;
    }

    const firstPage = await fetchJson(url);
    const merged = { ...firstPage };
    const firstData = Array.isArray(firstPage?.data) ? firstPage.data : [];
    const pageSize = 50; // iClassPro default used in this project
    let page = 1;
    let totalPages = 1;

    // Collect subsequent pages until a short page is returned
    const all = [...firstData];
    while (true) {
      page += 1;
      const nextUrl = setQueryParam(url, 'page', String(page));
      const next = await fetchJson(nextUrl);
      const rows = Array.isArray(next?.data) ? next.data : [];
      if (rows.length === 0) break;
      all.push(...rows);
      totalPages = page;
      if (rows.length < pageSize) break;
    }

    merged.data = all;
    // Ensure totalRecords reflects merged list if present
    if (typeof merged.totalRecords === 'number') {
      merged.totalRecords = all.length;
    }

    res.status(200).json({ success: true, merged, pages: totalPages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal error' });
  }
}

async function fetchJson(url, timeoutMs = 15000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; MasterEventsFetcher/1.0)'
      },
    });
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    return await r.json();
  } finally {
    clearTimeout(id);
  }
}

function setQueryParam(inputUrl, key, value) {
  try {
    const u = new URL(inputUrl);
    u.searchParams.set(key, value);
    return u.toString();
  } catch (_) {
    // Fallback: naive replace
    const hasParam = new RegExp(`[?&]${key}=`).test(inputUrl);
    if (hasParam) return inputUrl.replace(new RegExp(`([?&]${key}=)[^&]*`), `$1${value}`);
    return inputUrl + (inputUrl.includes('?') ? `&${key}=${value}` : `?${key}=${value}`);
  }
}
