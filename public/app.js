const jobsEl = document.getElementById('jobs');
const statsEl = document.getElementById('stats');
const filterForm = document.getElementById('filters');
const postJobForm = document.getElementById('postJobForm');
const postStatus = document.getElementById('postStatus');
const applyDialog = document.getElementById('applyDialog');
const applyForm = document.getElementById('applyForm');
const applyTitle = document.getElementById('applyTitle');
const applyStatus = document.getElementById('applyStatus');
const closeDialog = document.getElementById('closeDialog');

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || 'Request failed.');
  }
  return payload;
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function renderJobs(jobs) {
  if (!jobs.length) {
    jobsEl.innerHTML = '<p>No matching roles found right now. Try adjusting your filters.</p>';
    return;
  }

  jobsEl.innerHTML = jobs
    .map(
      (job) => `
      <article class="job-card">
        <h3>${job.title}</h3>
        <p><strong>${job.company}</strong> · ${job.location}</p>
        <div class="job-meta">
          <span class="badge">${job.type}</span>
          <span class="badge">${job.category}</span>
          <span class="badge">${job.salary}</span>
          <span>Posted ${formatDate(job.postedAt)}</span>
        </div>
        <p>${job.description}</p>
        <button data-apply-id="${job.id}" data-apply-title="${job.title} at ${job.company}">Apply</button>
      </article>
    `
    )
    .join('');
}

async function loadStats() {
  try {
    const stats = await api('/api/stats');
    statsEl.innerHTML = `
      <span class="stat">${stats.totalJobs} open roles</span>
      <span class="stat">${stats.localCompanies} local companies hiring</span>
      <span class="stat">${stats.totalApplications} applications submitted</span>
    `;
  } catch (error) {
    statsEl.innerHTML = '<span class="stat">Community stats unavailable</span>';
  }
}

async function loadJobs(formData = new FormData(filterForm)) {
  const params = new URLSearchParams();
  ['q', 'type', 'category'].forEach((field) => {
    const value = formData.get(field);
    if (value) params.append(field, value);
  });

  try {
    const jobs = await api(`/api/jobs?${params.toString()}`);
    renderJobs(jobs);
  } catch (error) {
    jobsEl.innerHTML = `<p>${error.message}</p>`;
  }
}

filterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loadJobs(new FormData(filterForm));
});

postJobForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  postStatus.textContent = 'Publishing job...';

  const payload = Object.fromEntries(new FormData(postJobForm).entries());

  try {
    await api('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    postJobForm.reset();
    postStatus.textContent = 'Job posted successfully for the 30A community.';
    await Promise.all([loadJobs(), loadStats()]);
  } catch (error) {
    postStatus.textContent = error.message;
  }
});

jobsEl.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-apply-id]');
  if (!button) return;

  applyForm.elements.jobId.value = button.dataset.applyId;
  applyTitle.textContent = `Apply: ${button.dataset.applyTitle}`;
  applyStatus.textContent = '';
  applyDialog.showModal();
});

closeDialog.addEventListener('click', () => applyDialog.close());

applyForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  applyStatus.textContent = 'Submitting application...';

  const formData = new FormData(applyForm);
  const jobId = formData.get('jobId');
  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    message: formData.get('message')
  };

  try {
    const result = await api(`/api/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    applyStatus.textContent = result.message;
    await loadStats();
    setTimeout(() => {
      applyDialog.close();
      applyForm.reset();
    }, 800);
  } catch (error) {
    applyStatus.textContent = error.message;
  }
});

loadJobs();
loadStats();
