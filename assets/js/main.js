(function () {
  const data = window.Hire30AData;
  if (!data) return;

  const STORAGE_KEYS = {
    settings: "hire30a-settings",
    jobs: "hire30a-aggregated",
    seekers: "hire30a-profiles-seekers",
    employers: "hire30a-profiles-employers",
  };

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = value;
    }
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value || 0);
  }

  function formatDate(iso) {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function updateHeroCopy() {
    const settings = data.getSettings();
    data.applyBrandSettings(settings);
    setText("hero-heading", settings.heroHeading || "Hire30A connects hospitality talent with coastal employers.");
    setText(
      "hero-lead",
      settings.heroLead ||
        "From the sugar-white shores of Santa Rosa Beach to Destin and Panama City Beach, we make it effortless to surface real jobs, spotlight resumes, and build the Emerald Coast's go-to hiring hub."
    );
  }

  function countPublished(profiles) {
    return profiles.filter((profile) => profile && profile.publish).length;
  }

  function updateMetrics() {
    const jobState = data.getJobState();
    const jobs = jobState.jobs || [];
    const seekers = data.getProfiles("seeker");
    const employers = data.getProfiles("employer");
    setText("metric-jobs", formatNumber(jobs.length));
    setText("metric-seekers", formatNumber(countPublished(seekers)));
    setText("metric-employers", formatNumber(countPublished(employers)));
  }

  function renderHeroUpdates() {
    const list = document.getElementById("hero-updates");
    if (!list) return;
    list.innerHTML = "";
    const jobState = data.getJobState();
    const jobs = jobState.jobs || [];

    if (!jobs.length) {
      const item = document.createElement("li");
      item.textContent = "Connect the admin aggregator with your API keys to stream live jobs from LinkedIn, Indeed, SoWal, and more.";
      list.appendChild(item);
      return;
    }

    jobs.slice(0, 5).forEach((job) => {
      const item = document.createElement("li");
      const title = document.createElement("strong");
      title.textContent = job.title || "Untitled role";
      item.appendChild(title);
      const details = [job.company, job.area || job.location || "Emerald Coast"].filter(Boolean);
      if (details.length) {
        item.appendChild(document.createTextNode(` · ${details.join(" · ")}`));
      }
      list.appendChild(item);
    });

    if (jobState.updatedAt) {
      const updated = document.createElement("li");
      updated.textContent = `Last refreshed ${formatDate(jobState.updatedAt)}.`;
      list.appendChild(updated);
    }
  }

  function initNewsletter() {
    const form = document.getElementById("newsletter-form");
    const success = document.getElementById("newsletter-success");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const email = (formData.get("email") || "").toString().trim();
      if (!email) return;
      data.saveNewsletter(email);
      form.reset();
      if (success) {
        success.hidden = false;
      }
    });
  }

  function initYear() {
    setText("year", new Date().getFullYear());
  }

  function handleStorage(event) {
    if (!event || !event.key) return;
    switch (event.key) {
      case STORAGE_KEYS.settings:
        updateHeroCopy();
        break;
      case STORAGE_KEYS.jobs:
        updateMetrics();
        renderHeroUpdates();
        break;
      case STORAGE_KEYS.seekers:
      case STORAGE_KEYS.employers:
        updateMetrics();
        break;
      default:
        break;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateHeroCopy();
    updateMetrics();
    renderHeroUpdates();
    initNewsletter();
    initYear();
    window.addEventListener("storage", handleStorage);
  });
})();
