# OKC Super Calendar â Google Sheets Setup Guide

This guide walks you through connecting Google Sheets as the single source of truth for events, happy hours, and user submissions.

## Architecture Overview

```
Google Sheets (source of truth)
  âââ "Events" tab         â nightly agent writes new events here
  âââ "Happy Hours" tab    â you manage HH venues here
  âââ "Submissions" tab    â user form submissions land here
         â
         â¼ (you review & approve)
         â
Nightly Agent (GitHub Actions, 2 AM Central)
  1. Reads Events + HH + Approved Submissions from Sheets
  2. Scrapes 50+ OKC sources via Anthropic API
  3. Deduplicates and appends new events to Sheets
  4. Exports events.json + happyHours.json
  5. Commits to GitHub â triggers Vercel rebuild

Firebase (unchanged)
  âââ Vote counts only
```

## Step 1: Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
2. Name it **"OKC Super Calendar Data"**
3. Rename the first tab to **Events**
4. Add these headers in Row 1:

   `name | venue | date | desc | cat | cat2 | confirmed | source | tickets | free | district`

5. Create a second tab called **Happy Hours** with headers:

   `name | venue | days | time | desc | url | patio | rooftop | district`

   - The `days` column uses numbers: `0,1,2,3,4` = Mon-Fri, `0,1,2,3,4,5,6` = Daily
   - `patio` and `rooftop` columns use TRUE or FALSE

6. Create a third tab called **Submissions** with headers:

   `timestamp | type | name | venue | date | category | district | url | description | contact | hhTime | hhDays | patio | rooftop | recurFreq | status`

   - The `status` column is what you'll use to review: set to **Approved**, **Pending**, or **Rejected**

## Step 2: Import Your Current Data

To seed the Events tab with your existing 3,200+ events:

1. Open your current `src/data/events.json` file
2. You can paste it into a JSON-to-CSV converter (like [csvjson.com](https://csvjson.com/json2csv))
3. Paste the CSV into the Events tab starting at Row 2

For Happy Hours, convert `src/data/happyHours.json`:
- `n` â name, `v` â venue, `d` â days (as comma-separated), `t` â time

## Step 3: Deploy the Google Apps Script

1. In your Google Sheet, go to **Extensions â Apps Script**
2. Delete any existing code in `Code.gs`
3. Copy the entire contents of `google-apps-script.js` (in your project folder) and paste it in
4. Click **Deploy â New deployment**
5. Choose **Web app** as the type
6. Set:
   - **Execute as**: Me
   - **Who has access**: Anyone
7. Click **Deploy** and copy the URL â it looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`
8. **Important**: This URL replaces your old one in two places:
   - `src/services/googleSheets.js` â update `GOOGLE_SHEET_URL`
   - GitHub repo â Settings â Secrets â update `GOOGLE_SHEET_URL`

## Step 4: Update the React App

In `src/services/googleSheets.js`, replace the old URL:

```js
export const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/YOUR_NEW_URL/exec";
```

## Step 5: Set Up GitHub Actions

1. Copy the files into your repo:
   - `okc_calendar_agent.py` â root of repo
   - `.github/workflows/nightly-agent.yml` â create this folder structure

2. In your GitHub repo, go to **Settings â Secrets and variables â Actions**
3. Add these secrets:
   - `ANTHROPIC_API_KEY` â your Anthropic API key
   - `GOOGLE_SHEET_URL` â the Apps Script URL from Step 3

4. The workflow runs automatically at 2 AM Central every night
5. You can also trigger it manually: **Actions â OKC Calendar Agent â Run workflow**

## Step 6: Test It

1. Test the Apps Script reads:
   - Visit `YOUR_APPS_SCRIPT_URL?action=events` â should return JSON array
   - Visit `YOUR_APPS_SCRIPT_URL?action=happyhours` â should return JSON array

2. Test form submissions:
   - Submit a test event on your site
   - Check the Submissions tab â it should appear with status "Pending"

3. Test the nightly agent:
   - Go to GitHub Actions and manually trigger the workflow
   - Check that `src/data/events.json` gets updated in the commit

## Day-to-Day Workflow

**Reviewing submissions:**
1. Open the Google Sheet â Submissions tab
2. Review each row with status "Pending"
3. Change status to **Approved** or **Rejected**
4. Approved submissions get picked up on the next nightly run

**Editing events:**
- Edit any event directly in the Events tab
- Changes appear on the site after the next nightly run

**Adding happy hours:**
- Add new rows to the Happy Hours tab
- Use days format: `0,1,2,3,4` for Mon-Fri
- Set patio/rooftop to TRUE or FALSE

**Checking agent health:**
- Go to GitHub â Actions tab to see nightly run logs
- The `agent_log.json` file tracks sources run, failures, and event counts
