/**
 * OKC Super Calendar â Google Apps Script
 *
 * Deploy this as a web app in Google Apps Script.
 * It handles:
 *   1. POST requests from the Submit Event form (writes to "Submissions" tab)
 *   2. GET requests from the nightly agent:
 *      - ?action=events     â returns all rows from "Events" tab as JSON
 *      - ?action=happyhours â returns all rows from "Happy Hours" tab as JSON
 *      - ?action=approved   â returns approved submissions from "Submissions" tab
 *
 * SETUP:
 *   1. Create a Google Sheet with 3 tabs: "Events", "Happy Hours", "Submissions"
 *   2. Open Extensions â Apps Script, paste this code
 *   3. Deploy â New Deployment â Web App â "Anyone" can access
 *   4. Copy the deployment URL â that's your GOOGLE_SHEET_URL
 *
 * TAB HEADERS (Row 1):
 *
 *   Events tab:
 *     name | venue | date | desc | cat | cat2 | confirmed | source | tickets | free | district
 *
 *   Happy Hours tab:
 *     name | venue | days | time | desc | url | patio | rooftop | district
 *     (days = comma-separated numbers: 0=Mon, 1=Tue, ... 6=Sun)
 *
 *   Submissions tab:
 *     timestamp | type | name | venue | date | category | district | url | description | contact |
 *     hhTime | hhDays | patio | rooftop | recurFreq | status
 *     (status column: "Pending", "Approved", "Rejected")
 */

// ââ POST: receive form submissions OR nightly agent event appends ââââââââââââ
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Handle nightly agent bulk event append
    if (data.action === "append_events" && Array.isArray(data.events)) {
      return appendEventsToSheet(ss, data.events);
    }

    // Handle user form submissions
    var sheet = ss.getSheetByName("Submissions");

    if (!sheet) {
      sheet = ss.insertSheet("Submissions");
      sheet.appendRow([
        "timestamp", "type", "name", "venue", "date", "category", "district",
        "url", "description", "contact", "hhTime", "hhDays", "patio", "rooftop",
        "recurFreq", "status"
      ]);
    }

    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.type || "event",
      data.name || "",
      data.venue || "",
      data.date || "",
      data.category || "",
      data.district || "",
      data.url || "",
      data.description || "",
      data.contact || "",
      data.hhTime || "",
      data.hhDays ? data.hhDays.join(",") : "",
      data.patio ? "TRUE" : "FALSE",
      data.rooftop ? "TRUE" : "FALSE",
      data.recurFreq || "",
      "Pending"
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "ok" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}


// ââ Append scraped events to the Events tab âââââââââââââââââââââââââââââââââ
function appendEventsToSheet(ss, events) {
  var sheet = ss.getSheetByName("Events");
  if (!sheet) {
    sheet = ss.insertSheet("Events");
    sheet.appendRow([
      "name", "venue", "date", "desc", "cat", "cat2",
      "confirmed", "source", "tickets", "free", "district"
    ]);
  }

  var count = 0;
  for (var i = 0; i < events.length; i++) {
    var ev = events[i];
    sheet.appendRow([
      ev.name || "",
      ev.venue || "",
      ev.date || "",
      ev.desc || "",
      ev.cat || "fest",
      ev.cat2 || "",
      ev.confirmed ? "TRUE" : "FALSE",
      ev.source || "",
      ev.tickets || "",
      ev.free ? "TRUE" : "FALSE",
      ev.district || ""
    ]);
    count++;
  }

  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok", appended: count })
  ).setMimeType(ContentService.MimeType.JSON);
}


// ââ GET: serve data to the nightly agent ââââââââââââââââââââââââââââââââââââ
function doGet(e) {
  var action = (e.parameter.action || "").toLowerCase();
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    if (action === "events") {
      return jsonResponse(sheetToJSON(ss, "Events"));
    }

    if (action === "happyhours") {
      return jsonResponse(sheetToJSON(ss, "Happy Hours"));
    }

    if (action === "approved") {
      return jsonResponse(getApprovedSubmissions(ss));
    }

    // Default: return a summary
    return jsonResponse({
      status: "ok",
      tabs: ss.getSheets().map(function(s) { return s.getName(); }),
      help: "Use ?action=events | ?action=happyhours | ?action=approved"
    });

  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}


// ââ Helpers âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function jsonResponse(data) {
  return ContentService.createTextOutput(
    JSON.stringify(data)
  ).setMimeType(ContentService.MimeType.JSON);
}


function sheetToJSON(ss, tabName) {
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return []; // only headers

  var headers = data[0].map(function(h) { return h.toString().trim().toLowerCase(); });
  var rows = [];

  for (var i = 1; i < data.length; i++) {
    var row = {};
    var hasData = false;
    for (var j = 0; j < headers.length; j++) {
      var val = data[i][j];
      if (val !== "" && val !== null && val !== undefined) hasData = true;

      // Convert date objects to YYYY-MM-DD strings
      if (val instanceof Date) {
        val = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
      }

      // Convert TRUE/FALSE strings to booleans
      if (typeof val === "string") {
        if (val.toUpperCase() === "TRUE") val = true;
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

  var headers = data[0].map(function(h) { return h.toString().trim().toLowerCase(); });
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
