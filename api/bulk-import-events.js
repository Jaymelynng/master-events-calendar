// Vercel Serverless Function: Validate and insert events into Supabase securely
// Input (POST): { events: Array<Event> }
// Output: { success: true, inserted: number }

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const { events } = req.body || {};
    if (!Array.isArray(events) || events.length === 0) {
      res.status(400).json({ success: false, error: 'Missing events array' });
      return;
    }

    // Require service role envs on the server only
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      res.status(500).json({ success: false, error: 'Server is missing Supabase credentials' });
      return;
    }

    const supabase = createClient(url, key, { auth: { persistSession: false } });

    // Basic validation and normalization
    const clean = [];
    for (let i = 0; i < events.length; i++) {
      const e = events[i] || {};
      if (!e.gym_id || !e.date || !e.type || !e.event_url || !e.title) {
        res.status(400).json({ success: false, error: `Event ${i + 1} missing required fields` });
        return;
      }
      // Normalize dates
      const d = new Date(e.date);
      if (isNaN(d.getTime())) {
        res.status(400).json({ success: false, error: `Event ${i + 1} invalid date: ${e.date}` });
        return;
      }
      const normalized = { ...e };
      if (!normalized.start_date) normalized.start_date = e.date;
      if (!normalized.end_date) normalized.end_date = e.date;
      clean.push(normalized);
    }

    // Upsert on (gym_id, event_url) to avoid duplicates
    const { data, error } = await supabase
      .from('events')
      .upsert(clean, { onConflict: 'gym_id,event_url' })
      .select('id');
    if (error) throw error;

    res.status(200).json({ success: true, inserted: data?.length || 0 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal error' });
  }
}
