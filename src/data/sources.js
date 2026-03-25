// Get today's date in a standardized format for dynamic reference
const getTodayStr = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

export const SOURCES = {
  plaza: {
    label: "Plaza District",
    system: `events in Plaza District, Oklahoma City from ${getTodayStr()} onwards`
  },
  paseo: {
    label: "Paseo Arts District",
    system: `events in Paseo Arts District, Oklahoma City from ${getTodayStr()} onwards`
  },
  visitokc: {
    label: "Visit OKC",
    system: `events in Oklahoma City from ${getTodayStr()} onwards`
  },
  concerts: {
    label: "Concerts & Music",
    system: `music concerts and live music events in Oklahoma City from ${getTodayStr()} onwards`
  },
  library: {
    label: "OKC Public Library",
    system: `library events and programs in Oklahoma City from ${getTodayStr()} onwards`
  },
  science: {
    label: "Science Museum",
    system: `events at the Science Museum Oklahoma from ${getTodayStr()} onwards`
  },
  free: {
    label: "Free Events",
    system: `free events in Oklahoma City from ${getTodayStr()} onwards`
  },
  family: {
    label: "Family Events",
    system: `family-friendly events in Oklahoma City from ${getTodayStr()} onwards`
  },
  galas: {
    label: "Galas & Fundraisers",
    system: `galas, fundraisers, and formal events in Oklahoma City from ${getTodayStr()} onwards`
  },
  tulsa: {
    label: "Tulsa Events",
    system: `events in Tulsa, Oklahoma from ${getTodayStr()} onwards`
  },
  paycom: {
    label: "Paycom Center",
    system: `events at Paycom Center in Oklahoma City from ${getTodayStr()} onwards`
  },
  yale: {
    label: "Yale Park",
    system: `events at Yale Park in Oklahoma City from ${getTodayStr()} onwards`
  },
  allied: {
    label: "Allied Arts",
    system: `events hosted by Allied Arts Oklahoma from ${getTodayStr()} onwards`
  },
  okgazette: {
    label: "OKC Gazette",
    system: `event listings and announcements from ${getTodayStr()} onwards`
  },
  downtown: {
    label: "Downtown OKC",
    system: `events in Downtown Oklahoma City from ${getTodayStr()} onwards`
  },
  surlatable: {
    label: "Sur La Table",
    system: `cooking classes and food events at Sur La Table in Oklahoma City from ${getTodayStr()} onwards`
  },
  running: {
    label: "Running Events",
    system: `running races, marathons, and fitness events in Oklahoma City from ${getTodayStr()} onwards`
  },
  equine: {
    label: "Equine Events",
    system: `horse shows, rodeos, and equine events in Oklahoma from ${getTodayStr()} onwards`
  },
  music_fests: {
    label: "Music Festivals",
    system: `music festivals in Oklahoma from ${getTodayStr()} onwards`
  },
  theater2: {
    label: "Theater Productions",
    system: `theater shows and performances in Oklahoma City from ${getTodayStr()} onwards`
  },
  realestate: {
    label: "Real Estate Events",
    system: `real estate and business networking events in Oklahoma City from ${getTodayStr()} onwards`
  },
  tech: {
    label: "Tech & Innovation",
    system: `technology meetups and innovation events in Oklahoma City from ${getTodayStr()} onwards`
  },
  film2: {
    label: "Film Events",
    system: `film screenings and movie events in Oklahoma City from ${getTodayStr()} onwards`
  },
  fairs: {
    label: "Fairs & Markets",
    system: `fairs, markets, and festivals in Oklahoma from ${getTodayStr()} onwards`
  },
  culture: {
    label: "Cultural Events",
    system: `cultural and heritage events in Oklahoma City from ${getTodayStr()} onwards`
  },
  civic: {
    label: "Civic & Government",
    system: `civic meetings, government events, and public forums in Oklahoma City from ${getTodayStr()} onwards`
  },
  chamber: {
    label: "Chamber of Commerce",
    system: `business and networking events from Oklahoma City Chamber of Commerce from ${getTodayStr()} onwards`
  },
  oilandgas: {
    label: "Oil & Gas Events",
    system: `oil and gas industry events in Oklahoma from ${getTodayStr()} onwards`
  },
  national: {
    label: "National Events",
    system: `major national events and attractions in Oklahoma from ${getTodayStr()} onwards`
  },
  eventbrite: {
    label: "Eventbrite",
    system: `events listed on Eventbrite nationwide from ${getTodayStr()} onwards`
  },
  eventbrite_okc: {
    label: "Eventbrite OKC",
    system: `events listed on Eventbrite for Oklahoma City from ${getTodayStr()} onwards`
  }
};

export const JSON_INSTRUCTION = "Return the results as a JSON array of event objects. Each event object must include: id (unique identifier), title (event name), date (YYYY-MM-DD format), time (HH:MM format or null if all-day), endTime (HH:MM format or null), venue (location name), address (full address), city, state, zip, category (from predefined categories), district (from predefined OKC districts if applicable), description (brief summary), url (source link if available), isFree (boolean), imageUrl (event image if available), and source (the source it came from). Ensure all dates are valid and properly formatted.";

export const getJsonInstruction = () => {
  return JSON_INSTRUCTION;
};
