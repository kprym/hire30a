(function () {
  const data = window.Hire30A || null;
  if (!data) return;

  const filterForm = document.getElementById('job-filter');
  const resultsContainer = document.getElementById('job-results');
  const emptyState = document.getElementById('jobs-empty');
  const totalEl = document.getElementById('jobs-total');
  const communityEl = document.getElementById('jobs-community');
  const previewEl = document.getElementById('jobs-preview');
  const shareForm = document.getElementById('job-share-form');
  const shareSuccess = document.getElementById('job-success');

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

  function formatNumber(value) {
    return Number(value || 0).toLocaleString();
  }

  function renderJobs(jobs) {
    if (!resultsContainer) return;
    resultsContainer.innerHTML = '';
    if (!jobs.length) {
      if (emptyState) emptyState.hidden = false;
      if (totalEl) totalEl.textContent = formatNumber(0);
      return;
    }

    if (emptyState) emptyState.hidden = true;

    jobs.forEach((job) => {
      const card = document.createElement('article');
      card.className = 'job-card';
      card.setAttribute('role', 'listitem');

      const header = document.createElement('header');
      const title = document.createElement('h3');
      title.textContent = job.title || 'Hospitality role';
      header.appendChild(title);

      const company = document.createElement('p');
      company.className = 'form-footnote';
      company.textContent = job.company || 'Local business';
      header.appendChild(company);

      const meta = document.createElement('div');
      meta.className = 'job-meta';
      if (job.area) meta.appendChild(createMetaChip(job.area));
      if (job.category) meta.appendChild(createMetaChip(job.category));
      if (job.type) meta.appendChild(createMetaChip(job.type));
      if (!job.sample && job.createdAt) {
        meta.appendChild(createMetaChip(`Added ${formatDate(job.createdAt)}`));
      }
      header.appendChild(meta);

      if (job.sample) {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = 'Sample preview';
        header.appendChild(badge);
      } else {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = 'Community submission';
        header.appendChild(badge);
      }

      card.appendChild(header);

      if (job.description) {
        const description = document.createElement('p');
        description.textContent = job.description;
        card.appendChild(description);
      }

      if (!job.sample) {
        const contact = document.createElement('p');
        contact.className = 'form-footnote';
        if (job.email || job.link) {
          contact.textContent = 'Connect: ';
          const fragments = [];
          if (job.email) {
            const mail = document.createElement('a');
            mail.href = `mailto:${job.email}`;
            mail.textContent = job.email;
            fragments.push(mail);
          }
          if (job.link) {
            const anchor = document.createElement('a');
            anchor.href = job.link;
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            anchor.textContent = 'Apply link';
            fragments.push(anchor);
          }
          fragments.forEach((element, index) => {
            if (index > 0) contact.append(' · ');
            contact.appendChild(element);
          });
        } else {
          contact.textContent = 'Connect: Details shared privately with the Hire30A team.';
        }
        card.appendChild(contact);
      }

      resultsContainer.appendChild(card);
    });

    if (totalEl) {
      totalEl.textContent = formatNumber(jobs.length);
    }
  }

  function createMetaChip(text) {
    const span = document.createElement('span');
    span.textContent = text;
    return span;
  }

  function matchFilter(job, filters) {
    const search = filters.search;
    if (search) {
      const haystack = `${job.title || ''} ${job.company || ''} ${job.description || ''}`.toLowerCase();
      if (!haystack.includes(search.toLowerCase())) {
        return false;
      }
    }
    if (filters.area && job.area !== filters.area) return false;
    if (filters.category && job.category !== filters.category) return false;
    if (filters.type && job.type !== filters.type) return false;
    return true;
  }

  function applyFilters() {
    const formData = filterForm ? new FormData(filterForm) : null;
    const filters = {
      search: formData ? (formData.get('search') || '').toString().trim() : '',
      area: formData ? (formData.get('area') || '').toString() : '',
      category: formData ? (formData.get('category') || '').toString() : '',
      type: formData ? (formData.get('type') || '').toString() : '',
    };

    const allJobs = data.getJobs(true);
    const filtered = allJobs.filter((job) => matchFilter(job, filters));
    renderJobs(filtered);

    const communityCount = data.getJobs(false).length;
    if (communityEl) communityEl.textContent = formatNumber(communityCount);

    const previewCount = allJobs.filter((job) => job.sample).length;
    if (previewEl) previewEl.textContent = formatNumber(previewCount);

    if (!filtered.length && emptyState) {
      emptyState.hidden = false;
    }
  }

  function handleFilterForm() {
    if (!filterForm) return;
    filterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      applyFilters();
    });
    filterForm.addEventListener('reset', () => {
      window.setTimeout(applyFilters, 0);
    });
  }

  function handleShareForm() {
    if (!shareForm) return;
    shareForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(shareForm);
      const payload = {
        company: formData.get('company')?.toString().trim(),
        title: formData.get('title')?.toString().trim(),
        area: formData.get('area')?.toString().trim(),
        category: formData.get('category')?.toString().trim(),
        type: formData.get('type')?.toString().trim(),
        email: formData.get('email')?.toString().trim(),
        description: formData.get('description')?.toString().trim(),
        link: formData.get('link')?.toString().trim(),
      };

      if (!payload.company || !payload.title || !payload.area || !payload.category || !payload.type || !payload.email || !payload.description) {
        return;
      }

      data.addJob(payload);
      shareForm.reset();
      if (shareSuccess) {
        shareSuccess.classList.add('is-visible');
      }
      applyFilters();
    });

    if (shareForm && shareSuccess) {
      shareForm.querySelectorAll('input, textarea, select').forEach((element) => {
        element.addEventListener('input', () => shareSuccess.classList.remove('is-visible'));
        element.addEventListener('change', () => shareSuccess.classList.remove('is-visible'));
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyFilters();
    handleFilterForm();
    handleShareForm();
  });
})();
