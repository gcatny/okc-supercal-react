import { getTodayStr, formatDateStr } from "./dateUtils.js";

/**
 * Check if event matches active category filters
 * @param {object} event
 * @param {Set} activeFilters - set of category strings
 */
export function catMatch(event, activeFilters) {
  if (!event || !activeFilters) return false;
  return activeFilters.has(event.cat) || !!(event.cat2 && activeFilters.has(event.cat2));
}

/**
 * Check if event passes happy hour filter logic
 * @param {object} event
 * @param {boolean} hhOn - is happy hour filter enabled
 * @param {boolean} hhPatio - filter for patio happy hours
 * @param {boolean} hhRoof - filter for rooftop happy hours
 */
export function passesHHFilter(event, hhOn, hhPatio, hhRoof) {
  if (!event) return false;
  if (event.cat !== "happyhour") return true;
  if (!hhOn) return false;
  if (hhPatio && !event.patio) return false;
  if (hhRoof && !event.rooftop) return false;
  return true;
}

/**
 * Check if event matches search query
 * @param {object} event
 * @param {string} query
 */
export function matchesSearch(event, query) {
  const q = query.toLowerCase();
  return (
    event.name?.toLowerCase().includes(q) ||
    event.venue?.toLowerCase().includes(q) ||
    event.desc?.toLowerCase().includes(q) ||
    event.cat?.toLowerCase().includes(q) ||
    event.source?.toLowerCase().includes(q)
  );
}

/**
 * Generate happy hour events for the next 90 days
 * @param {array} hhData - array of happy hour venue objects
 * @param {object} hhDistMap - map of venue names to districts
 */
export function generateHappyHourEvents(hhData, hhDistMap) {
  if (!Array.isArray(hhData)) return [];
  const events = [];
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endDate = new Date(todayStart.getTime() + 90 * 24 * 60 * 60 * 1000);
  const DOW_NAMES = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const seen = new Set();

  for (const hh of hhData) {
    if (!hh || !hh.n || !hh.v) continue; // skip malformed entries
    const name = hh.n;
    const venue = hh.v;
    const days = Array.isArray(hh.d) ? hh.d : [0, 1, 2, 3, 4]; // default Mon-Fri
    const time = hh.t || "Varies";
    const daysLabel = days.length >= 7 ? "Daily" :
      (days.length === 5 && !days.includes(5) && !days.includes(6)) ? "Mon–Fri" :
      days.map(d => DOW_NAMES[d]).join(", ");

    // Walk each day in range
    const cur = new Date(todayStart.getTime());
    while (cur <= endDate) {
      // Convert JS getDay (0=Sun) to HH format (0=Mon)
      const jsDay = cur.getDay();
      const hhDay = jsDay === 0 ? 6 : jsDay - 1;

      if (days.includes(hhDay)) {
        const dateStr = formatDateStr(cur);
        const eventKey = `${name}|${dateStr}`;

        if (!seen.has(eventKey)) {
          seen.add(eventKey);

          const dist = hhDistMap[venue] || venue || "";
          events.push({
            name,
            venue: venue + ", OKC",
            date: dateStr,
            desc: hh.desc || (name + " happy hour. " + daysLabel + " " + time),
            cat: "happyhour",
            confirmed: true,
            source: "OKC Restaurant Happy Hours",
            tickets: hh.url || null,
            free: false,
            district: dist,
            patio: !!hh.patio,
            rooftop: !!hh.rooftop
          });
        }
      }
      cur.setDate(cur.getDate() + 1);
    }
  }

  return events;
}

/**
 * Auto-assign districts to events based on venue name matching
 * Mutates the events array
 * @param {array} events
 * @param {object} districtMap - map of venue substrings to district names
 */
export function autoAssignDistricts(events, districtMap) {
  for (let event of events) {
    if (event.district) continue; // Already has district

    const venue = event.venue || "";
    for (let [key, district] of Object.entries(districtMap)) {
      if (venue.includes(key)) {
        event.district = district;
        break;
      }
    }
  }
}

/**
 * Generate a unique vote key for an event
 * @param {object} event
 */
export function voteKey(event) {
  const raw = `${event.name}_${event.date}`.toLowerCase();
  const sanitized = raw.replace(/[.#$[\]/\s]+/g, "_");
  return sanitized.substring(0, 128);
}

/**
 * Build a Google Calendar add event URL
 * @param {object} event - {name, date, venue, desc, tickets}
 */
export function buildGCalUrl(event) {
  const { name, date, venue, desc, tickets } = event;

  // Parse date YYYY-MM-DD
  const [year, month, day] = date.split("-");
  const startDate = `${year}${month}${day}`;
  const nextDay = new Date(year, parseInt(month) - 1, parseInt(day) + 1);
  const endDate = formatDateStr(nextDay).replace(/-/g, "");

  let details = desc || "";
  if (tickets) {
    details += (details ? "\n" : "") + `Tickets: ${tickets}`;
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: name,
    dates: `${startDate}/${endDate}`,
    location: venue || "",
    details: details
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
