(function () {
  const data = window.Hire30AData;
  if (!data) return;

  function formatDate(iso) {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function createList(items) {
    if (!items || !items.length) return null;
    const list = document.createElement("ul");
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
    return list;
  }

  function buildSeekerSummary(profile) {
    const lines = [];
    lines.push(`${profile.fullName} — ${profile.headline}`);
    lines.push(`Based in ${profile.location}. Availability: ${profile.availability || ""}`.trim());
    if (profile.skills?.length) {
      lines.push(`Top skills: ${profile.skills.join(", ")}`);
    }
    if (profile.experience) {
      lines.push(`Experience: ${profile.experience}`);
    }
    if (profile.bio) {
      lines.push(`About: ${profile.bio}`);
    }
    lines.push(`Contact: ${profile.email}${profile.phone ? ` | ${profile.phone}` : ""}`);
    if (profile.website) lines.push(`Website: ${profile.website}`);
    if (profile.linkedin) lines.push(`LinkedIn: ${profile.linkedin}`);
    if (profile.instagram) lines.push(`Social: ${profile.instagram}`);
    return lines.filter(Boolean).join("\n");
  }

  function buildEmployerSummary(profile) {
    const lines = [];
    lines.push(`${profile.businessName} — ${profile.tagline}`);
    lines.push(`Located in ${profile.location}${profile.neighborhoods ? ` | Also hiring in ${profile.neighborhoods}` : ""}`);
    if (profile.roles) lines.push(`Hiring for: ${profile.roles}`);
    if (profile.perks) lines.push(`Perks: ${profile.perks}`);
    if (profile.culture) lines.push(`Culture: ${profile.culture}`);
    if (profile.description) lines.push(`About: ${profile.description}`);
    if (profile.compensation) lines.push(`Compensation: ${profile.compensation}`);
    if (profile.notes) lines.push(`Notes: ${profile.notes}`);
    lines.push(`Contact: ${profile.contactName || "Hiring"} • ${profile.email}${profile.phone ? ` | ${profile.phone}` : ""}`);
    if (profile.website) lines.push(`Website: ${profile.website}`);
    if (profile.linkedin) lines.push(`Careers: ${profile.linkedin}`);
    if (profile.instagram) lines.push(`Social: ${profile.instagram}`);
    return lines.filter(Boolean).join("\n");
  }

  function downloadJSON(profile, type) {
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = `${type}-${profile.id || Date.now()}.json`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return Promise.resolve();
  }

  function renderProfiles(type, profiles, selectedId) {
    const preview = document.getElementById(`${type}-preview`);
    const empty = document.getElementById(`${type}-empty`);
    if (!preview) return;

    preview.innerHTML = "";

    if (!profiles.length) {
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;

    profiles.forEach((profile) => {
      const card = document.createElement("article");
      card.className = "resume-card";
      card.dataset.profileId = profile.id;
      if (profile.id === selectedId) {
        card.classList.add("is-active");
      }

      const title = document.createElement("h3");
      title.textContent = type === "seeker" ? profile.fullName : profile.businessName;
      card.appendChild(title);

      const subtitle = document.createElement("p");
      subtitle.className = "form-footnote";
      subtitle.textContent = type === "seeker" ? profile.headline : profile.tagline;
      card.appendChild(subtitle);

      const location = document.createElement("p");
      location.className = "form-footnote";
      const locationParts = [];
      if (profile.location) locationParts.push(profile.location);
      if (type === "seeker" && profile.availability) locationParts.push(profile.availability);
      if (type === "employer" && profile.neighborhoods) locationParts.push(`Also hiring in ${profile.neighborhoods}`);
      location.textContent = locationParts.join(" • ");
      card.appendChild(location);

      if (type === "seeker" && profile.skills?.length) {
        const list = createList(profile.skills.slice(0, 6));
        if (list) {
          card.appendChild(list);
        }
      }

      if (type === "employer" && profile.categories) {
        const categories = data.parseSkills(profile.categories).slice(0, 6);
        const list = createList(categories);
        if (list) {
          card.appendChild(list);
        }
      }

      if (profile.publish) {
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = "Opted into community";
        card.appendChild(badge);
      }

      const footer = document.createElement("div");
      footer.className = "job-actions";
      const selectBtn = document.createElement("button");
      selectBtn.type = "button";
      selectBtn.className = "button button-outline";
      selectBtn.textContent = "Set active";
      selectBtn.dataset.action = "select";
      selectBtn.dataset.id = profile.id;

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "button button-outline";
      deleteBtn.textContent = "Remove";
      deleteBtn.dataset.action = "delete";
      deleteBtn.dataset.id = profile.id;

      footer.appendChild(selectBtn);
      footer.appendChild(deleteBtn);
      card.appendChild(footer);

      if (profile.createdAt) {
        const created = document.createElement("p");
        created.className = "form-footnote";
        created.textContent = `Updated ${formatDate(profile.createdAt)}`;
        card.appendChild(created);
      }

      preview.appendChild(card);
    });
  }

  function initProfileBuilder(form) {
    const type = form.dataset.profileType === "employer" ? "employer" : "seeker";
    const status = document.getElementById(`${type}-status`) || document.getElementById("talent-status");
    const exportBtn = document.querySelector("[data-export-profile]");
    const copyBtn = document.querySelector("[data-copy-profile]");
    let selectedProfileId = null;

    function getProfiles() {
      return data.getProfiles(type);
    }

    function getActiveProfile() {
      const profiles = getProfiles();
      return profiles.find((profile) => profile.id === selectedProfileId) || profiles[0] || null;
    }

    function setStatus(message, isError) {
      if (!status) return;
      status.textContent = message;
      status.classList.toggle("error", Boolean(isError));
    }

    function syncPreview() {
      const profiles = getProfiles();
      if (!profiles.length) {
        selectedProfileId = null;
      } else if (!selectedProfileId) {
        selectedProfileId = profiles[0].id;
      }
      renderProfiles(type, profiles, selectedProfileId);
    }

    syncPreview();

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const base = {
        publish: Boolean(formData.get("publish")),
        createdAt: new Date().toISOString(),
      };

      let profile;

      if (type === "seeker") {
        profile = {
          ...base,
          fullName: (formData.get("fullName") || "").toString().trim(),
          headline: (formData.get("headline") || "").toString().trim(),
          location: (formData.get("location") || "").toString().trim(),
          email: (formData.get("email") || "").toString().trim(),
          phone: (formData.get("phone") || "").toString().trim(),
          website: (formData.get("website") || "").toString().trim(),
          linkedin: (formData.get("linkedin") || "").toString().trim(),
          instagram: (formData.get("instagram") || "").toString().trim(),
          availability: (formData.get("availability") || "").toString().trim(),
          compensation: (formData.get("compensation") || "").toString().trim(),
          neighborhoods: (formData.get("neighborhoods") || "").toString().trim(),
          photo: (formData.get("photo") || "").toString().trim(),
          video: (formData.get("video") || "").toString().trim(),
          experience: (formData.get("experience") || "").toString().trim(),
          skills: data.parseSkills((formData.get("skills") || "").toString()),
          bio: (formData.get("bio") || "").toString().trim(),
        };
      } else {
        profile = {
          ...base,
          businessName: (formData.get("businessName") || "").toString().trim(),
          tagline: (formData.get("tagline") || "").toString().trim(),
          location: (formData.get("location") || "").toString().trim(),
          neighborhoods: (formData.get("neighborhoods") || "").toString().trim(),
          contactName: (formData.get("contactName") || "").toString().trim(),
          email: (formData.get("email") || "").toString().trim(),
          phone: (formData.get("phone") || "").toString().trim(),
          website: (formData.get("website") || "").toString().trim(),
          linkedin: (formData.get("linkedin") || "").toString().trim(),
          instagram: (formData.get("instagram") || "").toString().trim(),
          photo: (formData.get("photo") || "").toString().trim(),
          video: (formData.get("video") || "").toString().trim(),
          description: (formData.get("description") || "").toString().trim(),
          culture: (formData.get("culture") || "").toString().trim(),
          perks: (formData.get("perks") || "").toString().trim(),
          roles: (formData.get("roles") || "").toString().trim(),
          compensation: (formData.get("compensation") || "").toString().trim(),
          notes: (formData.get("notes") || "").toString().trim(),
          categories: (formData.get("categories") || "").toString().trim(),
        };
      }

      const requiredFields = type === "seeker"
        ? [profile.fullName, profile.headline, profile.location, profile.email, profile.availability, profile.experience]
        : [profile.businessName, profile.tagline, profile.location, profile.contactName, profile.email, profile.roles];

      if (requiredFields.some((value) => !value)) {
        setStatus("Please complete all required fields.", true);
        return;
      }

      const saved = data.addProfile(type, profile);
      selectedProfileId = saved.id;
      setStatus("Profile saved locally.");
      syncPreview();
      form.reset();
    });

    const preview = document.getElementById(`${type}-preview`);
    if (preview) {
      preview.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const action = target.dataset.action;
        const id = target.dataset.id;
        if (!action || !id) return;

        if (action === "select") {
          selectedProfileId = id;
          syncPreview();
          setStatus("Profile selected for export.");
        }

        if (action === "delete") {
          data.removeProfile(type, id);
          if (selectedProfileId === id) {
            selectedProfileId = null;
          }
          setStatus("Profile removed.");
          syncPreview();
        }
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const profile = getActiveProfile();
        if (!profile) {
          setStatus("Save a profile before exporting.", true);
          return;
        }
        downloadJSON(profile, type);
        setStatus("Profile exported as JSON.");
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const profile = getActiveProfile();
        if (!profile) {
          setStatus("Save a profile before copying.", true);
          return;
        }
        const summary = type === "seeker" ? buildSeekerSummary(profile) : buildEmployerSummary(profile);
        copyToClipboard(summary).then(() => setStatus("Profile summary copied."));
      });
    }

    window.addEventListener("storage", (event) => {
      if (event.key === "hire30a-profiles-seekers" && type === "seeker") {
        syncPreview();
      }
      if (event.key === "hire30a-profiles-employers" && type === "employer") {
        syncPreview();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("[data-profile-form]");
    if (!form) return;
    initProfileBuilder(form);
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  });
})();
