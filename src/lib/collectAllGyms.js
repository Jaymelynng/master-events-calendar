// Lightweight open-API collector for iClassPro public portals
// Collects real signup links without requiring admin login

import { supabase } from './supabase'

const DEFAULT_PROGRAMS = ['kids night out', 'open gym', 'clinic']

async function fetchJson(url) {
  const res = await fetch(url, { credentials: 'omit' })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

async function collectForAccount(accountSlug, programMatches, log) {
  const events = []
  try {
    const locs = await fetchJson(`https://app.iclasspro.com/api/open/v1/${accountSlug}/locations`)
    const locIds = (locs.data || []).map(x => x.id || x.locationId).filter(Boolean)
    for (const locId of locIds) {
      const progs = await fetchJson(`https://app.iclasspro.com/api/open/v1/${accountSlug}/camp-programs/${locId}`)
      const allProgs = (progs.data || [])
      const wanted = (programMatches && programMatches.length > 0)
        ? allProgs.filter(p => programMatches.some(w => (p.name || '').toLowerCase().includes(w)))
        : allProgs
      for (const prog of wanted) {
        let page = 1
        // paginate until fewer than 50
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const url = `https://app.iclasspro.com/api/open/v1/${accountSlug}/camps?locationId=${locId}&typeId=${prog.id}&limit=50&page=${page}&sortBy=time`
          const { data = [] } = await fetchJson(url)
          for (const o of data) {
            events.push({
              account: accountSlug,
              program_label: prog.name,
              event_id: o.id,
              title: o.name,
              signup_url: `https://portal.iclasspro.com/${accountSlug}/camp-details/${o.id}`,
            })
          }
          if (data.length < 50) break
          page += 1
        }
      }
    }
  } catch (e) {
    if (log) log(`   ERROR ${accountSlug}: ${e.message}`)
  }
  return events
}

export async function collectAllGymsJob({ slugs = [], programs = DEFAULT_PROGRAMS, log = () => {}, upsert = false } = {}) {
  const programMatches = programs.map(p => (p || '').toLowerCase())

  const bySlug = {}
  let total = 0
  for (const slug of slugs) {
    log(`→ ${slug}`)
    const list = await collectForAccount(slug, programMatches, log)
    bySlug[slug] = list
    log(`   found ${list.length} events`)
    total += list.length
  }

  // Optional upsert (disabled by default to avoid schema mismatches)
  let upserted = 0
  if (upsert && total > 0) {
    try {
      // Best-effort: require events table with event_id column; skip if missing
      const probe = await supabase.from('events').select('event_id').limit(1)
      if (probe.error) throw probe.error

      // Map slugs to gym ids
      const { data: gyms } = await supabase.from('gyms').select('id, account_slug')
      const slugToGymId = Object.fromEntries((gyms || []).map(g => [g.account_slug, g.id]))

      const rows = Object.values(bySlug).flat()
        .filter(e => slugToGymId[e.account])
        .map(e => ({
          gym_id: slugToGymId[e.account],
          event_id: e.event_id,
          title: e.title,
          signup_url: e.signup_url,
        }))

      if (rows.length > 0) {
        const { data, error } = await supabase
          .from('events')
          .upsert(rows, { onConflict: 'gym_id,event_id' })
          .select('gym_id,event_id')
        if (error) throw error
        upserted = data?.length || 0
        log(`   upserted ${upserted} rows`)
      }
    } catch (e) {
      log(`   upsert skipped: ${e.message}`)
    }
  }

  return { total, upserted, bySlug }
}


