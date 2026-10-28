(function() {
  'use strict';

  const storageKey = 'pizzaro-perfect-theme';
  let currentTheme = 'light';

  try {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') currentTheme = savedTheme;
    else if (savedTheme !== null) console.warn('Ignoring an unrecognised saved theme preference.');
  } catch (error) {
    console.error('Unable to read the saved theme preference:', error);
  }

  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = theme === 'dark' ? '#191820' : '#1B1464';
    document.querySelectorAll('[data-theme-logo]').forEach(logo => {
      logo.src = logo.dataset[theme === 'dark' ? 'darkSrc' : 'lightSrc'];
    });

    const button = document.getElementById('theme-toggle');
    if (!button) return;
    button.innerHTML = theme === 'dark'
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 15.5A8.5 8.5 0 0 1 8.5 3.6a8.6 8.6 0 1 0 11.9 11.9Z"/></svg>';
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    button.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`;
  }

  document.documentElement.dataset.theme = currentTheme;
  document.addEventListener('DOMContentLoaded', () => applyTheme(currentTheme));
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element) || !event.target.closest('#theme-toggle')) return;
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try {
      localStorage.setItem(storageKey, nextTheme);
    } catch (error) {
      console.error('Unable to save the theme preference:', error);
    }
  });
  window.addEventListener('storage', event => {
    if (event.key !== storageKey || (event.newValue !== 'light' && event.newValue !== 'dark')) return;
    applyTheme(event.newValue);
  });
})();
