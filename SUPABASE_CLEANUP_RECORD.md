# 🧹 SUPABASE DATABASE CLEANUP RECORD
## Master Events Calendar - Database Consolidation

**Date:** September 9, 2025  
**Database:** `https://xftiwouxpefchwoxxgpf.supabase.co`
**Goal:** Remove all non-calendar related data and consolidate to single source of truth

---

## 📋 BEFORE CLEANUP - CURRENT TABLES:

### ✅ KEEP (Essential for Calendar):
- `events` - All event data (historical preserved)
- `gyms` - Gym information  
- `event_types` - CLINIC, KIDS NIGHT OUT, OPEN GYM
- `monthly_requirements` - Monthly event requirements
- `events_with_gym` - View joining events + gyms

### ❌ DELETE (Not needed for calendar):
- `custom_data_entries` - Email template data
- `email_templates` - Email system
- `template_categories` - Template organization  
- `template_variables` - Email variables

### 🔧 CLEAN (Remove non-event links):
- `gym_links` - Remove facebook, messenger, free_trial entries
- `link_types` - Remove non-event link types
- `gym_links_detailed` - Will auto-update after cleanup

---

## 🎯 GOAL STATE - FINAL TABLES:

### Core Calendar Data:
1. `events` - All events from all months/years
2. `gyms` - 10 gym locations
3. `event_types` - 3 event categories
4. `monthly_requirements` - Requirements (1 clinic, 2 KNO, 1 open gym)

### Clickable Links:
5. `gym_links` - Only event category links (skill_clinics, kids_night_out, open_gym, booking)
6. `link_types` - Only event link types
7. `gym_links_detailed` - View for easy access

---

## 🚨 ACTIONS TAKEN:

### Phase 1: Delete Unnecessary Tables
### Phase 2: Clean gym_links Data  
### Phase 3: Add Missing Event Category Links
### Phase 4: Verify All Links Work

---

**STATUS: READY TO EXECUTE CLEANUP**
