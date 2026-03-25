import { getTodayStr, formatDateStr } from "./dateUtils.js";

/**
 * Check if event matches active category filters
 * @param {object} event
 * @param {Set} activeFilters - set of category strings
 */
export function catMatch(event, activeFilters) {
  return activeFilters.has(event.cat) || activeFilters.has(event.cat2);
}

/**
 * Check if event passes happy hour filter logic
 * @param {object} event
 * @param {boolean} hhOn - is happy hour filter enabled
 * @param {boolean} hhPatio - filter for patio happy hours
 * @param {boolean} hhRoof - filter for rooftop happy hours
 */
export function passesHHFilter(event, hhOn, hhPatio, hhRoof) {
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
  const events = [];
  const today = new Date();
  const endDate = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);

  const seen = new Set();

  for (let hhVenue of hhData) {
    const { n: name, v: venue, d: days, t: time, desc, url, patio, rooftop } =
      hhVenue;

    // Iterate through each day in the 90-day range
    for (
      let current = new Date(today);
      current < endDate;
      current.setDate(current.getDate() + 1)
    ) {
      // JS getDay: 0=Sun, 1=Mon, ..., 6=Sat
      // HH format: 0=Mon, 1=Tue, ..., 6=Sun
      const jsDay = current.getDay();
      const hhDay = jsDay === 0 ? 6 : jsDay - 1;

      // Check if this day matches the HH venue's days array
      if (!days.includes(hhDay)) continue;

      const dateStr = formatDateStr(new Date(current));
      const eventKey = `${name}|${dateStr}`;

      // Deduplicate
      if (seen.has(eventKey)) continue;
      seen.add(eventKey);

      const event = {
        name,
        venue,
        date: dateStr,
        desc,
        cat: "happyhour",
        confirmed: true,
        source: "OKC Restaurant Happy Hours",
        tickets: url ? url : undefined,
        free: false,
        patio,
        rooftop
      };

      // Auto-assign district
      const district = hhDistMap[venue];
      if (district) {
        event.district = district;
      }

      events.push(event);
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
