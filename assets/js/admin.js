(function () {
  const data = window.Hire30AData;
  if (!data) return;

  const STORAGE_KEYS = {
    jobs: "hire30a-aggregated",
    seekers: "hire30a-profiles-seekers",
    employers: "hire30a-profiles-employers",
    settings: "hire30a-settings",
  };

  function downloadJSON(filename, payload) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function formatDate(iso) {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function formatRelative(iso) {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    const diff = Date.now() - date.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    if (days < 1) {
      const hours = Math.round(diff / (1000 * 60 * 60));
      if (hours <= 1) return "within the last hour";
      return `${hours} hours ago`;
    }
    const rounded = Math.round(days);
    return `${rounded} day${rounded === 1 ? "" : "s"} ago`;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function refreshMetrics() {
    const jobState = data.getJobState();
    const jobsCount = jobState.jobs?.length || 0;
    const seekers = data.getProfiles("seeker");
    const employers = data.getProfiles("employer");
    const seekersPublished = seekers.filter((profile) => profile.publish).length;
    const employersPublished = employers.filter((profile) => profile.publish).length;

    setText("admin-jobs-count", jobsCount.toString());
    setText("admin-seekers-count", seekersPublished.toString());
    setText("admin-employers-count", employersPublished.toString());
  }

  function renderJobsTable() {
    const tbody = document.getElementById("admin-jobs-body");
    if (!tbody) return;
    const jobState = data.getJobState();
    const jobs = jobState.jobs || [];
    tbody.innerHTML = "";
    if (!jobs.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 5;
      cell.textContent = "No jobs stored yet. Refresh the aggregator to load live data.";
      row.appendChild(cell);
      tbody.appendChild(row);
      return;
    }

    jobs.slice(0, 25).forEach((job) => {
      const row = document.createElement("tr");
      const title = document.createElement("td");
      title.textContent = job.title || "Untitled";
      const company = document.createElement("td");
      company.textContent = job.company || "";
      const location = document.createElement("td");
      location.textContent = job.location || "";
      const source = document.createElement("td");
      source.textContent = job.source || "";
      const updated = document.createElement("td");
      updated.textContent = job.postedAt ? formatRelative(job.postedAt) : "";

      row.appendChild(title);
      row.appendChild(company);
      row.appendChild(location);
      row.appendChild(source);
      row.appendChild(updated);
      tbody.appendChild(row);
    });
  }

  function renderProfiles(type) {
    const tbody = document.getElementById(type === "seeker" ? "admin-seekers-body" : "admin-employers-body");
    if (!tbody) return;
    const profiles = data.getProfiles(type);
    tbody.innerHTML = "";
    if (!profiles.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 4;
      cell.textContent = "No profiles saved yet.";
      row.appendChild(cell);
      tbody.appendChild(row);
      return;
    }

    profiles.forEach((profile) => {
      const row = document.createElement("tr");
      const col1 = document.createElement("td");
      const col2 = document.createElement("td");
      const col3 = document.createElement("td");
      const col4 = document.createElement("td");

      if (type === "seeker") {
        col1.textContent = profile.fullName || "";
        col2.textContent = profile.headline || "";
        col3.textContent = profile.location || "";
      } else {
        col1.textContent = profile.businessName || "";
        col2.textContent = profile.tagline || "";
        col3.textContent = profile.location || "";
      }

      col4.textContent = profile.publish ? "Yes" : "No";

      row.appendChild(col1);
      row.appendChild(col2);
      row.appendChild(col3);
      row.appendChild(col4);
      tbody.appendChild(row);
    });
  }

  function populateThemeForm(settings) {
    const primary = document.getElementById("primary-color");
    const secondary = document.getElementById("secondary-color");
    const accent = document.getElementById("accent-color");
    if (primary) primary.value = settings.primaryColor;
    if (secondary) secondary.value = settings.secondaryColor;
    if (accent) accent.value = settings.accentColor;
  }

  function populateContentForm(settings) {
    const heading = document.getElementById("hero-heading-input");
    const lead = document.getElementById("hero-lead-input");
    if (heading) heading.value = settings.heroHeading || "";
    if (lead) lead.value = settings.heroLead || "";
  }

  function populateAggregatorForm(config) {
    const query = document.getElementById("agg-query");
    const location = document.getElementById("agg-location");
    const radius = document.getElementById("agg-radius");
    const max = document.getElementById("agg-max");
    const key = document.getElementById("agg-key");
    const host = document.getElementById("agg-host");
    const sowal = document.getElementById("agg-sowal");
    const proxy = document.getElementById("agg-proxy");
    const sourceJ = document.getElementById("agg-source-jsearch");
    const sourceS = document.getElementById("agg-source-sowal");
    const sourceM = document.getElementById("agg-source-manual");

    if (query) query.value = config.query || "";
    if (location) location.value = config.location || "";
    if (radius) radius.value = config.radiusMiles || "";
    if (max) max.value = config.maxResults || "";
    if (key) key.value = config.jsearchKey || "";
    if (host) host.value = config.jsearchHost || "";
    if (sowal) sowal.value = config.sowalFeed || "";
    if (proxy) proxy.value = config.proxyEndpoint || "";
    if (sourceJ) sourceJ.checked = Boolean(config.includeSources?.jsearch);
    if (sourceS) sourceS.checked = Boolean(config.includeSources?.sowal);
    if (sourceM) sourceM.checked = Boolean(config.includeSources?.manual);
  }

  async function handleRefreshJobs(button, statusElement) {
    if (button) button.disabled = true;
    if (statusElement) statusElement.textContent = "Refreshing jobs…";
    const config = data.getAggregatorConfig();
    const hasJSearch = config.includeSources?.jsearch && config.jsearchKey;
    const hasSowal = config.includeSources?.sowal && config.sowalFeed;
    const hasProxy = Boolean(config.proxyEndpoint);
    if (!hasJSearch && !hasSowal && !hasProxy) {
      if (statusElement) statusElement.textContent = "Add a JSearch key, SoWal feed, or proxy endpoint in aggregation settings.";
      if (button) button.disabled = false;
      return;
    }
    try {
      const state = await data.fetchAggregatedJobs(config);
      if (statusElement) {
        const count = state.jobs?.length || 0;
        statusElement.textContent = `Fetched ${count} roles (${Object.keys(state.sourceSummary || {}).join(", ") || "sources"}).`;
      }
      refreshMetrics();
      renderJobsTable();
    } catch (error) {
      console.warn("Admin refresh failed", error);
      if (statusElement) statusElement.textContent = "Refresh failed. Check credentials or network.";
    } finally {
      if (button) button.disabled = false;
    }
  }

  function gateAccess() {
    const gate = document.querySelector("[data-admin-gate]");
    const shell = document.querySelector("[data-admin-shell]");
    const form = document.getElementById("gate-form");
    const message = document.getElementById("gate-message");

    if (!form || !shell || !gate) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const passInput = document.getElementById("gate-passcode");
      const passcode = passInput ? passInput.value : "";
      const valid = await data.verifyPasscode(passcode);
      if (!valid) {
        if (message) message.textContent = "Incorrect passcode.";
        if (passInput) passInput.value = "";
        return;
      }
      gate.remove();
      shell.hidden = false;
      initAdmin();
    });
  }

  function initAdmin() {
    const settings = data.getSettings();
    data.applyBrandSettings(settings);
    populateThemeForm(settings);
    populateContentForm(settings);
    populateAggregatorForm(data.getAggregatorConfig());
    refreshMetrics();
    renderJobsTable();
    renderProfiles("seeker");
    renderProfiles("employer");
    setText("admin-year", new Date().getFullYear());

    const themeForm = document.getElementById("theme-form");
    const resetTheme = document.getElementById("reset-theme");
    if (themeForm) {
      themeForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(themeForm);
        const next = data.saveSettings({
          primaryColor: formData.get("primaryColor"),
          secondaryColor: formData.get("secondaryColor"),
          accentColor: formData.get("accentColor"),
        });
        data.applyBrandSettings(next);
      });
    }
    if (resetTheme) {
      resetTheme.addEventListener("click", () => {
        const next = data.saveSettings(data.defaultSettings);
        populateThemeForm(next);
        data.applyBrandSettings(next);
      });
    }

    const contentForm = document.getElementById("content-form");
    const resetContent = document.getElementById("reset-content");
    if (contentForm) {
      contentForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(contentForm);
        data.saveSettings({
          heroHeading: formData.get("heroHeading"),
          heroLead: formData.get("heroLead"),
        });
      });
    }
    if (resetContent) {
      resetContent.addEventListener("click", () => {
        const defaults = data.defaultSettings;
        data.saveSettings(defaults);
        populateContentForm(defaults);
      });
    }

    const aggregatorForm = document.getElementById("aggregator-form");
    const aggregatorStatus = document.getElementById("aggregator-status");
    if (aggregatorForm) {
      aggregatorForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(aggregatorForm);
        const includeSources = {
          jsearch: aggregatorForm.querySelector("#agg-source-jsearch")?.checked || false,
          sowal: aggregatorForm.querySelector("#agg-source-sowal")?.checked || false,
          manual: aggregatorForm.querySelector("#agg-source-manual")?.checked || false,
        };
        data.saveAggregatorConfig({
          query: formData.get("query"),
          location: formData.get("location"),
          radiusMiles: Number(formData.get("radiusMiles")) || 0,
          maxResults: Number(formData.get("maxResults")) || 0,
          jsearchKey: formData.get("jsearchKey"),
          jsearchHost: formData.get("jsearchHost"),
          sowalFeed: formData.get("sowalFeed"),
          proxyEndpoint: formData.get("proxyEndpoint"),
          includeSources,
        });
        if (aggregatorStatus) aggregatorStatus.textContent = "Aggregation settings saved.";
      });
    }

    const aggregatorTest = document.getElementById("aggregator-test");
    if (aggregatorTest) {
      aggregatorTest.addEventListener("click", () => {
        handleRefreshJobs(aggregatorTest, aggregatorStatus);
      });
    }

    const refreshButton = document.getElementById("admin-refresh-jobs");
    const jobsStatus = document.getElementById("admin-jobs-status");
    if (refreshButton) {
      refreshButton.addEventListener("click", () => handleRefreshJobs(refreshButton, jobsStatus));
    }

    const exportJobs = document.getElementById("admin-export-jobs");
    if (exportJobs) {
      exportJobs.addEventListener("click", () => {
        const state = data.getJobState();
        downloadJSON("hire30a-jobs.json", state);
      });
    }

    const clearJobs = document.getElementById("admin-clear-jobs");
    if (clearJobs) {
      clearJobs.addEventListener("click", () => {
        data.clearJobs();
        renderJobsTable();
        refreshMetrics();
        if (jobsStatus) jobsStatus.textContent = "Jobs cleared.";
      });
    }

    const exportSeekers = document.getElementById("admin-export-seekers");
    if (exportSeekers) {
      exportSeekers.addEventListener("click", () => {
        downloadJSON("hire30a-talent.json", data.getProfiles("seeker"));
      });
    }

    const clearSeekers = document.getElementById("admin-clear-seekers");
    if (clearSeekers) {
      clearSeekers.addEventListener("click", () => {
        data.clearProfiles("seeker");
        renderProfiles("seeker");
        refreshMetrics();
      });
    }

    const exportEmployers = document.getElementById("admin-export-employers");
    if (exportEmployers) {
      exportEmployers.addEventListener("click", () => {
        downloadJSON("hire30a-employers.json", data.getProfiles("employer"));
      });
    }

    const clearEmployers = document.getElementById("admin-clear-employers");
    if (clearEmployers) {
      clearEmployers.addEventListener("click", () => {
        data.clearProfiles("employer");
        renderProfiles("employer");
        refreshMetrics();
      });
    }

    const passForm = document.getElementById("passcode-form");
    const passStatus = document.getElementById("passcode-status");
    if (passForm) {
      passForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(passForm);
        const passcode = (formData.get("passcode") || "").toString();
        if (!passcode) {
          if (passStatus) passStatus.textContent = "Enter a new passcode.";
          return;
        }
        await data.updateAdminPass(passcode);
        passForm.reset();
        if (passStatus) passStatus.textContent = "Admin passcode updated.";
      });
    }

    window.addEventListener("storage", (event) => {
      if (!event || !event.key) return;
      switch (event.key) {
        case STORAGE_KEYS.jobs:
          refreshMetrics();
          renderJobsTable();
          break;
        case STORAGE_KEYS.seekers:
          refreshMetrics();
          renderProfiles("seeker");
          break;
        case STORAGE_KEYS.employers:
          refreshMetrics();
          renderProfiles("employer");
          break;
        case STORAGE_KEYS.settings:
          populateThemeForm(data.getSettings());
          populateContentForm(data.getSettings());
          break;
        default:
          break;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", gateAccess);
})();
