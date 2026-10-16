// Recomputes, in the browser, everything on the page that depends on "today":
// event and tour status badges, the homepage timeline window, the past/future
// divider, the next-event highlight, the active price column and the footer
// year. The HTML carries the build-day values and can sit in a cache for days,
// so the visitor's own date wins. Status rules come from src/utils/status.ts,
// the same functions the build uses: there is no second copy to keep in sync.
import { eventStatusOn, tourStatusOn, type StageDay } from '../utils/status';
import { todayLocalIso } from '../utils/today';

const todayISO = todayLocalIso();

function applyStatus(el: HTMLElement, status: string | null) {
  if (!status) {
    el.style.display = 'none';
    return;
  }
  el.textContent = el.getAttribute('data-label-' + status) || status;
  if (el.classList.contains('post__status')) {
    el.classList.remove('post__status--active', 'post__status--finished');
    el.classList.add(status === 'past' ? 'post__status--finished' : 'post__status--active');
  }
}

// Single-date events
document.querySelectorAll<HTMLElement>('[data-event-date]').forEach((el) => {
  applyStatus(el, eventStatusOn(el.getAttribute('data-event-date') || '', todayISO));
});

// Tour (multi-stage)
document.querySelectorAll<HTMLElement>('[data-tour-stages]').forEach((el) => {
  try {
    const stages = JSON.parse(el.getAttribute('data-tour-stages') || '[]') as StageDay[];
    applyStatus(el, tourStatusOn(stages, todayISO));
  } catch {
    /* malformed data */
  }
});

const dateOf = (c: Element) => c.getAttribute('data-date') || '';

function resetHighlight(cards: Element[]) {
  cards.forEach((c) => {
    c.classList.remove('post-card--highlight');
    const b = c.querySelector<HTMLElement>('.post-card__highlight-badge');
    if (b) b.hidden = true;
  });
}

// Timeline window: pick 5 cards centered on real-today pivot, shipping
// the rest of the timeline inside a <template data-timeline-overflow>
// so they're parsed but inert (don't count toward Lighthouse DOM size
// and don't trigger <img> loads). Cards move between container and
// template as the pivot shifts away from the build-time window.
document.querySelectorAll('[data-temporal-window]').forEach((container) => {
  const template = container.querySelector<HTMLTemplateElement>('template[data-timeline-overflow]');
  const visible = Array.from(container.querySelectorAll(':scope > .post-card[data-date]'));
  const overflow = template ? Array.from(template.content.querySelectorAll('.post-card[data-date]')) : [];
  const all = visible.concat(overflow);
  if (all.length === 0) return;
  all.sort((a, b) => (dateOf(a) < dateOf(b) ? -1 : dateOf(a) > dateOf(b) ? 1 : 0));

  resetHighlight(all);

  // Pivot compares against data-end-date (data-date fallback) so a
  // multi-day event stays the highlighted card for its whole run.
  const pivot = all.findIndex((c) => (c.getAttribute('data-end-date') || dateOf(c)) >= todayISO);
  let chosen: Element[];
  if (pivot === -1) {
    chosen = all.slice(-5).reverse();
  } else {
    const idealAbove = 2;
    const idealBelow = 2;
    let above = all.slice(pivot + 1, pivot + 1 + idealAbove);
    let below = all.slice(Math.max(0, pivot - idealBelow), pivot);
    const aboveShort = idealAbove - above.length;
    const belowShort = idealBelow - below.length;
    if (aboveShort > 0) below = all.slice(Math.max(0, pivot - idealBelow - aboveShort), pivot);
    if (belowShort > 0) above = all.slice(pivot + 1, pivot + 1 + idealAbove + belowShort);
    chosen = above.slice().reverse().concat([all[pivot]], below.slice().reverse());
    all[pivot].classList.add('post-card--highlight');
    // Already started (data-date <= today): "Oggi" label; else "Prossimo".
    const pivotOngoing = dateOf(all[pivot]) <= todayISO;
    const pivotBadge = all[pivot].querySelector<HTMLElement>('.post-card__highlight-badge');
    if (pivotBadge) {
      const nextLabel = pivotBadge.getAttribute('data-label-next') || '';
      const ongoingLabel = pivotBadge.getAttribute('data-label-ongoing') || nextLabel;
      pivotBadge.textContent = pivotOngoing ? ongoingLabel : nextLabel;
      pivotBadge.hidden = false;
    }
  }

  // Move visible cards not in `chosen` into the template (parks them).
  const chosenSet = new Set(chosen);
  if (template) {
    visible.forEach((c) => {
      if (!chosenSet.has(c)) template.content.appendChild(c);
    });
  }
  // Append chosen cards to the container in visual order; this moves
  // them out of the template if needed and reorders existing ones.
  chosen.forEach((c) => container.appendChild(c));
  // Keep the template as the last child so its position is stable.
  if (template && container.lastChild !== template) container.appendChild(template);
});

// Past divider: in [data-temporal-divider] containers, position the
// .post-list__divider between future (top) and past (bottom) cards.
// Cards are sorted descending (newest first).
document.querySelectorAll('[data-temporal-divider]').forEach((container) => {
  const divider = container.querySelector<HTMLElement>('.post-list__divider');
  if (!divider) return;
  const cards = Array.from(container.querySelectorAll('.post-card[data-date]'));
  const firstPast = cards.findIndex((c) => dateOf(c) < todayISO);
  if (firstPast <= 0) {
    // No past on this page, OR all cards are past (no future above): no divider.
    divider.hidden = true;
  } else {
    divider.hidden = false;
    const target = cards[firstPast];
    if (divider.nextSibling !== target) container.insertBefore(divider, target);
  }
});

// Next-event highlight: cards in [data-temporal-next-event] are sorted
// future-first then past. Highlight the last future card (just before the
// first past). If all future, highlight the very last; if all past, none.
document.querySelectorAll('[data-temporal-next-event]').forEach((container) => {
  const cards = Array.from(container.querySelectorAll('.post-card[data-date]'));
  resetHighlight(cards);
  if (cards.length === 0) return;
  const firstPast = cards.findIndex((c) => dateOf(c) < todayISO);
  const idx = firstPast === -1 ? cards.length - 1 : firstPast - 1;
  if (idx >= 0) {
    cards[idx].classList.add('post-card--highlight');
    const b = cards[idx].querySelector<HTMLElement>('.post-card__highlight-badge');
    if (b) b.hidden = false;
  }
});

// Pricing column highlight in [data-temporal-pricing]. Toggles
// gp-price-active / gp-price-inactive on .gp-price-cell--early and
// .gp-price-cell--regular based on today vs deadline + last-event date.
document.querySelectorAll('[data-temporal-pricing]').forEach((table) => {
  const lastEventDate = table.getAttribute('data-event-last-date') || '';
  const earlyDeadlineDate = table.getAttribute('data-early-deadline-date') || '';
  if (!lastEventDate) return;
  const eventFinished = todayISO >= lastEventDate;
  const earlyActive = !eventFinished && (!earlyDeadlineDate || todayISO < earlyDeadlineDate);
  const regularActive = !eventFinished && !earlyActive;
  const applyPrice = (selector: string, active: boolean) => {
    table.querySelectorAll(selector).forEach((el) => {
      el.classList.remove('gp-price-active', 'gp-price-inactive');
      el.classList.add(active ? 'gp-price-active' : 'gp-price-inactive');
    });
  };
  applyPrice('.gp-price-cell--early', earlyActive);
  applyPrice('.gp-price-cell--regular', regularActive);
});

// Footer copyright year
const copy = document.querySelector('.footer-bottom p');
if (copy && copy.textContent) {
  copy.textContent = copy.textContent.replace(/–\d{4}/, '–' + new Date().getFullYear());
}
