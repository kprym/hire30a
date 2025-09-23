(function () {
  const data = window.Hire30A || null;
  if (!data) return;

  const PASSCODE = 'emeraldcoast';

  const loginCard = document.getElementById('admin-login');
  const panelCard = document.getElementById('admin-panel');
  const accessForm = document.getElementById('admin-access-form');
  const passcodeInput = document.getElementById('admin-passcode');
  const errorMessage = document.getElementById('admin-error');
  const brandingForm = document.getElementById('branding-form');
  const brandingSuccess = document.getElementById('branding-success');

  function formatNumber(value) {
    return Number(value || 0).toLocaleString();
  }

  function showError(show) {
    if (!errorMessage) return;
    errorMessage.classList.toggle('is-visible', Boolean(show));
  }

  function showBrandingSuccess(show) {
    if (!brandingSuccess) return;
    brandingSuccess.classList.toggle('is-visible', Boolean(show));
  }

  function unlockAdmin() {
    if (loginCard) loginCard.hidden = true;
    if (panelCard) panelCard.hidden = false;
    populateBranding();
    updateOverview();
    attachExportHandlers();
    attachClearHandlers();
  }

  function populateBranding() {
    if (!brandingForm) return;
    const settings = data.getSettings();
    const primary = brandingForm.querySelector('#brand-primary');
    const accent = brandingForm.querySelector('#brand-accent');
    const heroHeading = brandingForm.querySelector('#hero-heading-input');
    const heroSubheading = brandingForm.querySelector('#hero-subheading-input');

    if (primary && settings.primaryColor) primary.value = settings.primaryColor;
    if (accent && settings.accentColor) accent.value = settings.accentColor;
    if (heroHeading && settings.heroHeading) heroHeading.value = settings.heroHeading;
    if (heroSubheading && settings.heroSubheading) heroSubheading.value = settings.heroSubheading;
  }

  function updateOverview() {
    const jobs = data.getJobs(true);
    const jobSubmissions = data.getJobs(false).length;
    const jobPreview = jobs.filter((item) => item.sample).length;

    const talent = data.getTalent(true);
    const talentSubmissions = data.getTalent(false).length;
    const talentPreview = talent.filter((item) => item.sample).length;

    const employers = data.getEmployers(true);
    const employerSubmissions = data.getEmployers(false).length;
    const employerPreview = employers.filter((item) => item.sample).length;

    const newsletterCount = data.getNewsletter().length;

    const counts = {
      'admin-count-jobs': jobSubmissions,
      'admin-preview-jobs': jobPreview,
      'admin-count-talent': talentSubmissions,
      'admin-preview-talent': talentPreview,
      'admin-count-employers': employerSubmissions,
      'admin-preview-employers': employerPreview,
      'admin-count-newsletter': newsletterCount,
    };

    Object.entries(counts).forEach(([id, value]) => {
      const target = document.getElementById(id);
      if (target) target.textContent = formatNumber(value);
    });
  }

  function attachExportHandlers() {
    document.querySelectorAll('[data-export]').forEach((button) => {
      button.addEventListener('click', () => {
        const type = button.getAttribute('data-export');
        const payload = data.exportData();
        let dataToDownload = null;
        switch (type) {
          case 'jobs':
            dataToDownload = payload.jobs;
            break;
          case 'talent':
            dataToDownload = payload.talent;
            break;
          case 'employers':
            dataToDownload = payload.employers;
            break;
          case 'newsletter':
            dataToDownload = payload.newsletter;
            break;
          default:
            dataToDownload = null;
        }
        if (!dataToDownload) return;
        const fileName = `hire30a-${type}-${new Date().toISOString().slice(0, 10)}.json`;
        downloadJSON(dataToDownload, fileName);
      });
    });
  }

  function attachClearHandlers() {
    document.querySelectorAll('[data-clear]').forEach((button) => {
      button.addEventListener('click', () => {
        const type = button.getAttribute('data-clear');
        const confirmed = window.confirm('Clear submissions from this device? This action cannot be undone.');
        if (!confirmed) return;
        data.clearCollection(type);
        updateOverview();
      });
    });
  }

  function downloadJSON(content, filename) {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handleBrandingForm() {
    if (!brandingForm) return;
    brandingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(brandingForm);
      const primaryColor = formData.get('primary')?.toString().trim();
      const accentColor = formData.get('accent')?.toString().trim();
      const heroHeading = formData.get('heroHeading')?.toString().trim();
      const heroSubheading = formData.get('heroSubheading')?.toString().trim();
      data.saveSettings({ primaryColor, accentColor, heroHeading, heroSubheading });
      data.applyBranding();
      showBrandingSuccess(true);
      window.setTimeout(() => showBrandingSuccess(false), 3000);
    });
  }

  function handleLogin() {
    if (!accessForm) return;
    accessForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = passcodeInput?.value?.trim() || '';
      if (input.toLowerCase() === PASSCODE) {
        showError(false);
        unlockAdmin();
        if (passcodeInput) passcodeInput.value = '';
      } else {
        showError(true);
      }
    });

    if (passcodeInput) {
      passcodeInput.addEventListener('input', () => showError(false));
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    handleLogin();
    handleBrandingForm();
  });
})();
