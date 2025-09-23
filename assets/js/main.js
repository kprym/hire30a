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
