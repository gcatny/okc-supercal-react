# OKC Super Calendar — React Setup & Deployment Guide

## What You Have

Your original monolithic `index.html` (6,054 lines) has been converted into a clean React project with 32 files organized into logical components. Your original file is **untouched** — this is a brand new folder alongside it.

### Project Structure
```
okc-supercal-react/
├── index.html              ← Vite entry (has all your SEO/OG tags)
├── package.json            ← Dependencies
├── vite.config.js          ← Build config
├── vercel.json             ← Vercel SPA routing
├── public/
│   └── og-image.png        ← Social sharing image
└── src/
    ├── main.jsx            ← React entry point
    ├── App.jsx             ← Root component (wires everything)
    ├── components/         ← 11 UI components
    │   ├── Header.jsx
    │   ├── SearchBar.jsx
    │   ├── CategoryFilters.jsx
    │   ├── HappyHourPanel.jsx
    │   ├── DistrictPanel.jsx
    │   ├── CalendarGrid.jsx
    │   ├── EventDetail.jsx
    │   ├── FilteredEventList.jsx
    │   ├── SubmitEventForm.jsx
    │   ├── Footer.jsx
    │   ├── Toast.jsx
    │   └── StatusBar.jsx
    ├── data/               ← Event data (nightly agent updates these)
    │   ├── events.json     ← 3,218 events
    │   ├── happyHours.json ← 194 happy hour venues
    │   ├── categories.js   ← 20 categories + colors
    │   ├── districts.js    ← 35 districts + mappings
    │   └── sources.js      ← 25 source definitions
    ├── hooks/              ← React state management
    │   ├── useCalendar.js
    │   ├── useFilters.js
    │   ├── useSearch.js
    │   └── useVoting.js
    ├── services/           ← External integrations
    │   ├── firebase.js     ← Voting (Firebase Realtime DB)
    │   └── googleSheets.js ← Event submission
    ├── styles/
    │   └── global.css      ← ALL styles (faithful 1:1 copy)
    └── utils/
        ├── dateUtils.js    ← Date helpers
        └── eventUtils.js   ← Event filtering, HH generation, etc.
```

---

## Step 1: Push to GitHub

1. Create a **new GitHub repo** (e.g., `okc-supercal-react`)
   - Go to github.com → New Repository → name it `okc-supercal-react`
   - Leave it empty (no README, no .gitignore)

2. In your terminal, navigate to the project folder:
   ```bash
   cd "OKC Super Calendar - Claud CoWork/okc-supercal-react"
   git init
   git add .
   git commit -m "Initial React rebuild of OKC Super Calendar"
   git branch -M main
   git remote add origin https://github.com/gcatny/okc-supercal-react.git
   git push -u origin main
   ```

---

## Step 2: Deploy on Vercel

1. Go to **vercel.com** and sign in with your GitHub account
2. Click **"Add New Project"**
3. Import your `okc-supercal-react` repo
4. Vercel will auto-detect it's a Vite project. Settings should be:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**

Your site will be live at something like `okc-supercal-react.vercel.app` within ~60 seconds.

---

## Step 3: Connect Your Custom Domain

1. In Vercel dashboard → your project → **Settings → Domains**
2. Add `www.okcsupercal.com` (or a new subdomain like `app.okcsupercal.com`)
3. Vercel will give you DNS records to add at your domain registrar
4. Once DNS propagates (~5 min), your React site is live at your domain

**Important:** Your original site stays untouched until you're ready to switch. You can run both side by side (e.g., old site at `okcsupercal.com`, new at `app.okcsupercal.com`) until you're confident.

---

## Step 4: Test Locally First

Before deploying, you can preview locally:
```bash
cd okc-supercal-react
npm install
npm run dev
```
This opens the site at `http://localhost:5173`. Check everything looks right.

To do a production build test:
```bash
npm run build
npm run preview
```

---

## How the Nightly Agent Will Work (Future)

Right now, all event data lives in two JSON files:
- `src/data/events.json` — 3,218 events
- `src/data/happyHours.json` — 194 happy hour venues

Your nightly Python agent (`okc_calendar_agent.py`) will be updated to:
1. Crawl all your source sites
2. Output fresh `events.json` and `happyHours.json`
3. Commit them to the GitHub repo
4. Vercel auto-deploys on every push (zero manual work)

This means updating the site is as simple as updating the two JSON files — no more editing a 6,000-line HTML file.

---

## How to Make Changes

### Add a new event category
1. Edit `src/data/categories.js` — add to ALL_CATS, CATEGORY_LABELS, CATEGORY_COLORS
2. Add CSS variables in `src/styles/global.css`

### Add a new district
1. Edit `src/data/districts.js` — add to DISTRICTS array and HH_DISTRICT_MAP

### Change the header/branding
1. Edit `src/components/Header.jsx`

### Change calendar behavior
1. Edit `src/components/CalendarGrid.jsx`

### Change how events display
1. Edit `src/components/EventDetail.jsx`

### Add a login system (future)
Vercel supports NextAuth.js natively. When you're ready, we can add authentication with minimal effort since the project is already on Vercel.

---

## What's Preserved (1:1 from original)

- All 20 event categories with exact colors
- All 35 districts with venue-to-district mapping
- Complete happy hour system (toggle, patio filter, rooftop filter)
- Firebase voting (same database, same keys)
- Google Sheets event submission
- Google Analytics (same tracking ID)
- All SEO: Open Graph, Twitter Cards, structured data
- Exact same fonts: Bebas Neue, DM Sans, Handelson Three
- Full mobile responsive design
- Search with overlay results
- Calendar month navigation with event chips
- Event detail panel with Google Calendar integration
- Filtered event list when categories/districts selected
