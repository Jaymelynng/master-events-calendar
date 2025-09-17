// Vercel Serverless Function: Collect real camp signup links for one or more iClassPro portals
// Usage (POST): { slugs: ["capgymavery", ...], programs?: ["Kids Night Out","Open Gym","Clinic"] }
// Response: { success: true, count, links: string[], bySlug: Record<string,string[]> }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const { slugs, programs } = req.body || {};
    if (!Array.isArray(slugs) || slugs.length === 0) {
      res.status(400).json({ success: false, error: 'Missing slugs array' });
      return;
    }

    const programNames = (Array.isArray(programs) && programs.length > 0)
      ? programs
      : ['Kids Night Out', 'Open Gym', 'Clinic'];

    // Helper fetch with timeout
    const fetchJson = async (url, timeoutMs = 15000) => {
      const ctrl = new AbortController();
      const id = setTimeout(() => ctrl.abort(), timeoutMs);
      try {
        const r = await fetch(url, {
          signal: ctrl.signal,
          headers: {
            'user-agent': 'Mozilla/5.0 (compatible; MasterEventsBot/1.0; +https://example.com)'
          }
        });
        if (!r.ok) throw new Error(`${r.status} ${url}`);
        return await r.json();
      } finally {
        clearTimeout(id);
      }
    };

    const bySlug = {};
    for (const slug of slugs) {
      const links = new Set();
      try {
        // Locations
        const locs = await fetchJson(`https://app.iclasspro.com/api/open/v1/${slug}/locations`);
        const locIds = (locs.data || []).map(x => x.id || x.locationId).filter(Boolean);

        for (const locId of locIds) {
          // Program types
          const progs = await fetchJson(`https://app.iclasspro.com/api/open/v1/${slug}/camp-programs/${locId}`);
          const wanted = (progs.data || []).filter(p => {
            const n = (p.name || '').toLowerCase();
            return programNames.some(w => n.includes(w.toLowerCase()));
          });

          // Events per program with pagination
          for (const prog of wanted) {
            let page = 1;
            while (true) {
              const url = `https://app.iclasspro.com/api/open/v1/${slug}/camps?locationId=${locId}&typeId=${prog.id}&limit=50&page=${page}&sortBy=time`;
              const js = await fetchJson(url);
              const data = js?.data || [];
              for (const o of data) {
                links.add(`https://portal.iclasspro.com/${slug}/camp-details/${o.id}`);
              }
              if (data.length < 50) break;
              page += 1;
            }
          }
        }
      } catch (err) {
        // Continue other slugs even if one fails
        console.error('collect-icp-links error for slug', slug, err);
      }
      bySlug[slug] = Array.from(links);
    }

    const allLinks = Object.values(bySlug).flat();
    res.status(200).json({ success: true, count: allLinks.length, links: allLinks, bySlug });
  } catch (err) {
    console.error('collect-icp-links fatal', err);
    res.status(500).json({ success: false, error: 'Internal error' });
  }
}



