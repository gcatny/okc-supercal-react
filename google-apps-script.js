/**
 * OKC Super Calendar — Google Apps Script (Canonical Model)
 *
 * Deploy as a web app: Extensions → Apps Script → Deploy → Web App → "Anyone"
 *
 * ── TAB STRUCTURE ──────────────────────────────────────────────────────────
 *
 *  "Events" tab  (one row per UNIQUE event — not one row per date)
 *  ┌────────────────────────────────────────────────────────────────────────┐
 *  │ id | name | venue | district | cat | cat2 | recurrence | days         │
 *  │ startDate | endDate | desc | tickets | free | confirmed | source       │
 *  └────────────────────────────────────────────────────────────────────────┘
 *    recurrence : "none" | "weekly" | "daily"
 *    days       : comma-separated day abbrs, e.g. "Fri,Sat"  (blank = all)
 *    startDate / endDate : YYYY-MM-DD
 *
 *  "Happy Hours" tab  (one row per venue — already canonical)
 *  ┌───────────────────────────────────────────────────────────────────────┐
 *  │ name | venue | days | time | desc | url | patio | rooftop | district  │
 *  └───────────────────────────────────────────────────────────────────────┘
 *    days: comma-separated 0-based ints, 0=Mon…6=Sun
 *
 *  "Submissions" tab  (raw user submissions — reviewed manually)
 *  ┌────────────────────────────────────────────────────────────────────────┐
 *  │ timestamp | type | name | venue | date | category | district | url    │
 *  │ description | contact | hhTime | hhDays | patio | rooftop | recurFreq │
 *  │ status                                                                 │
 *  └────────────────────────────────────────────────────────────────────────┘
 *    status: "Pending" → "Approved" or "Rejected"
 */


// ── POST handler ─────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss   = SpreadsheetApp.getActiveSpreadsheet();

    // Nightly agent: upsert canonical events (new model)
    if (data.action === "upsert_events" && Array.isArray(data.events)) {
      return upsertCanonicalEvents(ss, data.events);
    }

    // Legacy flat-event append — converts to canonical on the fly
    if (data.action === "append_events" && Array.isArray(data.events)) {
      return appendLegacyEvents(ss, data.events);
    }

    // User form submission → Submissions tab
    return addSubmission(ss, data);

  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}


// ── Upsert canonical events ──────────────────────────────────────────────────
function upsertCanonicalEvents(ss, events) {
  var sheet = getOrCreateSheet(ss, "Events", [
    "id", "name", "venue", "district", "cat", "cat2",
    "recurrence", "days", "startDate", "endDate",
    "desc", "tickets", "free", "confirmed", "source"
  ]);

  // Build dedup set from existing rows
  var existing   = sheet.getDataRange().getValues();
  var existingIds = new Set();
  if (existing.length > 1) {
    var hdrs    = existing[0].map(function(h){ return h.toString().trim().toLowerCase(); });
    var idCol   = hdrs.indexOf("id");
    var nameCol = hdrs.indexOf("name");
    var venCol  = hdrs.indexOf("venue");
    for (var i = 1; i < existing.length; i++) {
      if (idCol   >= 0) existingIds.add(String(existing[i][idCol]).toLowerCase());
      if (nameCol >= 0 && venCol >= 0) {
        existingIds.add(normKey(existing[i][nameCol]) + "|" + venShort(existing[i][venCol]));
      }
    }
  }

  var inserted = 0;
  for (var j = 0; j < events.length; j++) {
    var ev    = events[j];
    var evId  = (ev.id || "").toLowerCase();
    var evKey = normKey(ev.name) + "|" + venShort(ev.venue);

    if (existingIds.has(evId) || existingIds.has(evKey)) continue;

    sheet.appendRow([
      ev.id         || "",
      ev.name       || "",
      ev.venue      || "",
      ev.district   || "",
      ev.cat        || "",
      ev.cat2       || "",
      ev.recurrence || "none",
      Array.isArray(ev.days) ? ev.days.join(",") : (ev.days || ""),
      ev.startDate  || ev.date || "",
      ev.endDate    || ev.date || "",
      ev.desc       || "",
      ev.tickets    || "",
      ev.free       ? "TRUE" : "FALSE",
      ev.confirmed  ? "TRUE" : "FALSE",
      ev.source     || ""
    ]);

    existingIds.add(evId);
    existingIds.add(evKey);
    inserted++;
  }

  return jsonResponse({ status: "ok", inserted: inserted, skipped: events.length - inserted });
}


// ── Legacy flat-event append (backward compat) ───────────────────────────────
function appendLegacyEvents(ss, events) {
  var canonical = events.map(function(ev) {
    return {
      id:         makeId(ev.name, ev.venue),
      name:       ev.name       || "",
      venue:      ev.venue      || "",
      district:   ev.district   || "",
      cat:        ev.cat        || "",
      cat2:       ev.cat2       || "",
      recurrence: "none",
      days:       [],
      startDate:  ev.date       || "",
      endDate:    ev.date       || "",
      desc:       ev.desc       || "",
      tickets:    ev.tickets    || "",
      free:       !!ev.free,
      confirmed:  !!ev.confirmed,
      source:     ev.source     || ""
    };
  });
  return upsertCanonicalEvents(ss, canonical);
}


// ── User form submission ──────────────────────────────────────────────────────
function addSubmission(ss, data) {
  var sheet = getOrCreateSheet(ss, "Submissions", [
    "timestamp", "type", "name", "venue", "date", "category", "district",
    "url", "description", "contact", "hhTime", "hhDays", "patio", "rooftop",
    "recurFreq", "status"
  ]);

  sheet.appendRow([
    data.submittedAt || new Date().toISOString(),
    data.type        || "event",
    data.name        || "",
    data.venue       || "",
    data.date        || "",
    data.category    || "",
    data.district    || "",
    data.url         || "",
    data.description || "",
    data.contact     || "",
    data.hhTime      || "",
    Array.isArray(data.hhDays) ? data.hhDays.join(",") : "",
    data.patio   ? "TRUE" : "FALSE",
    data.rooftop ? "TRUE" : "FALSE",
    data.recurFreq || "",
    "Pending"
  ]);

  return jsonResponse({ status: "ok" });
}


// ── GET handler ───────────────────────────────────────────────────────────────
function doGet(e) {
  var action = (e.parameter.action || "").toLowerCase();
  var ss     = SpreadsheetApp.getActiveSpreadsheet();

  try {
    if (action === "events")     return jsonResponse(sheetToJSON(ss, "Events"));
    if (action === "happyhours") return jsonResponse(sheetToJSON(ss, "Happy Hours"));
    if (action === "approved")   return jsonResponse(getApprovedSubmissions(ss));

    return jsonResponse({
      status: "ok",
      tabs:   ss.getSheets().map(function(s){ return s.getName(); }),
      help:   "Use ?action=events | ?action=happyhours | ?action=approved"
    });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}


// ── Helpers ───────────────────────────────────────────────────────────────────

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function normKey(s) {
  return (s || "").toString().toLowerCase().trim().replace(/\s+/g, " ").substring(0, 80);
}

function venShort(v) {
  return normKey((v || "").split(",")[0]);
}

function makeId(name, venue) {
  return (normKey(name) + "-" + venShort(venue))
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").substring(0, 60);
}

function sheetToJSON(ss, tabName) {
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  var headers = data[0].map(function(h){ return h.toString().trim().toLowerCase(); });
  var rows    = [];

  for (var i = 1; i < data.length; i++) {
    var row = {};
    var hasData = false;

    for (var j = 0; j < headers.length; j++) {
      var val = data[i][j];
      if (val !== "" && val !== null && val !== undefined) hasData = true;

      if (val instanceof Date) {
        val = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
      }
      if (typeof val === "string") {
        if (val.toUpperCase() === "TRUE")       val = true;
        else if (val.toUpperCase() === "FALSE") val = false;
      }
      row[headers[j]] = val;
    }
    if (hasData) rows.push(row);
  }
  return rows;
}

function getApprovedSubmissions(ss) {
  var sheet = ss.getSheetByName("Submissions");
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  var headers   = data[0].map(function(h){ return h.toString().trim().toLowerCase(); });
  var statusCol = headers.indexOf("status");
  if (statusCol === -1) return [];

  var results = [];
  for (var i = 1; i < data.length; i++) {
    var status = (data[i][statusCol] || "").toString().trim().toLowerCase();
    if (status !== "approved") continue;
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      var val = data[i][j];
      if (val instanceof Date) {
        val = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
      }
      row[headers[j]] = val;
    }
    results.push(row);
  }
  return results;
}
