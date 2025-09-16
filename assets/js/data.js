(function () {
  const SETTINGS_KEY = "hire30a-settings";
  const JOBS_KEY = "hire30a-aggregated";
  const SEEKER_KEY = "hire30a-profiles-seekers";
  const EMPLOYER_KEY = "hire30a-profiles-employers";
  const AGGREGATOR_KEY = "hire30a-aggregator-config";
  const ADMIN_PASS_KEY = "hire30a-admin-pass-hash";
  const NEWSLETTER_KEY = "hire30a-newsletter";

  const defaultSettings = {
    primaryColor: "#0096a1",
    secondaryColor: "#7ed4d4",
    accentColor: "#ff7a59",
    heroHeading: "Hire30A unites Gulf Coast hospitality talent with thriving coastal businesses.",
    heroLead:
      "From the sugar-white shores of Santa Rosa Beach to Destin and Panama City Beach, we make it effortless to surface real jobs, spotlight resumes, and build the Emerald Coast's go-to hiring hub.",
  };

  const defaultPassHash = "e579078df79a831062d561423af22697ba6021282437513c00b504ae7c2fd159"; // GulfAccess2024!

  const aggregatorDefaults = {
    query: "hospitality",
    location: "Santa Rosa Beach, FL",
    radiusMiles: 35,
    maxResults: 40,
    includeSources: {
      jsearch: true,
      sowal: true,
      manual: false,
    },
    jsearchKey: "",
    jsearchHost: "jsearch.p.rapidapi.com",
    sowalFeed: "https://sowal.com/forum/forums/jobs-employment.16/index.rss",
    manualJobs: [],
    proxyEndpoint: "",
  };

  function safeParse(value, fallback) {
    if (!value) return fallback;
    try {
      return JSON.parse(value);
    } catch (error) {
      console.warn("Failed to parse stored value", error);
      return fallback;
    }
  }

  function getObject(key, fallback) {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    const parsed = safeParse(stored, null);
    if (parsed && typeof parsed === "object") {
      return { ...fallback, ...parsed };
    }
    return fallback;
  }

  function setObject(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Unable to persist ${key}`, error);
    }
  }

  function getArray(key, fallback) {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    const parsed = safeParse(stored, null);
    return Array.isArray(parsed) ? parsed : fallback;
  }

  function setArray(key, value) {
    if (!Array.isArray(value)) return;
    setObject(key, value);
  }

  function getSettings() {
    return getObject(SETTINGS_KEY, defaultSettings);
  }

  function saveSettings(settings) {
    const next = { ...defaultSettings, ...settings };
    setObject(SETTINGS_KEY, next);
    return next;
  }

  function applyBrandSettings(settings) {
    if (!document.documentElement) return;
    const root = document.documentElement;
    root.style.setProperty("--brand-emerald", settings.primaryColor || defaultSettings.primaryColor);
    root.style.setProperty("--brand-seafoam", settings.secondaryColor || defaultSettings.secondaryColor);
    root.style.setProperty("--brand-coral", settings.accentColor || defaultSettings.accentColor);
  }

  function getJobState() {
    return getObject(JOBS_KEY, { jobs: [], updatedAt: null, sourceSummary: {} });
  }

  function saveJobState(state) {
    const payload = {
      jobs: Array.isArray(state.jobs) ? state.jobs : [],
      updatedAt: state.updatedAt || null,
      sourceSummary: state.sourceSummary || {},
    };
    setObject(JOBS_KEY, payload);
    return payload;
  }

  function getJobs() {
    return getJobState().jobs || [];
  }

  function saveJobs(jobs, meta = {}) {
    const updated = saveJobState({
      jobs,
      updatedAt: meta.updatedAt || new Date().toISOString(),
      sourceSummary: meta.sourceSummary || {},
    });
    return updated;
  }

  function clearJobs() {
    saveJobState({ jobs: [], updatedAt: null, sourceSummary: {} });
  }

  function getProfiles(type) {
    if (type === "employer") {
      return getArray(EMPLOYER_KEY, []);
    }
    return getArray(SEEKER_KEY, []);
  }

  function saveProfiles(type, profiles) {
    if (type === "employer") {
      setArray(EMPLOYER_KEY, profiles);
      return;
    }
    setArray(SEEKER_KEY, profiles);
  }

  function addProfile(type, profile) {
    const current = getProfiles(type);
    const withId = profile.id ? profile : { ...profile, id: `${type}-${Date.now()}` };
    const next = [withId, ...current.filter((item) => item.id !== withId.id)];
    saveProfiles(type, next);
    return withId;
  }

  function removeProfile(type, id) {
    const current = getProfiles(type);
    const next = current.filter((item) => item.id !== id);
    saveProfiles(type, next);
    return next;
  }

  function clearProfiles(type) {
    saveProfiles(type, []);
  }

  function getAggregatorConfig() {
    const stored = getObject(AGGREGATOR_KEY, aggregatorDefaults);
    return {
      ...aggregatorDefaults,
      ...stored,
      includeSources: {
        ...aggregatorDefaults.includeSources,
        ...(stored && stored.includeSources),
      },
    };
  }

  function saveAggregatorConfig(config) {
    const current = getAggregatorConfig();
    const next = {
      ...current,
      ...config,
      includeSources: {
        ...current.includeSources,
        ...(config && config.includeSources),
      },
    };
    setObject(AGGREGATOR_KEY, next);
    return next;
  }

  function normalizeString(value) {
    return (value || "")
      .toString()
      .trim()
      .replace(/\s+/g, " ");
  }

  function parseSkills(value) {
    if (!value) return [];
    return value
      .split(",")
      .map((skill) => normalizeString(skill))
      .filter(Boolean);
  }

  function toISO(dateLike) {
    if (!dateLike) return null;
    const date = typeof dateLike === "number" ? new Date(dateLike * 1000) : new Date(dateLike);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString();
  }

  function detectArea(location = "") {
    const text = (location || "").toLowerCase();
    if (/destin|miramar/.test(text)) return "Destin";
    if (/panama\s*city/.test(text)) return "Panama City Beach";
    if (/30a|santa\s*rosa|grayton|watercolor|seaside|aly[s]?|rosemary|blue\s*mountain/.test(text)) {
      return "Santa Rosa Beach";
    }
    if (/freeport|niceville/.test(text)) return "Freeport / Niceville";
    return "Emerald Coast";
  }

  function dedupeJobs(jobs) {
    const seen = new Map();
    jobs.forEach((job) => {
      if (!job) return;
      const rawKey = job.url && job.url.length ? job.url : `${job.title || ""}|${job.company || ""}|${job.location || ""}`;
      const normalizedKey = rawKey.toLowerCase();
      if (!seen.has(normalizedKey)) {
        seen.set(normalizedKey, job);
      }
    });
    return Array.from(seen.values());
  }

  async function fetchJSearch(config, signal) {
    if (!config.jsearchKey || !config.includeSources?.jsearch) {
      return [];
    }
    const encodedQuery = encodeURIComponent(`${config.query} in ${config.location}`.trim());
    const maxPages = Math.max(1, Math.min(Math.ceil((config.maxResults || 20) / 10), 5));
    const results = [];
    for (let page = 1; page <= maxPages; page += 1) {
      const url = `https://${config.jsearchHost || "jsearch.p.rapidapi.com"}/search?query=${encodedQuery}&page=${page}&num_pages=1&radius=${config.radiusMiles || 35}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          signal,
          headers: {
            "X-RapidAPI-Key": config.jsearchKey,
            "X-RapidAPI-Host": config.jsearchHost || "jsearch.p.rapidapi.com",
          },
        });
        if (!response.ok) {
          console.warn("JSearch request failed", response.status, response.statusText);
          break;
        }
        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : [];
        data.forEach((item) => {
          const city = item.job_city || item.job_state || "";
          const location = [item.job_city, item.job_state].filter(Boolean).join(", ");
          const description = normalizeString(item.job_description || "");
          results.push({
            id: `jsearch-${item.job_id || `${page}-${results.length}`}`,
            title: item.job_title || "Untitled role",
            company: item.employer_name || "Confidential employer",
            location: location || item.job_country || config.location,
            city,
            category: item.job_category || inferCategoryFromTitle(item.job_title),
            schedule: item.job_employment_type || "",
            description,
            url: resolveApplyUrl(item),
            source: item.job_publisher || "LinkedIn / Indeed",
            postedAt: toISO(item.job_posted_at_timestamp || item.job_posted_at_datetime_utc),
            area: detectArea(location || item.job_city || ""),
          });
        });
        if (results.length >= (config.maxResults || 40)) {
          break;
        }
      } catch (error) {
        console.warn("Unable to reach JSearch", error);
        break;
      }
    }
    return results;
  }

  function inferCategoryFromTitle(title = "") {
    const text = title.toLowerCase();
    if (/chef|cook|culinary|kitchen/.test(text)) return "Food & Beverage";
    if (/server|bartender|barista|bar|mixologist/.test(text)) return "Food & Beverage";
    if (/front desk|concierge|housekeeper|bell|guest service|reservation/.test(text)) return "Hotel & Resort";
    if (/vacation|rental|property manager/.test(text)) return "Vacation Rentals";
    if (/event|banquet|wedding|catering/.test(text)) return "Events & Weddings";
    if (/spa|fitness|retail|boutique/.test(text)) return "Retail & Wellness";
    return "Hospitality";
  }

  function resolveApplyUrl(item = {}) {
    if (item.job_apply_is_direct && item.job_apply_link) {
      return item.job_apply_link;
    }
    if (Array.isArray(item.job_apply_links) && item.job_apply_links.length) {
      return item.job_apply_links[0];
    }
    if (item.job_apply_link) {
      return item.job_apply_link;
    }
    if (item.job_apply_url) {
      return item.job_apply_url;
    }
    if (item.job_apply_link && typeof item.job_apply_link === "object") {
      return String(item.job_apply_link);
    }
    return "";
  }

  async function fetchSoWal(config, signal) {
    if (!config.includeSources?.sowal || !config.sowalFeed) {
      return [];
    }
    try {
      const response = await fetch(config.sowalFeed, { signal });
      if (!response.ok) {
        console.warn("SoWal feed unavailable", response.status);
        return [];
      }
      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "text/xml");
      const items = Array.from(xml.querySelectorAll("item"));
      return items.map((item, index) => {
        const title = normalizeString(item.querySelector("title")?.textContent || "SoWal job");
        const link = normalizeString(item.querySelector("link")?.textContent);
        const description = normalizeString(item.querySelector("description")?.textContent || "");
        const pubDate = normalizeString(item.querySelector("pubDate")?.textContent || "");
        return {
          id: `sowal-${index}-${link}`,
          title,
          company: "SoWal Community Listing",
          location: "Santa Rosa Beach, FL",
          city: "Santa Rosa Beach",
          category: inferCategoryFromTitle(title),
          schedule: "",
          description,
          url: link,
          source: "SoWal",
          postedAt: toISO(pubDate),
          area: "Santa Rosa Beach",
        };
      });
    } catch (error) {
      console.warn("Unable to fetch SoWal feed", error);
      return [];
    }
  }

  async function fetchProxy(config, signal) {
    if (!config.proxyEndpoint) return [];
    try {
      const response = await fetch(config.proxyEndpoint, { signal });
      if (!response.ok) {
        console.warn("Proxy endpoint error", response.status);
        return [];
      }
      const payload = await response.json();
      const jobs = Array.isArray(payload?.jobs) ? payload.jobs : [];
      return jobs.map((job, index) => ({
        id: job.id || `proxy-${index}`,
        title: job.title || "Untitled role",
        company: job.company || "Partner",
        location: job.location || config.location,
        city: job.city || "",
        category: job.category || inferCategoryFromTitle(job.title),
        schedule: job.schedule || "",
        description: normalizeString(job.description || ""),
        url: job.url || job.applyUrl || "",
        source: job.source || "Proxy",
        postedAt: toISO(job.postedAt || job.posted || job.posted_at),
        area: detectArea(job.location || job.city || ""),
      }));
    } catch (error) {
      console.warn("Proxy fetch failed", error);
      return [];
    }
  }

  async function fetchAggregatedJobs(config = {}, options = {}) {
    const controller = options.signal ? null : new AbortController();
    const signal = options.signal || controller?.signal;
    const effectiveConfig = {
      ...aggregatorDefaults,
      ...config,
      includeSources: {
        ...aggregatorDefaults.includeSources,
        ...(config && config.includeSources),
      },
    };
    const results = [];
    const summaries = {};

    const [jsearch, sowal, proxy] = await Promise.all([
      fetchJSearch(effectiveConfig, signal),
      fetchSoWal(effectiveConfig, signal),
      fetchProxy(effectiveConfig, signal),
    ]);

    if (jsearch.length) {
      summaries["LinkedIn / Indeed"] = jsearch.length;
      results.push(...jsearch);
    }
    if (sowal.length) {
      summaries["SoWal"] = sowal.length;
      results.push(...sowal);
    }
    if (proxy.length) {
      summaries["Proxy"] = proxy.length;
      results.push(...proxy);
    }

    if (effectiveConfig.includeSources?.manual && Array.isArray(effectiveConfig.manualJobs) && effectiveConfig.manualJobs.length) {
      const manual = effectiveConfig.manualJobs.map((job, index) => ({
        id: job.id || `manual-${index}`,
        title: job.title || "Untitled role",
        company: job.company || "Local partner",
        location: job.location || effectiveConfig.location,
        city: job.city || "",
        category: job.category || inferCategoryFromTitle(job.title || ""),
        schedule: job.schedule || "",
        description: normalizeString(job.description || ""),
        url: job.url || job.applyUrl || "",
        source: job.source || "Manual",
        postedAt: toISO(job.postedAt || job.posted || new Date().toISOString()),
        area: detectArea(job.location || job.city || ""),
      }));
      summaries.Manual = manual.length;
      results.push(...manual);
    }

    const deduped = dedupeJobs(results).map((job) => ({
      ...job,
      area: job.area || detectArea(job.location || job.city || ""),
    }));

    const sorted = deduped.sort((a, b) => {
      const timeA = a.postedAt ? new Date(a.postedAt).getTime() : 0;
      const timeB = b.postedAt ? new Date(b.postedAt).getTime() : 0;
      return timeB - timeA;
    });

    const state = saveJobs(sorted, {
      updatedAt: new Date().toISOString(),
      sourceSummary: summaries,
    });

    return state;
  }

  function getAdminPassHash() {
    return localStorage.getItem(ADMIN_PASS_KEY) || defaultPassHash;
  }

  function setAdminPassHash(hash) {
    if (!hash) return;
    try {
      localStorage.setItem(ADMIN_PASS_KEY, hash);
    } catch (error) {
      console.warn("Unable to persist admin pass hash", error);
    }
  }

  function getNewsletterList() {
    return getArray(NEWSLETTER_KEY, []);
  }

  function saveNewsletter(email) {
    const list = getNewsletterList();
    if (!email) return list;
    if (list.includes(email)) return list;
    const next = [email, ...list];
    setArray(NEWSLETTER_KEY, next);
    return next;
  }

  function sha256(ascii) {
    const prime = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
    ];

    const words = [];
    const asciiBitLength = ascii.length * 8;
    let hash = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    let i;

    for (i = 0; i < ascii.length; i += 1) {
      const code = ascii.charCodeAt(i);
      if (code >> 8) return null;
      words[i >> 2] = words[i >> 2] || 0;
      words[i >> 2] |= code << ((3 - (i % 4)) * 8);
    }

    words[ascii.length >> 2] |= 0x80 << ((3 - (ascii.length % 4)) * 8);
    words[((asciiBitLength + 64 >> 9) << 4) + 15] = asciiBitLength;

    for (let j = 0; j < words.length; j += 16) {
      const w = words.slice(j, j + 16);
      const tempHash = hash.slice(0);

      for (i = 0; i < 64; i += 1) {
        const w15 = w[i - 15],
          w2 = w[i - 2];
        const s0 = ((w15 >>> 7) | (w15 << 25)) ^ ((w15 >>> 18) | (w15 << 14)) ^ (w15 >>> 3);
        const s1 = ((w2 >>> 17) | (w2 << 15)) ^ ((w2 >>> 19) | (w2 << 13)) ^ (w2 >>> 10);
        w[i] =
          i < 16
            ? w[i]
            : (((w[i - 16] + s0) | 0) + ((w[i - 7] + s1) | 0)) | 0;

        const ch = (tempHash[4] & tempHash[5]) ^ (~tempHash[4] & tempHash[6]);
        const maj = (tempHash[0] & tempHash[1]) ^ (tempHash[0] & tempHash[2]) ^ (tempHash[1] & tempHash[2]);
        const sigma0 = ((tempHash[0] >>> 2) | (tempHash[0] << 30)) ^ ((tempHash[0] >>> 13) | (tempHash[0] << 19)) ^
          ((tempHash[0] >>> 22) | (tempHash[0] << 10));
        const sigma1 = ((tempHash[4] >>> 6) | (tempHash[4] << 26)) ^ ((tempHash[4] >>> 11) | (tempHash[4] << 21)) ^
          ((tempHash[4] >>> 25) | (tempHash[4] << 7));

        const t1 = (tempHash[7] + sigma1 + ch + prime[i] + (w[i] | 0)) | 0;
        const t2 = (sigma0 + maj) | 0;

        tempHash[7] = tempHash[6];
        tempHash[6] = tempHash[5];
        tempHash[5] = tempHash[4];
        tempHash[4] = (tempHash[3] + t1) | 0;
        tempHash[3] = tempHash[2];
        tempHash[2] = tempHash[1];
        tempHash[1] = tempHash[0];
        tempHash[0] = (t1 + t2) | 0;
      }

      for (i = 0; i < 8; i += 1) {
        hash[i] = (hash[i] + tempHash[i]) | 0;
      }
    }

    return hash
      .map((value) => {
        const hex = (value >>> 0).toString(16);
        return ("00000000" + hex).slice(-8);
      })
      .join("");
  }

  async function hashPasscode(passcode) {
    if (!passcode) return null;
    if (window.crypto && window.crypto.subtle) {
      try {
        const encoded = new TextEncoder().encode(passcode);
        const digest = await window.crypto.subtle.digest("SHA-256", encoded);
        return Array.from(new Uint8Array(digest))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      } catch (error) {
        console.warn("Web crypto digest failed, falling back to JS implementation", error);
      }
    }
    return sha256(passcode);
  }

  async function verifyPasscode(passcode) {
    const hash = await hashPasscode(passcode || "");
    return hash === getAdminPassHash();
  }

  async function updateAdminPass(passcode) {
    const hash = await hashPasscode(passcode || "");
    if (!hash) return;
    setAdminPassHash(hash);
  }

  window.Hire30AData = {
    defaultSettings,
    aggregatorDefaults,
    getSettings,
    saveSettings,
    applyBrandSettings,
    getJobs,
    getJobState,
    saveJobs,
    clearJobs,
    getProfiles,
    addProfile,
    removeProfile,
    clearProfiles,
    saveProfiles,
    parseSkills,
    getAggregatorConfig,
    saveAggregatorConfig,
    fetchAggregatedJobs,
    detectArea,
    getAdminPassHash,
    verifyPasscode,
    updateAdminPass,
    hashPasscode,
    getNewsletterList,
    saveNewsletter,
  };
})();
