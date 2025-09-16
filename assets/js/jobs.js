(function () {
  const data = window.Hire30AData;
  if (!data) return;

  const formatNumber = (value) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value || 0);

  function formatRelativeDate(iso) {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays < 1) {
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));
      if (diffHours <= 1) return "Posted within the last hour";
      return `Posted ${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    }
    if (diffDays < 7) {
      const rounded = Math.round(diffDays);
      return `Posted ${rounded} day${rounded === 1 ? "" : "s"} ago`;
    }
    return `Posted ${date.toLocaleDateString()}`;
  }

  function truncate(text, length = 280) {
    if (!text) return "";
    if (text.length <= length) return text;
    return `${text.slice(0, length - 1).trim()}…`;
  }

  function createBadge(text) {
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = text;
    return span;
  }

  function createJobCard(job) {
    const article = document.createElement("article");
    article.className = "job-card";
    article.setAttribute("role", "listitem");
    const header = document.createElement("header");
    const title = document.createElement("h3");
    title.textContent = job.title || "Untitled role";
    header.appendChild(title);

    const meta = document.createElement("div");
    meta.className = "job-meta";
    if (job.company) {
      const company = document.createElement("span");
      company.textContent = job.company;
      meta.appendChild(company);
    }
    if (job.location) {
      const location = document.createElement("span");
      location.textContent = job.location;
      meta.appendChild(location);
    }
    if (job.schedule) {
      const schedule = document.createElement("span");
      schedule.textContent = job.schedule;
      meta.appendChild(schedule);
    }
    header.appendChild(meta);

    if (job.category) {
      header.appendChild(createBadge(job.category));
    }
    if (job.source) {
      header.appendChild(createBadge(job.source));
    }

    article.appendChild(header);

    if (job.description) {
      const description = document.createElement("p");
      description.className = "job-summary";
      description.textContent = truncate(job.description, 420);
      article.appendChild(description);
    }

    const footer = document.createElement("div");
    footer.className = "job-actions";
    const apply = document.createElement("a");
    apply.className = "button";
    apply.textContent = "View & Apply";
    apply.href = job.url || "#";
    apply.target = "_blank";
    apply.rel = "noopener";
    if (!job.url) {
      apply.classList.add("button-outline");
      apply.dataset.disabled = "true";
      apply.textContent = "Details coming soon";
      apply.href = "#";
      apply.removeAttribute("target");
      apply.removeAttribute("rel");
    }
    footer.appendChild(apply);

    if (job.postedAt) {
      const posted = document.createElement("span");
      posted.className = "form-footnote";
      posted.textContent = formatRelativeDate(job.postedAt);
      footer.appendChild(posted);
    }

    article.appendChild(footer);
    return article;
  }

  function updateEmptyState(isEmpty) {
    const empty = document.getElementById("jobs-empty");
    if (!empty) return;
    empty.hidden = !isEmpty;
  }

  function updateStats(jobs) {
    setText("jobs-total", formatNumber(jobs.length));
    const destinCount = jobs.filter((job) => (job.area || "").includes("Destin")).length;
    const pcbCount = jobs.filter((job) => (job.area || "").includes("Panama City Beach")).length;
    setText("jobs-destin", formatNumber(destinCount));
    setText("jobs-pcb", formatNumber(pcbCount));
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  function renderJobs(list) {
    const container = document.getElementById("job-results");
    if (!container) return;
    container.innerHTML = "";
    if (!list.length) {
      updateEmptyState(true);
      const total = currentJobs.length;
      const summary = total
        ? `0 of ${formatNumber(total)} roles match those filters.`
        : "No jobs match those filters yet.";
      setText("results-summary", summary);
      updateStats(list);
      return;
    }
    updateEmptyState(false);
    list.forEach((job) => {
      container.appendChild(createJobCard(job));
    });
    const total = currentJobs.length;
    const summary = total
      ? `${formatNumber(list.length)} of ${formatNumber(total)} roles match your filters.`
      : `${formatNumber(list.length)} roles displayed.`;
    setText("results-summary", summary);
    updateStats(list);
  }

  function applyFilters() {
    const query = filters.search.toLowerCase();
    const location = filters.location.toLowerCase();
    const category = filters.category.toLowerCase();
    const source = filters.source.toLowerCase();
    const postedDays = filters.posted ? parseInt(filters.posted, 10) : null;

    const filtered = currentJobs.filter((job) => {
      if (query) {
        const haystack = `${job.title || ""} ${job.company || ""} ${job.description || ""}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (location) {
        const area = (job.area || job.location || "").toLowerCase();
        if (!area.includes(location)) return false;
      }
      if (category && (job.category || "").toLowerCase() !== category) {
        return false;
      }
      if (source && !(job.source || "").toLowerCase().includes(source)) {
        return false;
      }
      if (postedDays !== null && job.postedAt) {
        const diffMs = Date.now() - new Date(job.postedAt).getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        if (diffDays > postedDays) return false;
      }
      return true;
    });

    renderJobs(filtered);
  }

  function updateLastUpdated(iso) {
    const element = document.getElementById("jobs-last-updated");
    if (!element) return;
    if (!iso) {
      element.textContent = "Run a sync from the admin portal to populate the live feed.";
      return;
    }
    element.textContent = `Last refreshed ${formatRelativeDate(iso)}`;
  }

  async function refreshJobs(button) {
    const status = document.getElementById("jobs-last-updated");
    if (button) button.disabled = true;
    if (status) {
      status.textContent = "Refreshing live feeds…";
    }

    const config = data.getAggregatorConfig();
    const hasJSearch = config.includeSources?.jsearch && config.jsearchKey;
    const hasSowal = config.includeSources?.sowal && config.sowalFeed;
    const hasProxy = Boolean(config.proxyEndpoint);
    if (!hasJSearch && !hasSowal && !hasProxy) {
      if (status) {
        status.textContent = "Add a JSearch API key, SoWal feed, or proxy endpoint in the admin portal to refresh jobs.";
      }
      if (button) button.disabled = false;
      return;
    }

    try {
      const state = await data.fetchAggregatedJobs(config);
      currentJobs = state.jobs || [];
      updateLastUpdated(state.updatedAt);
      applyFilters();
    } catch (error) {
      console.warn("Unable to refresh jobs", error);
      if (status) {
        status.textContent = "Refresh failed. Check your network or API credentials.";
      }
    } finally {
      if (button) button.disabled = false;
    }
  }

  function syncFromStorage(event) {
    if (!event || !event.key) return;
    if (event.key === "hire30a-aggregated") {
      const state = data.getJobState();
      currentJobs = state.jobs || [];
      updateLastUpdated(state.updatedAt);
      applyFilters();
    }
  }

  const filters = {
    search: "",
    location: "",
    category: "",
    source: "",
    posted: "",
  };

  let currentJobs = [];

  document.addEventListener("DOMContentLoaded", () => {
    const state = data.getJobState();
    currentJobs = state.jobs || [];
    updateLastUpdated(state.updatedAt);
    updateStats(currentJobs);
    renderJobs(currentJobs);
    setText("year", new Date().getFullYear());

    const form = document.getElementById("job-filter");
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        filters.search = (formData.get("search") || "").toString().trim();
        filters.location = (formData.get("location") || "").toString().trim();
        filters.category = (formData.get("category") || "").toString().trim();
        filters.source = (formData.get("source") || "").toString().trim();
        filters.posted = (formData.get("posted") || "").toString().trim();
        applyFilters();
      });

      form.addEventListener("reset", () => {
        filters.search = "";
        filters.location = "";
        filters.category = "";
        filters.source = "";
        filters.posted = "";
        window.setTimeout(() => applyFilters(), 0);
      });
    }

    const refreshButton = document.getElementById("job-refresh");
    if (refreshButton) {
      refreshButton.addEventListener("click", () => refreshJobs(refreshButton));
    }

    window.addEventListener("storage", syncFromStorage);
  });
})();
