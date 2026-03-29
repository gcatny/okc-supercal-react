/**
 * Venue-level image map for OKC Super Calendar event detail hero.
 *
 * Fallback chain in EventDetail:
 *   1. event.image      (event-specific URL scraped/set manually)
 *   2. getVenueImage()  (venue's own website photo — this file)
 *   3. CATEGORY_IMAGES  (generic category fallback)
 *   4. gradient + emoji (last resort, always works)
 *
 * Each entry has:
 *   match  — array of lowercase substrings; first match in venue name wins
 *   url    — direct image URL from the venue's own website
 *
 * To add or update a venue photo:
 *   1. Find the entry by its match keywords (or add a new one)
 *   2. Replace the url with the new image URL
 *   3. Save and upload to GitHub
 */

export const VENUE_IMAGES = [

  // ── Major Venues ────────────────────────────────────────────────────────────
  {
    match: ['remington park'],
    url: 'https://www.remingtonpark.com/wp-content/uploads/2023/03/Casino-Open-Home-1440x587-1.jpg',
  },
  {
    match: ['paycom center'],
    url: 'https://www.paycomcenter.com/assets/img/Cojo2026-1000x640-8ed6d59367.jpg',
  },
  {
    match: ['civic center music hall'],
    url: 'https://lh3.googleusercontent.com/d/178LqOKUgEICUtHJ96rCS7YALzK1Ti5KF',
  },
  {
    match: ['chickasaw bricktown ballpark', 'bricktown ballpark'],
    url: 'https://lh3.googleusercontent.com/d/14z6g3nsOBClBQpnTPGk4V_mpfDIq13xy',
  },
  {
    match: ['jones assembly'],
    url: 'https://lh3.googleusercontent.com/d/1h9L7mSYP9mbYMeVsEbYxsc9rxfhUaE6H',
  },
  {
    match: ['the criterion', 'criterion okc'],
    url: 'https://lh3.googleusercontent.com/d/16FX0BFV6M71FcgGmw8nobMYJeYo3z3jw',
  },
  {
    match: ['tower theatre'],
    url: 'https://lh3.googleusercontent.com/d/1qbfedZhFResMtP-h0rGw8iYL0pOS98xM',
  },
  {
    match: ['zoo amphitheatre', 'zoo amp'],
    url: 'https://lh3.googleusercontent.com/d/14zvHcbj6FTabqropXPBrS2Aos4a2Nf-M',
  },
  {
    match: ['beer city music hall'],
    url: 'https://lh3.googleusercontent.com/d/19vIbF-EYjce00kMjONMYZhX_0m7z090G',
  },
  {
    match: ['diamond ballroom'],
    url: 'https://lh3.googleusercontent.com/d/1zE9tSUJNOh4rUQdopMPnj71AksNnDODS',
  },
  {
    match: ['89th street'],
    url: 'https://lh3.googleusercontent.com/d/1aA_ZpB4-aKKau_4wk1B3bfYaqVRE42h3',
  },
  {
    match: ['resonant head'],
    url: 'https://images.squarespace-cdn.com/content/v1/6400d250090aa10a6a2b6893/7155a729-713b-4a6d-9bf5-ea86fb1bc216/ma02431-R1-29-30.jpg',
  },
  {
    match: ['the blue door', 'blue door okc'],
    url: 'https://static.wixstatic.com/media/9cc369_7dddfae75f6c4f4bb313983ef1f77e3e~mv2.jpg/v1/fill/w_800,h_436,al_c,q_80,enc_avif,quality_auto/9cc369_7dddfae75f6c4f4bb313983ef1f77e3e~mv2.jpg',
  },
  {
    match: ['wormy dog'],
    url: 'https://lh3.googleusercontent.com/d/10vUWDqycLC519J6gn9rmwUkqz1RCjowt',
  },
  {
    match: ['ponyboy'],
    url: 'https://lh3.googleusercontent.com/d/12b99vzUrIV2t4bawK_LDg8_UL5iWKBwH',
  },

  // ── Arts & Culture ──────────────────────────────────────────────────────────
  {
    match: ['oklahoma contemporary'],
    url: 'https://oklahomacontemporary.org/wp-content/uploads/2026/01/BI0A9696-Web-res.jpg',
  },
  {
    match: ['oklahoma city museum of art', 'okcmoa'],
    url: 'https://www.okcmoa.com/wp-content/uploads/2025/02/WordPress-Image-2-1920x625.jpg',
  },
  {
    match: ['the yale theater', 'yale theater', 'yale theatre'],
    url: 'https://images.squarespace-cdn.com/content/v1/5e1f713a7a49f85384297a75/cee6f0b5-fa2d-4381-83f4-4bc064b28cf0/Margo+%26+Adam+-+The+Yale27.jpg',
  },
  {
    match: ['lyric theatre', 'lyric at the plaza'],
    url: 'https://lh3.googleusercontent.com/d/10ZCFWjNMhh-3LNgrL9hz1OtP7WG67IsI',
  },
  {
    match: ['first americans museum'],
    url: 'https://lh3.googleusercontent.com/d/1CGgXBKZD1nY6v_EP37UEoIR52hkJt_S7',
  },
  {
    match: ['oklahoma history center'],
    url: 'https://lh3.googleusercontent.com/d/13Eiyt5zgya9HjQuF_Erk71bszKUSlYdz',
  },

  // ── Comedy ──────────────────────────────────────────────────────────────────
  {
    match: ['bricktown comedy club'],
    url: 'https://lh3.googleusercontent.com/d/1Xu7ezvlRMN8lEUi4evxe8ZBDuXfbU334',
  },
  {
    match: ['okc improv'],
    url: 'https://lh3.googleusercontent.com/d/1KQaqwym2IJ_KByWTwGI-Y8ct0-rGCoEe',
  },

  // ── Parks & Outdoor ─────────────────────────────────────────────────────────
  {
    match: ['scissortail park'],
    url: 'https://lh3.googleusercontent.com/d/1lvgXEaam0Il4oE7xXHGXnXtZ3lxK3vEJ',
  },
  {
    match: ['myriad botanical', 'myriad gardens'],
    url: 'https://myriadgardens.org/wp-content/uploads/Tulip-Fest-Cover-768x432.jpg',
  },
  {
    match: ['oak heartwood', 'oakokc', 'classen curve'],
    url: 'https://lh3.googleusercontent.com/d/1HQEwbx5Jx7fNpXgE5nD8RdjjQPY8wdso',
  },
  {
    match: ['riversport'],
    url: 'https://www.riversportokc.org/wp-content/uploads/2025/03/2000x800_Rafting.jpg',
  },

  // ── Attractions & Resorts ───────────────────────────────────────────────────
  {
    match: ['okana resort'],
    url: 'https://www.okanaresort.com/site/assets/files/51391/oka-20260106-nofees_webheader.png',
  },
  {
    match: ['oklahoma city zoo', 'okc zoo'],
    url: 'https://lh3.googleusercontent.com/d/1_8YZNKui8JAIbZmShDSfqw0mzFosplfT',
  },
  {
    match: ['science museum oklahoma', 'science museum ok'],
    url: 'https://lh3.googleusercontent.com/d/1jLkrTHl8Q9YRu2ja9ziUfXnGaAhyinXb',
  },

  // ── Dining & Hotels ─────────────────────────────────────────────────────────
  {
    match: ['the national'],
    url: 'https://www.thenationalokc.com/resourcefiles/homeimages/great-hall-the-national-hotel-downtown-okc.png?version=3062026231823',
  },
  {
    match: ['sur la table'],
    url: 'https://lh3.googleusercontent.com/d/14xnDtT3UCXKCvmQTST8KrTZVtAKSyZAn',
  },

  // ── Districts ───────────────────────────────────────────────────────────────
  {
    match: ['plaza district'],
    url: 'https://images.squarespace-cdn.com/content/v1/63d2b9a26c7f5d04894e2580/041c32d0-acab-48d8-a0d2-0900511b6103/1ED08C8C-D069-42C9-9444-B310C447C6AE_1_105_c.jpeg',
  },
  {
    match: ['paseo arts district', 'the paseo'],
    url: 'https://lh3.googleusercontent.com/d/1afAvEPjkS9gRG_HqwIJs4MTUZdQz8fKW',
  },

  // ── Nonprofit & Community ───────────────────────────────────────────────────
  {
    match: ['regional food bank'],
    url: 'https://lh3.googleusercontent.com/d/1lEN2lpkWQjhyrQ2Wa0rB9jY4gjvxPTjT',
  },
  {
    match: ['habitat for humanity', 'helpmyhabitat'],
    url: 'https://s3.amazonaws.com/files.galaxydigital.com/5695/images/rotator-edad1.jpg',
  },
  {
    match: ['oklahoma humane', 'okhumane'],
    url: 'https://okhumane.org/wp-content/uploads/2026/01/Poochella-2026-Web-Block-1.png',
  },
  {
    match: ['okc beautiful'],
    url: 'https://static.wixstatic.com/media/f08d09_d759651c9e4c4f438635631e57e09bd0~mv2.jpg/v1/fill/w_2286,h_1346,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/f08d09_d759651c9e4c4f438635631e57e09bd0~mv2.jpg',
  },

  // ── Sports & Recreation ─────────────────────────────────────────────────────
  {
    match: ['lazy e arena'],
    url: 'https://lazye.com/wp-content/uploads/2021/11/LazE-1354X938.jpg',
  },

  // ── Tulsa ───────────────────────────────────────────────────────────────────
  {
    match: ["cain's ballroom", 'cains ballroom'],
    url: 'https://lh3.googleusercontent.com/d/1dxs7_f8Jlj_uAZmxnyLvWoM_Kejp7dsM',
  },
];

/**
 * Returns the best venue image URL for a given venue name string,
 * or null if no match is found.
 */
export function getVenueImage(venueName) {
  if (!venueName) return null;
  const lower = venueName.toLowerCase();
  for (const entry of VENUE_IMAGES) {
    if (entry.url && entry.match.some(k => lower.includes(k))) {
      return entry.url;
    }
  }
  return null;
}
