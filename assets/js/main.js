(function () {
  const data = window.Hire30A || null;

  function setupNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.navbar');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open', !expanded);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      });
    });
  }

  function applyBranding() {
    if (!data) return;
    data.applyBranding();
  }

  function populateHero() {
    if (!data) return;
    const hero = data.getHeroContent();
    const heading = document.getElementById('hero-heading');
    const subheading = document.getElementById('hero-subheading');
    if (heading && hero.heading) {
      heading.textContent = hero.heading;
    }
    if (subheading && hero.subheading) {
      subheading.textContent = hero.subheading;
    }
  }

  function formatNumber(value) {
    return Number(value || 0).toLocaleString();
  }

  function populateStats() {
    if (!data) return;
    const stats = data.getStats();
    const statMap = {
      'stat-jobs': stats.jobs,
      'stat-talent': stats.talent,
      'stat-employers': stats.employers,
      'stat-newsletter': stats.newsletter,
    };
    Object.entries(statMap).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = formatNumber(value);
      }
    });
  }

  function renderSignals() {
    if (!data) return;
    const container = document.getElementById('update-feed');
    if (!container) return;

    container.innerHTML = '';
    const signals = data.getSignals();
    if (!signals.length) {
      const empty = document.createElement('li');
      empty.className = 'update-item';
      empty.textContent = 'Be the first to share a job, resume, or employer story from the Emerald Coast.';
      container.appendChild(empty);
      return;
    }

    signals.forEach((signal) => {
      const item = document.createElement('li');
      item.className = 'update-item';
      const text = document.createElement('span');
      text.textContent = signal.text;
      item.appendChild(text);
      if (signal.label) {
        const label = document.createElement('small');
        label.textContent = signal.label;
        item.appendChild(label);
      }
      container.appendChild(item);
    });
  }

  function handleNewsletter() {
    if (!data) return;
    const form = document.getElementById('newsletter-form');
    const success = document.getElementById('newsletter-success');
    const emailInput = document.getElementById('newsletter-email');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const email = formData.get('email');
      const entry = data.addNewsletter({ email, source: 'coming-soon' });
      if (!entry) return;
      form.reset();
      if (success) {
        success.classList.add('is-visible');
      }
      populateStats();
      renderSignals();
    });

    if (emailInput && success) {
      emailInput.addEventListener('input', () => {
        success.classList.remove('is-visible');
      });
    }
  }

  function setYear() {
    const target = document.getElementById('year');
    if (target) {
      target.textContent = new Date().getFullYear();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    applyBranding();
    populateHero();
    populateStats();
    renderSignals();
    handleNewsletter();
    setYear();
  });
})();
=======
const defaultJobs = [
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

const defaultResumes = [
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

const updates = [
  "New: Pier Park Rooftop Lounge hiring Lead Mixologist in Panama City Beach",
  "Wave Watch: WaterColor Inn opens 6 concierge roles for summer",
  "Community spotlight: Grayton Gathering House seeks banquet talent",
  "Talent drop: 8 seasoned bartenders added resumes this week",
  "Destin charter partners launching seasonal hiring fair May 12"
];

const defaultSettings = {
  primaryColor: "#0096a1",
  secondaryColor: "#7ed4d4",
  accentColor: "#ff7a59",
  heroHeading: "Hire30A unites Gulf Coast hospitality talent with thriving coastal businesses.",
  heroLead:
    "From the sugar-white shores of Santa Rosa Beach to Destin and Panama City Beach, we make it effortless to post jobs, showcase resumes, and fill shifts with trusted locals."
};

const selectors = {
  list: document.getElementById("job-list"),
  count: document.getElementById("job-count"),
  highlight: document.getElementById("job-highlight"),
  heroUpdates: document.getElementById("hero-updates"),
  resumeList: document.getElementById("resume-list"),
  heroHeading: document.getElementById("hero-heading"),
  heroLead: document.getElementById("hero-lead"),
  year: document.getElementById("year"),
  newsletter: document.getElementById("newsletter-form")
};

const filterForm = document.getElementById("job-filter");
const jobForm = document.getElementById("job-form");
const resumeForm = document.getElementById("resume-form");

function getStoredData(key, fallback) {
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

function storeData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Unable to persist ${key} in storage`, error);
  }
}

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

let jobs = getStoredData("hire30a-jobs", defaultJobs);
let resumes = getStoredData("hire30a-resumes", defaultResumes);
let brandSettings = getStoredObject("hire30a-settings", defaultSettings);

function primeDefaultStorage() {
  try {
    if (!localStorage.getItem("hire30a-default-jobs")) {
      localStorage.setItem("hire30a-default-jobs", JSON.stringify(defaultJobs));
    }
    if (!localStorage.getItem("hire30a-default-resumes")) {
      localStorage.setItem("hire30a-default-resumes", JSON.stringify(defaultResumes));
    }
  } catch (error) {
    console.warn("Unable to prime default storage", error);
  }
}

function applyBrandSettings(settings) {
  const root = document.documentElement;
  if (root) {
    root.style.setProperty("--brand-emerald", settings.primaryColor);
    root.style.setProperty("--brand-seafoam", settings.secondaryColor);
    root.style.setProperty("--brand-coral", settings.accentColor);
  }

  if (selectors.heroHeading) {
    selectors.heroHeading.textContent = settings.heroHeading;
  }

  if (selectors.heroLead) {
    selectors.heroLead.textContent = settings.heroLead;
  }
}

function renderJobs(list) {
  if (!selectors.list) return;
  selectors.list.innerHTML = "";

  if (!list.length) {
    selectors.list.innerHTML = '<p class="empty-state">No jobs match your filters yet. Try another neighborhood or check back soon!</p>';
  }

  const fragment = document.createDocumentFragment();

  list.forEach((job) => {
    const card = document.createElement("article");
    card.className = "job-card";
    const perks = Array.isArray(job.perks) && job.perks.length
      ? job.perks
      : ["Featured on Hire30A", "Shared with local partners", "Amplified via socials"];
    const applyUrl = job.applyUrl || "mailto:hello@hire30a.com";
    card.innerHTML = `
      <header>
        <div>
          <h3>${job.title}</h3>
          <p class="job-meta">
            <span>${job.company}</span>
            <span>&bull;</span>
            <span>${job.location}</span>
          </p>
        </div>
        <div class="job-actions">
          <span class="badge">${job.schedule}</span>
          <span class="badge">${job.category}</span>
        </div>
      </header>
      <p>${job.description}</p>
      <ul class="highlight-list">
        ${perks.map((perk) => `<li>${perk}</li>`).join("")}
      </ul>
      <footer class="job-meta">
        <span>${job.posted}</span>
        <a class="button button-outline" href="${applyUrl}" target="_blank" rel="noopener">Apply / Inquire</a>
      </footer>
    `;
    fragment.appendChild(card);
  });

  selectors.list.appendChild(fragment);
  selectors.count.textContent = list.length;

  if (list.length) {
    const primaryArea = list[0].location;
    selectors.highlight.textContent = `Now trending in ${primaryArea}: ${list[0].title} at ${list[0].company}.`;
  } else {
    selectors.highlight.textContent = "Refine your filters or submit a new role for instant visibility.";
  }
}

function renderResumes(list) {
  if (!selectors.resumeList) return;
  selectors.resumeList.innerHTML = "";
  const fragment = document.createDocumentFragment();

  list.forEach((profile) => {
    const card = document.createElement("article");
    card.className = "resume-card";
    const highlights = Array.isArray(profile.highlights) && profile.highlights.length
      ? profile.highlights
      : ["Hospitality pro ready to connect", "Reach out to learn more"];
    const contact = profile.contact || "mailto:hello@hire30a.com";
    card.innerHTML = `
      <h3>${profile.name}</h3>
      <p><strong>${profile.role}</strong></p>
      <p>${profile.location}</p>
      <ul>
        ${highlights.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <p><a class="button button-outline" href="${contact}">Connect</a></p>
    `;
    fragment.appendChild(card);
  });

  selectors.resumeList.appendChild(fragment);
}

function applyFilters() {
  const formData = new FormData(filterForm);
  const search = formData.get("search").toLowerCase().trim();
  const location = formData.get("location");
  const category = formData.get("category");
  const schedule = formData.get("schedule");

  const filtered = jobs.filter((job) => {
    const matchesSearch = search
      ? [job.title, job.company, job.location, job.description]
          .join(" ")
          .toLowerCase()
          .includes(search)
      : true;
    const matchesLocation = location ? job.location === location : true;
    const matchesCategory = category ? job.category === category : true;
    const matchesSchedule = schedule ? job.schedule === schedule : true;
    return matchesSearch && matchesLocation && matchesCategory && matchesSchedule;
  });

  renderJobs(filtered);
}

function rotateUpdates() {
  if (!selectors.heroUpdates) return;
  selectors.heroUpdates.innerHTML = updates
    .map((update) => `<li>${update}</li>`)
    .join("");

  let index = 0;
  const items = selectors.heroUpdates.querySelectorAll("li");
  items.forEach((item, idx) => {
    item.setAttribute("role", "status");
    if (idx !== 0) {
      item.style.display = "none";
    }
  });

  setInterval(() => {
    if (!items.length) return;
    items[index].style.display = "none";
    index = (index + 1) % items.length;
    items[index].style.display = "list-item";
  }, 5000);
}

function attachFormHandlers() {
  if (jobForm) {
    jobForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(jobForm);
      const newJob = {
        id: `job-${Date.now()}`,
        title: formData.get("jobTitle"),
        company: formData.get("jobCompany"),
        location: formData.get("jobLocation"),
        category: formData.get("jobCategory"),
        schedule: formData.get("jobSchedule"),
        description: formData.get("jobDescription"),
        perks: ["Locals-first visibility", "Featured in weekly newsletter", "Amplified via social"],
        posted: "Just added via Hire30A",
        applyUrl: `mailto:${formData.get("jobContact")}`
      };

      jobs = [newJob, ...jobs];
      storeData("hire30a-jobs", jobs);
      jobForm.reset();
      applyFilters();
      jobForm.querySelectorAll(".success").forEach((node) => node.remove());
      jobForm.insertAdjacentHTML(
        "beforeend",
        '<p class="form-footnote success">Thanks! Your role is now live and queued for curation.</p>'
      );
    });
  }

  if (resumeForm) {
    resumeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(resumeForm);
      const newProfile = {
        id: `resume-${Date.now()}`,
        name: formData.get("resumeName"),
        role: formData.get("resumeRole"),
        location: formData.get("resumeLocation"),
        highlights: [
          formData.get("resumeExperience"),
          "Available for interviews",
          `Contact: ${formData.get("resumeContact")}`
        ],
        contact: `mailto:${formData.get("resumeContact")}`
      };

      resumes = [newProfile, ...resumes];
      storeData("hire30a-resumes", resumes);
      resumeForm.reset();
      renderResumes(resumes.slice(0, 6));
      resumeForm.querySelectorAll(".success").forEach((node) => node.remove());
      resumeForm.insertAdjacentHTML(
        "beforeend",
        '<p class="form-footnote success">Your coastal resume is now visible to Hire30A partners.</p>'
      );
    });
  }

  if (selectors.newsletter) {
    selectors.newsletter.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = selectors.newsletter.querySelector("input");
      input.value = "";
      selectors.newsletter.insertAdjacentHTML(
        "afterend",
        '<p class="newsletter-success">You\'re on the list! Watch for weekly 30A hiring highlights.</p>'
      );
    });
  }
}

function cleanupDuplicateNotices() {
  document.querySelectorAll(".success").forEach((message, index) => {
    if (index > 0) message.remove();
  });

  document.querySelectorAll(".newsletter-success").forEach((message, index) => {
    if (index > 0) message.remove();
  });
}

function init() {
  if (selectors.year) {
    selectors.year.textContent = new Date().getFullYear();
  }

  primeDefaultStorage();
  applyBrandSettings(brandSettings);
  renderJobs(jobs);
  renderResumes(resumes.slice(0, 6));
  rotateUpdates();
  attachFormHandlers();

  if (filterForm) {
    filterForm.addEventListener("input", () => {
      cleanupDuplicateNotices();
      applyFilters();
    });
  }

  document.addEventListener("click", cleanupDuplicateNotices);

  window.addEventListener("storage", (event) => {
    if (event.key === "hire30a-settings") {
      brandSettings = getStoredObject("hire30a-settings", defaultSettings);
      applyBrandSettings(brandSettings);
    }
    if (event.key === "hire30a-jobs") {
      jobs = getStoredData("hire30a-jobs", defaultJobs);
      applyFilters();
    }
    if (event.key === "hire30a-resumes") {
      resumes = getStoredData("hire30a-resumes", defaultResumes);
      renderResumes(resumes.slice(0, 6));
    }
  });
}

window.addEventListener("DOMContentLoaded", init);