# 🎯 MASTER EVENTS APP - COMPLETE TECHNICAL FORMULA
## The Non-Coder's Guide to Understanding Everything

---

## 📚 TABLE OF CONTENTS
1. [What This App Does](#what-this-app-does)
2. [The Big Picture - How Everything Connects](#the-big-picture)
3. [The Database (Your Data Storage)](#the-database)
4. [The React App (What You See)](#the-react-app)
5. [How Data Flows](#how-data-flows)
6. [Every Single File Explained](#every-file-explained)
7. [How to Fix Common Problems](#common-problems)
8. [The Complete Formula](#the-complete-formula)

---

## 🎪 WHAT THIS APP DOES

Your Master Events app is like a **digital calendar manager** for all 10 gymnastics locations. Think of it as:

1. **A Calendar** - Shows all events (clinics, kids nights out, open gyms) for each gym
2. **A Tracker** - Counts how many events each gym has scheduled
3. **A Requirement Checker** - Shows if gyms are meeting monthly minimums (1 clinic, 2 KNO, 1 open gym)
4. **A Link Hub** - Connects to each gym's iClass Pro booking pages

---

## 🌐 THE BIG PICTURE - How Everything Connects

```
Your Computer (React App) <----> Internet <----> Supabase Database
     |                                                |
     |                                                |
  [What You See]                              [Where Data Lives]
  - Calendar Grid                             - Events Table
  - Statistics Cards                          - Gyms Table  
  - Event Counts                              - Event Types Table
  - Quick Action Buttons                      - Requirements Table
```

### Think of it like a restaurant:
- **Supabase Database** = The Kitchen (stores all ingredients/data)
- **React App** = The Dining Room (presents everything nicely)
- **API Calls** = The Waiters (carry data back and forth)

---

## 🗄️ THE DATABASE (Your Data Storage)

### What is Supabase?
Supabase is like Google Sheets on steroids - it stores all your data online so your app can access it from anywhere.

### Your Database URL:
```
https://xftiwouxpefchwoxxgpf.supabase.co
```

### Your Access Key (like a password):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdGl3b3V4cGVmY2h3b3h4Z3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODc1MjUsImV4cCI6MjA2NjI2MzUyNX0.jQReOgyjYxOaig_IoJv3jhhPzlfumUcn-vkS1yF9hY4
```

### Your Database Tables (like spreadsheets):

#### 1. **events** Table
What it stores: Every single event at every gym
```
Columns:
- id: Unique number for each event
- gym_id: Which gym (links to gyms table)
- title: Event name (e.g., "Ninja Night Out")
- date: When (e.g., "2025-09-15")
- time: What time (e.g., "18:00")
- price: Cost (e.g., "35")
- type: Category (CLINIC, KIDS NIGHT OUT, or OPEN GYM)
- event_url: Link to register
```

#### 2. **gyms** Table
What it stores: Information about each gym
```
Columns:
- id: Unique gym number
- name: Full gym name (e.g., "Capital Gymnastics Cedar Park")
- code: Short code (e.g., "CCP")
```

#### 3. **event_types** Table
What it stores: The three types of events
```
Columns:
- id: Unique number
- name: Type name (CLINIC, KIDS NIGHT OUT, OPEN GYM)
- is_tracked: Should we count this type? (true/false)
```

#### 4. **monthly_requirements** Table
What it stores: How many events each type needs per month
```
Columns:
- event_type: Which type (CLINIC, KIDS NIGHT OUT, OPEN GYM)
- required_count: How many needed (1, 2, or 1)
```

#### 5. **events_with_gym** (Special View)
This is a "smart table" that combines events + gym names automatically

---

## ⚛️ THE REACT APP (What You See)

### What is React?
React is like LEGO blocks for websites. Each piece (component) does one job and they snap together to make the whole app.

### How Your App is Structured:

```
📅 FINAL-Jaymes Master Event Calendar folder/
│
├── public/               (Basic HTML shell)
│   └── index.html       (The empty page React fills in)
│
├── src/                 (All your app code)
│   ├── App.js          (The main container)
│   ├── components/     
│   │   └── EventsDashboard.js  (THE HEART - 99% of your app)
│   └── lib/            
│       ├── api.js      (Talks to database)
│       ├── supabase.js (Database connection)
│       └── gymLinksApi.js (Backup link system)
│
└── package.json        (List of tools needed)
```

---

## 🔄 HOW DATA FLOWS - Step by Step

### When You Load the Page:

1. **Browser opens localhost:3000**
   - React app starts

2. **EventsDashboard.js wakes up**
   - Sets current month to September 2025
   - Prepares to fetch data

3. **Calls to Database Begin**
   ```
   App says: "Hey Supabase, give me..."
   - All gyms
   - Event types  
   - Events for September 2025
   - Monthly requirements
   ```

4. **Database Responds**
   ```
   Supabase says: "Here's your data!"
   - 10 gyms
   - 3 event types
   - X events for September
   - Requirements (1,2,1)
   ```

5. **App Processes Data**
   - Counts events per gym
   - Calculates missing events
   - Prepares calendar grid

6. **Display Updates**
   - Shows statistics cards
   - Fills calendar with events
   - Colors missing requirements

### When You Click Something:

**Filter by Gym:**
1. You select "Capital Cedar Park"
2. App filters events list to only CCP
3. Calendar re-renders showing only CCP row
4. Stats update to show only CCP numbers

**Change Month:**
1. You click next month arrow
2. App changes to October 2025
3. New database call for October events
4. Everything updates with October data

---

## 📁 EVERY SINGLE FILE EXPLAINED

### Core App Files:

#### **EventsDashboard.js** - THE MAIN FILE (1,700+ lines)
This is 99% of your app. It contains:

```javascript
// 1. IMPORTS (Lines 1-9)
// Brings in tools and libraries

// 2. THEME COLORS (Lines 11-28)
const theme = {
  colors: {
    primary: '#b48f8f',      // Your pink
    secondary: '#cec4c1',    // Gray-beige
    // ... more colors
  }
}

// 3. STATIC DATA (Lines 60-122)
const GYM_EVENT_LINKS = {
  "Capital Gymnastics Cedar Park": {
    "CLINIC": "https://...",
    "KIDS NIGHT OUT": "https://...",
    // Links for each gym
  }
}

// 4. DATA FETCHING HOOKS (Lines 124-254)
// These grab data from Supabase

// 5. MAIN COMPONENT (Lines 256-1761)
const EventsDashboard = () => {
  // All the logic and display code
}
```

Key Sections Inside EventsDashboard:
- **State Management** (Lines 257-281): Tracks what's selected, current month, etc.
- **Data Fetching** (Lines 290-299): Gets all data from database
- **Statistics Functions** (Lines 490-548): Counts events and calculates missing
- **Calendar Display** (Lines 1520-1645): Shows the grid
- **Quick Actions** (Lines 900-1000): Bulk link buttons

#### **api.js** - THE DATABASE TALKER
```javascript
// Gets gyms from database
gymsApi.getAll() 

// Gets events for a date range
eventsApi.getAll(startDate, endDate)

// Gets event types
eventTypesApi.getAll()

// Gets requirements
monthlyRequirementsApi.getAll()
```

#### **supabase.js** - THE CONNECTION
```javascript
// Your credentials
const supabaseUrl = "https://xftiwouxpefchwoxxgpf.supabase.co"
const supabaseAnonKey = "eyJ..."

// Creates connection
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 🔧 HOW TO FIX COMMON PROBLEMS

### Problem: "Missing Supabase environment variables"
**Solution:** Run with full command:
```powershell
$env:REACT_APP_SUPABASE_URL="https://xftiwouxpefchwoxxgpf.supabase.co"; $env:REACT_APP_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdGl3b3V4cGVmY2h3b3h4Z3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODc1MjUsImV4cCI6MjA2NjI2MzUyNX0.jQReOgyjYxOaig_IoJv3jhhPzlfumUcn-vkS1yF9hY4"; npm start
```

### Problem: No events showing
**Check:**
1. Are you looking at the right month? (September 2025 has your data)
2. Is the database connection working?
3. Check browser console (F12) for red errors

### Problem: Wrong event counts
**The Formula:**
- Stats only count events in the CURRENT VIEWED MONTH
- Requirements are: 1 Clinic, 2 Kids Night Out, 1 Open Gym
- Each gym calculated separately

### Problem: Links not working
**Backup System:**
- First tries database (gym_links_detailed)
- Falls back to GYM_EVENT_LINKS in code
- Each gym has 4 links: CLINIC, KNO, OPEN GYM, BOOKING

---

## 📐 THE COMPLETE FORMULA

### Data Flow Formula:
```
User Action → React State Change → Database Query → Data Processing → Display Update
```

### Event Counting Formula:
```
For each gym:
  For each event type:
    Count = (Events in current month matching gym AND type)
    Missing = Required amount - Count
    If Missing > 0, show in red
```

### Calendar Display Formula:
```
For each gym (row):
  For each day (column):
    Find events matching gym AND date
    Display with color based on type
    Make clickable with event URL
```

### Statistics Formula:
```
Total Events = All tracked events for gym in current month
Requirement Met = If all event types have enough events
Color = Green if met, Red if not
```

### Month Navigation Formula:
```
Current View: September 2025 (month 8, year 2025)
Previous: If month = 0, then month = 11 & year - 1
Next: If month = 11, then month = 0 & year + 1
Otherwise: Just change month +/- 1
```

---

## 🚨 EMERGENCY REFERENCE

### To Start Fresh:
1. Make sure you have Node.js installed
2. Open PowerShell in 📅 FINAL folder
3. Run: `npm install` (gets all dependencies)
4. Run: `npm start`

### Key Functions to Know:

**getEventCounts()** - Counts all events by gym and type

**getMissingEventTypes()** - Calculates what's missing

**filteredEvents** - Events after applying filters

**openMultipleTabs()** - Opens all gym links at once

### Database Queries:
- Events load automatically for current month
- Changing month triggers new query
- All queries go through api.js functions

### If Everything Breaks:
1. Check Supabase is accessible (visit the URL)
2. Verify your API key hasn't expired
3. Make sure events table has data
4. Check browser console for specific errors
5. The app is self-contained - if files exist and database connects, it works

---

## 💡 REMEMBER

1. **The app is like a smart spreadsheet viewer**
   - Database = The spreadsheet
   - React = Makes it pretty and interactive

2. **Everything connects through URLs**
   - Database URL tells where data lives
   - API key is your password
   - Event URLs link to registration

3. **The core logic is:**
   - Fetch data for current month
   - Count events by gym and type
   - Compare to requirements
   - Display in calendar grid

4. **Your static backups:**
   - GYM_EVENT_LINKS has all registration URLs
   - Colors and requirements are hard-coded
   - Even without database, structure exists

This is your complete formula. With this document, you can understand every aspect of how your Master Events app works! 🌟