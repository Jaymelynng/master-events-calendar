-- Create audit log table for tracking all event changes
CREATE TABLE IF NOT EXISTS event_audit_log (
    id SERIAL PRIMARY KEY,
    event_id TEXT NOT NULL,
    gym_id TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE')),
    field_changed TEXT,
    old_value TEXT,
    new_value TEXT,
    changed_by TEXT DEFAULT 'Bulk Import',
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    event_title TEXT,
    event_date DATE
);

-- Create indexes for fast queries
CREATE INDEX idx_audit_event_id ON event_audit_log(event_id);
CREATE INDEX idx_audit_gym_id ON event_audit_log(gym_id);
CREATE INDEX idx_audit_changed_at ON event_audit_log(changed_at DESC);

-- Grant permissions
GRANT ALL ON event_audit_log TO authenticated;
GRANT ALL ON event_audit_log TO anon;
