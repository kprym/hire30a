(function () {
  const data = window.Hire30A || null;
  if (!data) return;

  function formatNumber(value) {
    return Number(value || 0).toLocaleString();
  }

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function parseList(value) {
    if (!value) return [];
    return value
      .toString()
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function renderTalent() {
    const container = document.querySelector('[data-profile-list="talent"]');
    if (!container) return;
    const empty = document.querySelector('[data-profile-empty="talent"]');
    const profiles = data.getTalent(true);

    container.innerHTML = '';
    if (!profiles.length) {
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    profiles.forEach((profile) => {
      const card = document.createElement('article');
      card.className = 'profile-card';

      const header = document.createElement('header');
      const title = document.createElement('h3');
      title.textContent = profile.name || profile.fullName || 'Hospitality talent';
      header.appendChild(title);

      if (profile.headline) {
        const subtitle = document.createElement('p');
        subtitle.className = 'form-footnote';
        subtitle.textContent = profile.headline;
        header.appendChild(subtitle);
      }

      const meta = document.createElement('div');
      meta.className = 'profile-meta';
      if (profile.location) meta.appendChild(createMetaChip(profile.location));
      if (profile.availability) meta.appendChild(createMetaChip(profile.availability));
      if (!profile.sample && profile.createdAt) meta.appendChild(createMetaChip(`Added ${formatDate(profile.createdAt)}`));
      header.appendChild(meta);

      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = profile.sample ? 'Sample preview' : 'Community submission';
      header.appendChild(badge);

      card.appendChild(header);

      if (profile.experience) {
        const body = document.createElement('p');
        body.textContent = profile.experience;
        card.appendChild(body);
      }

      const highlights = profile.highlights || [];
      if (highlights.length) {
        const list = document.createElement('ul');
        highlights.forEach((item) => {
          const li = document.createElement('li');
          li.textContent = item;
          list.appendChild(li);
        });
        card.appendChild(list);
      }

      if (!profile.sample && (profile.email || profile.phone)) {
        const contact = document.createElement('p');
        contact.className = 'form-footnote';
        const fragments = [];
        if (profile.email) {
          const emailLink = document.createElement('a');
          emailLink.href = `mailto:${profile.email}`;
          emailLink.textContent = profile.email;
          fragments.push(emailLink);
        }
        if (profile.phone) {
          const phoneLink = document.createElement('a');
          phoneLink.href = `tel:${profile.phone}`;
          phoneLink.textContent = profile.phone;
          fragments.push(phoneLink);
        }
        if (fragments.length) {
          contact.textContent = 'Connect: ';
          fragments.forEach((element, index) => {
            if (index > 0) contact.append(' · ');
            contact.appendChild(element);
          });
        }
        card.appendChild(contact);
      }

      container.appendChild(card);
    });
  }

  function renderEmployers() {
    const container = document.querySelector('[data-profile-list="employer"]');
    if (!container) return;
    const empty = document.querySelector('[data-profile-empty="employer"]');
    const profiles = data.getEmployers(true);

    container.innerHTML = '';
    if (!profiles.length) {
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    profiles.forEach((profile) => {
      const card = document.createElement('article');
      card.className = 'profile-card';

      const header = document.createElement('header');
      const title = document.createElement('h3');
      title.textContent = profile.name || profile.businessName || 'Coastal employer';
      header.appendChild(title);

      if (profile.tagline) {
        const subtitle = document.createElement('p');
        subtitle.className = 'form-footnote';
        subtitle.textContent = profile.tagline;
        header.appendChild(subtitle);
      }

      const meta = document.createElement('div');
      meta.className = 'profile-meta';
      if (profile.location) meta.appendChild(createMetaChip(profile.location));
      if (!profile.sample && profile.createdAt) meta.appendChild(createMetaChip(`Added ${formatDate(profile.createdAt)}`));
      header.appendChild(meta);

      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = profile.sample ? 'Sample preview' : 'Community submission';
      header.appendChild(badge);

      card.appendChild(header);

      if (profile.focus) {
        const focus = document.createElement('p');
        focus.textContent = profile.focus;
        card.appendChild(focus);
      }

      const perks = profile.perks || [];
      if (perks.length) {
        const list = document.createElement('ul');
        perks.forEach((perk) => {
          const li = document.createElement('li');
          li.textContent = perk;
          list.appendChild(li);
        });
        card.appendChild(list);
      }

      if (!profile.sample && (profile.email || profile.phone || profile.website || profile.social)) {
        const contact = document.createElement('p');
        contact.className = 'form-footnote';
        contact.textContent = 'Connect: ';
        const fragments = [];
        if (profile.email) {
          const emailLink = document.createElement('a');
          emailLink.href = `mailto:${profile.email}`;
          emailLink.textContent = profile.email;
          fragments.push(emailLink);
        }
        if (profile.phone) {
          const phoneLink = document.createElement('a');
          phoneLink.href = `tel:${profile.phone}`;
          phoneLink.textContent = profile.phone;
          fragments.push(phoneLink);
        }
        if (profile.website) {
          const websiteLink = document.createElement('a');
          websiteLink.href = profile.website;
          websiteLink.target = '_blank';
          websiteLink.rel = 'noopener noreferrer';
          websiteLink.textContent = 'Website';
          fragments.push(websiteLink);
        }
        if (profile.social) {
          const socialLink = document.createElement('a');
          socialLink.href = profile.social.startsWith('http') ? profile.social : `https://instagram.com/${profile.social.replace(/@/g, '')}`;
          socialLink.target = '_blank';
          socialLink.rel = 'noopener noreferrer';
          socialLink.textContent = 'Social';
          fragments.push(socialLink);
        }
        fragments.forEach((element, index) => {
          if (index > 0) contact.append(' · ');
          contact.appendChild(element);
        });
        card.appendChild(contact);
      }

      container.appendChild(card);
    });
  }

  function createMetaChip(text) {
    const span = document.createElement('span');
    span.textContent = text;
    return span;
  }

  function updateCounts() {
    const talentCommunity = data.getTalent(false).length;
    const talentPreview = data.getTalent(true).filter((profile) => profile.sample).length;
    const employerCommunity = data.getEmployers(false).length;
    const employerPreview = data.getEmployers(true).filter((profile) => profile.sample).length;

    const talentCountEl = document.getElementById('talent-count');
    if (talentCountEl) talentCountEl.textContent = formatNumber(talentCommunity);
    const talentPreviewEl = document.getElementById('talent-preview');
    if (talentPreviewEl) talentPreviewEl.textContent = formatNumber(talentPreview);

    const employerCountEl = document.getElementById('employer-count');
    if (employerCountEl) employerCountEl.textContent = formatNumber(employerCommunity);
    const employerPreviewEl = document.getElementById('employer-preview');
    if (employerPreviewEl) employerPreviewEl.textContent = formatNumber(employerPreview);
  }

  function handleForms() {
    document.querySelectorAll('[data-profile-form]').forEach((form) => {
      const type = form.getAttribute('data-profile-form');
      const success = document.querySelector(`[data-profile-success="${type}"]`);

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);

        if (type === 'talent') {
          const payload = {
            name: formData.get('name')?.toString().trim(),
            headline: formData.get('headline')?.toString().trim(),
            location: formData.get('location')?.toString().trim(),
            availability: formData.get('availability')?.toString().trim(),
            email: formData.get('email')?.toString().trim(),
            phone: formData.get('phone')?.toString().trim(),
            experience: formData.get('experience')?.toString().trim(),
            highlights: parseList(formData.get('strengths')),
          };
          if (!payload.name || !payload.headline || !payload.location || !payload.availability || !payload.email || !payload.experience) {
            return;
          }
          data.addTalent(payload);
        } else {
          const payload = {
            name: formData.get('name')?.toString().trim(),
            tagline: formData.get('tagline')?.toString().trim(),
            location: formData.get('location')?.toString().trim(),
            contact: formData.get('contact')?.toString().trim(),
            email: formData.get('email')?.toString().trim(),
            phone: formData.get('phone')?.toString().trim(),
            focus: formData.get('focus')?.toString().trim(),
            perks: parseList(formData.get('perks')),
            website: formData.get('website')?.toString().trim(),
            social: formData.get('social')?.toString().trim(),
          };
          if (!payload.name || !payload.tagline || !payload.location || !payload.contact || !payload.email || !payload.focus) {
            return;
          }
          data.addEmployer(payload);
        }

        form.reset();
        if (success) {
          success.classList.add('is-visible');
        }
        renderTalent();
        renderEmployers();
        updateCounts();
      });

      if (success) {
        form.querySelectorAll('input, textarea, select').forEach((element) => {
          element.addEventListener('input', () => success.classList.remove('is-visible'));
          element.addEventListener('change', () => success.classList.remove('is-visible'));
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderTalent();
    renderEmployers();
    updateCounts();
    handleForms();
  });
})();
