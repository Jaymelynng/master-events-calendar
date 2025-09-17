// Local dev API to bypass CORS: aggregates iClassPro open API into real signup links
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

async function fetchJson(url, timeoutMs = 15000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; MasterEventsDev/1.0)'
      }
    });
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    return await r.json();
  } finally {
    clearTimeout(id);
  }
}

app.post('/api/collect-icp-links', async (req, res) => {
  try {
    const slugs = Array.isArray(req.body?.slugs) ? req.body.slugs : [];
    const programs = Array.isArray(req.body?.programs) && req.body.programs.length
      ? req.body.programs
      : ['Kids Night Out', 'Open Gym', 'Clinic'];
    if (!slugs.length) return res.status(400).json({ success: false, error: 'Missing slugs' });

    const bySlug = {};
    for (const slug of slugs) {
      const links = new Set();
      try {
        const locs = await fetchJson(`https://app.iclasspro.com/api/open/v1/${slug}/locations`);
        const locIds = (locs.data || []).map(x => x.id || x.locationId).filter(Boolean);
        for (const locId of locIds) {
          const progs = await fetchJson(`https://app.iclasspro.com/api/open/v1/${slug}/camp-programs/${locId}`);
          const wanted = (progs.data || []).filter(p => {
            const n = (p.name || '').toLowerCase();
            return programs.some(w => n.includes(w.toLowerCase()));
          });
          for (const prog of wanted) {
            let page = 1;
            while (true) {
              const url = `https://app.iclasspro.com/api/open/v1/${slug}/camps?locationId=${locId}&typeId=${prog.id}&limit=50&page=${page}&sortBy=time`;
              const js = await fetchJson(url);
              const data = js?.data || [];
              for (const o of data) links.add(`https://portal.iclasspro.com/${slug}/camp-details/${o.id}`);
              if (data.length < 50) break;
              page += 1;
            }
          }
        }
      } catch (err) {
        console.warn('collect error for slug', slug, err.message);
      }
      bySlug[slug] = Array.from(links);
    }

    const all = Object.values(bySlug).flat();
    res.json({ success: true, count: all.length, links: all, bySlug });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Internal error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Dev API running on http://localhost:${PORT}`));



