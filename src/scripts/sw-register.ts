// Service worker registration and the "new version" banner.
//
// public/sw.js calls skipWaiting() and clients.claim(): a new worker takes
// over the open tabs as soon as it is installed, without waiting for them to
// close. The page the visitor is reading stays the old one, so the banner
// tells them a newer version is already active and one reload shows it. It
// informs, it does not gate the update: nothing waits for the click.
//
// `controllerchange` also fires on the very first visit, when the first
// worker claims a page that had none. That is not an update, and the banner
// stays hidden: it shows only when the page was already controlled before.
const hadController = !!navigator.serviceWorker?.controller;

function showUpdateBanner() {
  if (document.getElementById('sw-update')) return;
  const strings = document.body.dataset;
  const bar = document.createElement('div');
  bar.id = 'sw-update';
  bar.className = 'sw-update';
  bar.setAttribute('role', 'status');
  bar.setAttribute('aria-live', 'polite');
  const msg = document.createElement('span');
  msg.className = 'sw-update-msg';
  msg.textContent = strings.swTitle || '';
  const reload = document.createElement('button');
  reload.type = 'button';
  reload.className = 'sw-update-btn';
  reload.textContent = strings.swReload || '';
  reload.addEventListener('click', () => window.location.reload());
  const dismiss = document.createElement('button');
  dismiss.type = 'button';
  dismiss.className = 'sw-update-dismiss';
  dismiss.setAttribute('aria-label', strings.swDismiss || '');
  dismiss.textContent = '×';
  dismiss.addEventListener('click', () => bar.remove());
  bar.append(msg, reload, dismiss);
  document.body.appendChild(bar);
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController) showUpdateBanner();
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* SW registration is best-effort */
    });
  });
}
