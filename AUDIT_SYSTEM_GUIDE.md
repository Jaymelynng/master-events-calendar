# 🔍 Secret Audit History System

## How to Access

1. **Ctrl+Click** (or Cmd+Click on Mac) on the date/time displayed below the main title
2. The audit history modal will open showing all event changes

## What It Tracks

The system automatically logs:

### 📝 **CREATES** (New Events)
- When new events are imported
- Shows event title and date
- Tracks who imported it (currently "Bulk Import")

### 🔄 **UPDATES** (Changed Events)
- Price changes (including "not listed" → actual price)
- Time changes
- Date changes  
- Title changes
- Shows old value → new value for each change

### 🗑️ **DELETES** (Removed Events)
- When events are deleted from the system
- Preserves the event title and date for reference

## Features

- **Automatic Detection**: During import, the system automatically:
  - Detects which events are new
  - Identifies events that have changed
  - Updates changed events automatically
  - Logs all changes to the audit table

- **Complete History**: Shows last 100 changes with:
  - Date and time of change
  - Type of change (CREATE/UPDATE/DELETE)
  - Event details (title, gym, date)
  - Specific fields that changed
  - Who made the change

## Import Summary

When importing events, you'll now see:
```
IMPORT SUMMARY:
✅ New events to add: 5
🔄 Events to update: 3
⏭️ Unchanged events skipped: 12
```

## Technical Details

- Changes are stored in the `event_audit_log` table in Supabase
- The system compares URLs (ignoring query parameters) and event details
- All changes are logged in real-time during import/update/delete operations

This gives you complete visibility into what's happening with your events! 🎯
