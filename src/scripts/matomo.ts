// Visit counter: Matomo self-hosted on stats.vtesitaly.com (site id 1;
// judge = 2, draft = 3). disableCookies keeps it cookieless, so no consent
// banner is needed. Production only, so `npm run dev` doesn't pollute the
// stats. Matomo records document.URL, so on the 404 page the requested
// (broken) address is what gets counted.
//
// A bundled module instead of the usual inline snippet, so the CSP needs no
// 'unsafe-inline': matomo.js is then loaded from stats.vtesitaly.com, which
// script-src allows by name, and reads the queue from window._paq as usual.
type MatomoWindow = Window & { _paq?: unknown[][] };

if (import.meta.env.PROD) {
  const w = window as MatomoWindow;
  const paq = (w._paq = w._paq || []);
  paq.push(['disableCookies']);
  paq.push(['setCookieDomain', '*.vtesitaly.com']);
  // The privacy page promises it: a browser sending Do Not Track is not counted.
  paq.push(['setDoNotTrack', true]);
  paq.push(['trackPageView']);
  paq.push(['enableLinkTracking']);
  paq.push(['setTrackerUrl', 'https://stats.vtesitaly.com/matomo.php']);
  paq.push(['setSiteId', '1']);
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://stats.vtesitaly.com/matomo.js';
  document.head.appendChild(script);
}
