(function () {
  const memoryStore = {};

  const storage = (() => {
    try {
      const testKey = "hire30a__test";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    } catch (error) {
      console.warn("Hire30A: localStorage unavailable, falling back to memory store.");
      return null;
    }
  })();

  const KEYS = {
    settings: "hire30a.settings",
    jobs: "hire30a.jobs",
    talent: "hire30a.talent",
    employers: "hire30a.employers",
    newsletter: "hire30a.newsletter",
  };

  const FLAGS = {
    seeded: "hire30a.seed.v1",
  };

  const defaultSettings = {
    primaryColor: "#0f7b88",
    accentColor: "#f4a261",
    heroHeading: "Hire30A is building the locals-first hospitality hiring hub.",
    heroSubheading:
      "We are uniting Santa Rosa Beach, Destin, and Panama City Beach service pros with the businesses that power the Gulf Coast experience.",
  };

  const sampleJobs = [
    {
      id: "sample-job-1",
      sample: true,
      title: "Beachside Bar Lead",
      company: "Coral Dunes Resort",
      area: "Santa Rosa Beach & Scenic 30A",
      category: "Food & Beverage",
      type: "Full-time",
      posted: "2024-04-08",
      description:
        "Guide a team of bartenders at a boutique beachfront hotel with a focus on crafted cocktails and guest delight.",
    },
    {
      id: "sample-job-2",
      sample: true,
      title: "Guest Experience Coordinator",
      company: "Harbor Walk Suites",
      area: "Destin & Miramar Beach",
      category: "Hotel & Resort",
      type: "Seasonal",
      posted: "2024-04-05",
      description:
        "Coordinate arrivals, activities, and surprise-and-delight touches for vacationing families along the harbor.",
    },
    {
      id: "sample-job-3",
      sample: true,
      title: "Event Setup Crew",
      company: "Sunset Ceremonies 30A",
      area: "Panama City Beach & 30E",
      category: "Events & Weddings",
      type: "Part-time",
      posted: "2024-04-02",
      description:
        "Support weekend weddings with beach-friendly setup, décor placement, and VIP guest assistance.",
    },
  ];

  const sampleTalent = [
    {
      id: "sample-talent-1",
      sample: true,
      name: "Maya Thompson",
      headline: "Mixologist & Beverage Trainer",
      location: "Santa Rosa Beach",
      focus: "Craft cocktails, coastal resort service",
      highlights: ["BarSmarts Certified", "Mentors seasonal teams", "Open to evenings"],
    },
    {
      id: "sample-talent-2",
      sample: true,
      name: "Zachary Kim",
      headline: "Front Desk Concierge",
      location: "Destin",
      focus: "Concierge desk + itinerary design",
      highlights: ["Fluent in Spanish", "Hospitality management graduate", "Available full-time"],
    },
  ];

  const sampleEmployers = [
    {
      id: "sample-employer-1",
      sample: true,
      name: "Seagrass Collective",
      tagline: "Coastal café & catering studio",
      location: "Blue Mountain Beach",
      focus: "Hiring pastry artists, café leads, and event servers",
      perks: ["Locals-first hiring", "Seasonal menu workshops", "Shift meals included"],
    },
    {
      id: "sample-employer-2",
      sample: true,
      name: "Emerald View Vacations",
      tagline: "Boutique vacation rental management",
      location: "Panama City Beach",
      focus: "Guest services, housekeeping leads, maintenance pros",
      perks: ["Housing stipends", "401(k) with match", "Beach gear partnerships"],
    },
  ];

  const sampleSignals = [
    "Preview: Partner cafés across 30A are preparing spring openings.",
    "Preview: Resorts in Destin are staffing up concierge teams for summer.",
    "Preview: Wedding season requests weekend setup crews and planners.",
    "Preview: Employers are ready to spotlight culture-rich hospitality roles.",
  ];

  function readRaw(key) {
    if (storage) {
      return storage.getItem(key);
    }
    return Object.prototype.hasOwnProperty.call(memoryStore, key)
      ? memoryStore[key]
      : null;
  }

  function writeRaw(key, value) {
    if (storage) {
      storage.setItem(key, value);
    } else {
      memoryStore[key] = value;
    }
  }

  function read(key, fallback) {
    const raw = readRaw(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn(`Hire30A: failed to parse ${key}`, error);
      return fallback;
    }
  }

  function write(key, value) {
    try {
      writeRaw(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Hire30A: unable to persist ${key}`, error);
    }
  }

  function readFlag(key) {
    const raw = readRaw(key);
    return raw === "true";
  }

  function setFlag(key, value) {
    writeRaw(key, value ? "true" : "false");
  }

  function ensureSeeded() {
    if (readFlag(FLAGS.seeded)) return;

    if (read(KEYS.settings, null) === null) {
      write(KEYS.settings, defaultSettings);
    }
    if (read(KEYS.jobs, null) === null) {
      write(KEYS.jobs, []);
    }
    if (read(KEYS.talent, null) === null) {
      write(KEYS.talent, []);
    }
    if (read(KEYS.employers, null) === null) {
      write(KEYS.employers, []);
    }
    if (read(KEYS.newsletter, null) === null) {
      write(KEYS.newsletter, []);
    }

    setFlag(FLAGS.seeded, true);
  }

  ensureSeeded();

  function createId(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  }

  function toArray(value) {
    return Array.isArray(value) ? value.slice() : [];
  }

  function normalise(value) {
    return (value || "")
      .toString()
      .trim();
  }

  function sortByDateDesc(a, b) {
    const aDate = new Date(a.createdAt || a.posted || 0).getTime();
    const bDate = new Date(b.createdAt || b.posted || 0).getTime();
    return bDate - aDate;
  }

  function getSettings() {
    const stored = read(KEYS.settings, {});
    return { ...defaultSettings, ...stored };
  }

  function saveSettings(next) {
    const merged = { ...getSettings(), ...next };
    write(KEYS.settings, merged);
    return merged;
  }

  function applyBranding(settings = getSettings()) {
    const root = document.documentElement;
    if (!root) return;
    root.style.setProperty("--color-primary", settings.primaryColor || defaultSettings.primaryColor);
    root.style.setProperty("--color-primary-dark", settings.primaryColor || defaultSettings.primaryColor);
    root.style.setProperty("--color-accent", settings.accentColor || defaultSettings.accentColor);
    root.style.setProperty("--color-accent-dark", settings.accentColor || defaultSettings.accentColor);
  }

  function getHeroContent() {
    const settings = getSettings();
    return {
      heading: settings.heroHeading || defaultSettings.heroHeading,
      subheading: settings.heroSubheading || defaultSettings.heroSubheading,
    };
  }

  function getJobs(includeSamples = true) {
    const stored = toArray(read(KEYS.jobs, []));
    const combined = includeSamples ? [...sampleJobs, ...stored] : stored;
    return combined.sort(sortByDateDesc);
  }

  function getJobSubmissions() {
    return toArray(read(KEYS.jobs, []));
  }

  function addJob(job) {
    const payload = {
      id: createId("job"),
      sample: false,
      createdAt: new Date().toISOString(),
      ...job,
    };
    const current = getJobSubmissions();
    current.unshift(payload);
    write(KEYS.jobs, current);
    return payload;
  }

  function removeJob(id) {
    const current = getJobSubmissions().filter((item) => item.id !== id);
    write(KEYS.jobs, current);
    return current;
  }

  function getTalent(includeSamples = true) {
    const stored = toArray(read(KEYS.talent, []));
    const combined = includeSamples ? [...sampleTalent, ...stored] : stored;
    return combined.sort(sortByDateDesc);
  }

  function getTalentSubmissions() {
    return toArray(read(KEYS.talent, []));
  }

  function addTalent(profile) {
    const payload = {
      id: createId("talent"),
      sample: false,
      createdAt: new Date().toISOString(),
      ...profile,
    };
    const current = getTalentSubmissions();
    current.unshift(payload);
    write(KEYS.talent, current);
    return payload;
  }

  function removeTalent(id) {
    const current = getTalentSubmissions().filter((item) => item.id !== id);
    write(KEYS.talent, current);
    return current;
  }

  function getEmployers(includeSamples = true) {
    const stored = toArray(read(KEYS.employers, []));
    const combined = includeSamples ? [...sampleEmployers, ...stored] : stored;
    return combined.sort(sortByDateDesc);
  }

  function getEmployerSubmissions() {
    return toArray(read(KEYS.employers, []));
  }

  function addEmployer(profile) {
    const payload = {
      id: createId("employer"),
      sample: false,
      createdAt: new Date().toISOString(),
      ...profile,
    };
    const current = getEmployerSubmissions();
    current.unshift(payload);
    write(KEYS.employers, current);
    return payload;
  }

  function removeEmployer(id) {
    const current = getEmployerSubmissions().filter((item) => item.id !== id);
    write(KEYS.employers, current);
    return current;
  }

  function getNewsletter() {
    return toArray(read(KEYS.newsletter, [])).sort(sortByDateDesc);
  }

  function addNewsletter(entry) {
    const email = normalise(entry.email);
    if (!email) return null;
    const current = getNewsletter();
    const existing = current.find((item) => item.email === email);
    if (existing) {
      existing.createdAt = new Date().toISOString();
      existing.source = entry.source || existing.source || "website";
      write(KEYS.newsletter, current);
      return existing;
    }
    const payload = {
      id: createId("newsletter"),
      email,
      source: entry.source || "website",
      createdAt: new Date().toISOString(),
    };
    current.unshift(payload);
    write(KEYS.newsletter, current);
    return payload;
  }

  function getStats() {
    return {
      jobs: getJobSubmissions().length,
      talent: getTalentSubmissions().length,
      employers: getEmployerSubmissions().length,
      newsletter: getNewsletter().length,
    };
  }

  function buildSignalFromJob(job) {
    const area = job.area || job.location || "30A";
    return {
      label: "Job shared",
      text: `${job.company || "A local business"} added "${job.title}" for ${area}.`,
      createdAt: job.createdAt,
    };
  }

  function buildSignalFromTalent(profile) {
    return {
      label: "Talent spotlight",
      text: `${profile.name || profile.fullName || "A hospitality pro"} is ready for roles in ${profile.location || "30A"}.`,
      createdAt: profile.createdAt,
    };
  }

  function buildSignalFromEmployer(profile) {
    return {
      label: "Employer joined",
      text: `${profile.name || profile.businessName || "A coastal brand"} is hiring for ${profile.focus || "hospitality roles"}.`,
      createdAt: profile.createdAt,
    };
  }

  function getSignals() {
    const signals = [];
    getJobSubmissions().slice(0, 3).forEach((job) => signals.push(buildSignalFromJob(job)));
    getTalentSubmissions().slice(0, 3).forEach((profile) => signals.push(buildSignalFromTalent(profile)));
    getEmployerSubmissions().slice(0, 3).forEach((profile) => signals.push(buildSignalFromEmployer(profile)));

    signals.sort(sortByDateDesc);

    if (signals.length < 4) {
      sampleSignals.forEach((text) => {
        signals.push({
          label: "Preview",
          text,
        });
      });
    }

    return signals.slice(0, 6);
  }

  function exportData() {
    return {
      settings: getSettings(),
      jobs: getJobSubmissions(),
      talent: getTalentSubmissions(),
      employers: getEmployerSubmissions(),
      newsletter: getNewsletter(),
    };
  }

  function clearCollection(type) {
    switch (type) {
      case "jobs":
        write(KEYS.jobs, []);
        break;
      case "talent":
        write(KEYS.talent, []);
        break;
      case "employers":
        write(KEYS.employers, []);
        break;
      case "newsletter":
        write(KEYS.newsletter, []);
        break;
      default:
        break;
    }
  }

  window.Hire30A = {
    getSettings,
    saveSettings,
    applyBranding,
    getHeroContent,
    getStats,
    getSignals,
    getJobs,
    addJob,
    removeJob,
    getTalent,
    addTalent,
    removeTalent,
    getEmployers,
    addEmployer,
    removeEmployer,
    addNewsletter,
    getNewsletter,
    exportData,
    clearCollection,
  };
})();
