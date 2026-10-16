(function () {
  var script = document.currentScript;
  var alt = script && script.getAttribute('data-alt');
  try {
    var saved = localStorage.getItem('vtesitaly-lang');
    if (
      (saved === 'it' || saved === 'en') &&
      saved !== document.documentElement.lang &&
      alt &&
      alt !== location.pathname
    ) {
      location.replace(alt + location.search + location.hash);
    }
  } catch {
    /* storage unavailable */
  }
})();
