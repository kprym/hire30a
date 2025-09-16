const defaultSettings = {
  primaryColor: "#0096a1",
  secondaryColor: "#7ed4d4",
  accentColor: "#ff7a59",
  heroHeading: "Hire30A unites Gulf Coast hospitality talent with thriving coastal businesses.",
  heroLead:
    "From the sugar-white shores of Santa Rosa Beach to Destin and Panama City Beach, we make it effortless to post jobs, showcase resumes, and fill shifts with trusted locals."
};

const jobSeed = [
  {
    id: "job-1",
    title: "Sunrise Barista",
    company: "Gulf Grind Coffee Co.",
    location: "Seaside",
    category: "Food & Beverage",
    schedule: "Part-time",
    description:
      "Craft signature coastal lattes, keep the espresso bar sparkling, and share local tips with the sunrise crowd.",
    perks: ["Tip share", "Beachfront parking", "Shift beverages"],
    posted: "Posted 2 hours ago",
    applyUrl: "mailto:hello@gulfgrind30a.com"
  },
  {
    id: "job-2",
    title: "Boutique Resort Concierge",
    company: "WaterColor Inn",
    location: "WaterColor",
    category: "Hotel & Resort",
    schedule: "Full-time",
    description:
      "Deliver award-winning guest experiences, coordinate custom itineraries, and liaise with local partners.",
    perks: ["401k match", "Wellness stipend", "Complimentary bike"],
    posted: "Posted today",
    applyUrl: "https://watercolorinn.com/careers"
  },
  {
    id: "job-3",
    title: "Banquet Captain",
    company: "Grayton Gathering House",
    location: "Grayton Beach",
    category: "Events & Weddings",
    schedule: "Seasonal",
    description:
      "Lead set-up crews, orchestrate plated dinners, and collaborate with Gulf-side chefs for destination weddings.",
    perks: ["Event bonuses", "Team meals", "Cross-training"],
    posted: "Posted yesterday",
    applyUrl: "mailto:banquets@graytongathering.com"
  },
  {
    id: "job-4",
    title: "Vacation Rental Guest Services Guide",
    company: "Emerald Escapes",
    location: "Miramar Beach",
    category: "Vacation Rentals",
    schedule: "Full-time",
    description:
      "Coordinate arrivals, deliver concierge-level communications, and champion five-star guest reviews.",
    perks: ["Commission", "Hybrid work", "Education stipend"],
    posted: "Posted 3 days ago",
    applyUrl: "https://emeraldescapesfl.com/hiring"
  },
  {
    id: "job-5",
    title: "Lead Mixologist",
    company: "Pier Park Rooftop Lounge",
    location: "Panama City Beach",
    category: "Food & Beverage",
    schedule: "Full-time",
    description:
      "Design seasonal cocktail menus, mentor bar teams, and host weekly mixology workshops for resort guests.",
    perks: ["Creative freedom", "Signing bonus", "Housing assistance"],
    posted: "Posted 5 days ago",
    applyUrl: "mailto:careers@pierparkrooftop.com"
  },
  {
    id: "job-6",
    title: "Waterfront Event Producer",
    company: "HarborLights Destin",
    location: "Destin",
    category: "Events & Weddings",
    schedule: "Contract",
    description:
      "Produce signature experiences aboard luxury charters, manage vendor relations, and deliver flawless execution.",
    perks: ["Profit share", "Sunset sails", "Vendor discounts"],
    posted: "Posted 1 week ago",
    applyUrl: "https://harborlightsdestin.com/events"
  }
];

const resumeSeed = [
  {
    id: "resume-1",
    name: "Maya Thompson",
    role: "Beachfront Restaurant General Manager",
    location: "Seaside, FL",
    highlights: [
      "Scaled seasonal teams from 15 to 60 without losing service quality",
      "Beverage program generated 18% year-over-year growth",
      "ServSafe, Cicerone Certified, fluent in Spanish"
    ],
    contact: "mailto:maya.thompson@hire30a.com"
  },
  {
    id: "resume-2",
    name: "Connor Jenkins",
    role: "Luxury Resort Concierge",
    location: "Miramar Beach, FL",
    highlights: [
      "Maintains 4.9 guest satisfaction score across 300+ stays",
      "Local expert on fishing charters and private chefs",
      "CPR certified, knowledge of ADA travel requirements"
    ],
    contact: "mailto:connor.jenkins@hire30a.com"
  },
  {
    id: "resume-3",
    name: "Sage Rivera",
    role: "Event Stylist & Planner",
    location: "Alys Beach, FL",
    highlights: [
      "Designed 40+ destination weddings across 30A and Destin",
      "Partnerships with premier florists and entertainment",
      "Experience with 400-guest corporate retreats"
    ],
    contact: "mailto:sage.rivera@hire30a.com"
  }
];

const elements = {
  themeForm: document.getElementById("theme-form"),
  contentForm: document.getElementById("content-form"),
  primaryColor: document.getElementById("primary-color"),
  secondaryColor: document.getElementById("secondary-color"),
  accentColor: document.getElementById("accent-color"),
  heroHeadingInput: document.getElementById("hero-heading-input"),
  heroLeadInput: document.getElementById("hero-lead-input"),
  resetTheme: document.getElementById("reset-theme"),
  resetContent: document.getElementById("reset-content"),
  jobAreaFilter: document.getElementById("job-area-filter"),
  jobsBody: document.getElementById("jobs-body"),
  resumesBody: document.getElementById("resumes-body"),
  exportJobs: document.getElementById("export-jobs"),
  exportResumes: document.getElementById("export-resumes"),
  clearJobs: document.getElementById("clear-jobs"),
  clearResumes: document.getElementById("clear-resumes"),
  year: document.getElementById("admin-year")
};

function getStoredObject(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === "object" ? { ...fallback, ...parsed } : fallback;
  } catch (error) {
    console.warn(`Unable to load ${key} from storage`, error);
    return fallback;
  }
}

function getStoredArray(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.warn(`Unable to load ${key} from storage`, error);
    return fallback;
  }
}

let defaultJobs = [];
let defaultResumes = [];

let settings = getStoredObject("hire30a-settings", defaultSettings);
let jobs = [];
let resumes = [];

function primeDefaultStorage() {
  try {
    if (!localStorage.getItem("hire30a-default-jobs")) {
      localStorage.setItem("hire30a-default-jobs", JSON.stringify(jobSeed));
    }
    if (!localStorage.getItem("hire30a-default-resumes")) {
      localStorage.setItem("hire30a-default-resumes", JSON.stringify(resumeSeed));
    }
  } catch (error) {
    console.warn("Unable to prime admin defaults", error);
  }
}

function applyPreviewStyles() {
  const root = document.documentElement;
  if (!root) return;
  root.style.setProperty("--brand-emerald", settings.primaryColor);
  root.style.setProperty("--brand-seafoam", settings.secondaryColor);
  root.style.setProperty("--brand-coral", settings.accentColor);
}

function populateForms() {
  if (elements.primaryColor) {
    elements.primaryColor.value = settings.primaryColor;
  }
  if (elements.secondaryColor) {
    elements.secondaryColor.value = settings.secondaryColor;
  }
  if (elements.accentColor) {
    elements.accentColor.value = settings.accentColor;
  }
  if (elements.heroHeadingInput) {
    elements.heroHeadingInput.value = settings.heroHeading;
  }
  if (elements.heroLeadInput) {
    elements.heroLeadInput.value = settings.heroLead;
  }
  if (elements.year) {
    elements.year.textContent = new Date().getFullYear();
  }
}

function renderJobs(filterLocation = "") {
  if (!elements.jobsBody) return;
  elements.jobsBody.innerHTML = "";
  const fragment = document.createDocumentFragment();
  jobs
    .filter((job) => (filterLocation ? job.location === filterLocation : true))
    .forEach((job) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${job.title}</td>
        <td>${job.company}</td>
        <td>${job.location}</td>
        <td>${job.schedule}</td>
      `;
      fragment.appendChild(row);
    });
  elements.jobsBody.appendChild(fragment);
}

function renderResumes() {
  if (!elements.resumesBody) return;
  elements.resumesBody.innerHTML = "";
  const fragment = document.createDocumentFragment();
  resumes.forEach((profile) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${profile.name}</td>
      <td>${profile.role}</td>
      <td>${profile.location}</td>
    `;
    fragment.appendChild(row);
  });
  elements.resumesBody.appendChild(fragment);
}

function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function attachEvents() {
  if (elements.themeForm) {
    elements.themeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      elements.themeForm.querySelectorAll(".success").forEach((node) => node.remove());
      settings = {
        ...settings,
        primaryColor: elements.primaryColor.value,
        secondaryColor: elements.secondaryColor.value,
        accentColor: elements.accentColor.value
      };
      localStorage.setItem("hire30a-settings", JSON.stringify(settings));
      applyPreviewStyles();
      elements.themeForm.insertAdjacentHTML(
        "beforeend",
        '<p class="form-footnote success">Brand palette saved. Refresh the public site to preview live.</p>'
      );
    });
  }

  if (elements.resetTheme) {
    elements.resetTheme.addEventListener("click", () => {
      settings = { ...defaultSettings };
      localStorage.setItem("hire30a-settings", JSON.stringify(settings));
      populateForms();
      applyPreviewStyles();
    });
  }

  if (elements.contentForm) {
    elements.contentForm.addEventListener("submit", (event) => {
      event.preventDefault();
      elements.contentForm.querySelectorAll(".success").forEach((node) => node.remove());
      settings = {
        ...settings,
        heroHeading: elements.heroHeadingInput.value,
        heroLead: elements.heroLeadInput.value
      };
      localStorage.setItem("hire30a-settings", JSON.stringify(settings));
      elements.contentForm.insertAdjacentHTML(
        "beforeend",
        '<p class="form-footnote success">Messaging updated. Check the homepage to confirm.</p>'
      );
    });
  }

  if (elements.resetContent) {
    elements.resetContent.addEventListener("click", () => {
      settings = { ...settings, heroHeading: defaultSettings.heroHeading, heroLead: defaultSettings.heroLead };
      localStorage.setItem("hire30a-settings", JSON.stringify(settings));
      populateForms();
    });
  }

  if (elements.jobAreaFilter) {
    elements.jobAreaFilter.addEventListener("change", (event) => {
      renderJobs(event.target.value);
    });
  }

  if (elements.exportJobs) {
    elements.exportJobs.addEventListener("click", () => {
      downloadJSON("hire30a-jobs.json", jobs);
    });
  }

  if (elements.exportResumes) {
    elements.exportResumes.addEventListener("click", () => {
      downloadJSON("hire30a-resumes.json", resumes);
    });
  }

  if (elements.clearJobs) {
    elements.clearJobs.addEventListener("click", () => {
      if (confirm("Clear all community job submissions?")) {
        jobs = defaultJobs.slice();
        localStorage.setItem("hire30a-jobs", JSON.stringify(jobs));
        renderJobs(elements.jobAreaFilter.value);
      }
    });
  }

  if (elements.clearResumes) {
    elements.clearResumes.addEventListener("click", () => {
      if (confirm("Clear all community resume submissions?")) {
        resumes = defaultResumes.slice();
        localStorage.setItem("hire30a-resumes", JSON.stringify(resumes));
        renderResumes();
      }
    });
  }

  window.addEventListener("storage", (event) => {
    if (event.key === "hire30a-jobs") {
      jobs = getStoredArray("hire30a-jobs", defaultJobs);
      renderJobs(elements.jobAreaFilter.value);
    }
    if (event.key === "hire30a-resumes") {
      resumes = getStoredArray("hire30a-resumes", defaultResumes);
      renderResumes();
    }
    if (event.key === "hire30a-settings") {
      settings = getStoredObject("hire30a-settings", defaultSettings);
      populateForms();
      applyPreviewStyles();
    }
  });
}

function init() {
  primeDefaultStorage();
  defaultJobs = getStoredArray("hire30a-default-jobs", jobSeed);
  defaultResumes = getStoredArray("hire30a-default-resumes", resumeSeed);
  jobs = getStoredArray("hire30a-jobs", defaultJobs);
  resumes = getStoredArray("hire30a-resumes", defaultResumes);
  applyPreviewStyles();
  populateForms();
  renderJobs(elements.jobAreaFilter ? elements.jobAreaFilter.value : "");
  renderResumes();
  attachEvents();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
