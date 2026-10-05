const languageButtons = document.querySelectorAll('[data-set-language]');
const preferredLanguage = new URLSearchParams(window.location.search).get('lang') || localStorage.getItem('portfolio-language') || 'es';

function setLanguage(language) {
  const next = language === 'en' ? 'en' : 'es';
  document.documentElement.lang = next;
  languageButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.setLanguage === next)));
  document.querySelector('meta[name="description"]').content = next === 'en'
    ? 'Ernesto Leonard Escariz, full stack developer. Web applications, automation and production business systems.'
    : 'Ernesto Leonard Escariz, desarrollador full stack. Aplicaciones web, automatización y sistemas de negocio en producción.';
  localStorage.setItem('portfolio-language', next);
  const url = new URL(window.location.href);
  if (next === 'en') url.searchParams.set('lang', 'en');
  else url.searchParams.delete('lang');
  history.replaceState(null, '', url);
}

languageButtons.forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.setLanguage)));
setLanguage(preferredLanguage);
document.getElementById('year').textContent = String(new Date().getFullYear());
