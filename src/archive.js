const escape = (value = '') => String(value).replace(/[&<>"']/g, char =>
  ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'})[char]);

export function scenePlates(primary = [], supplemental = []) {
  const items = [...primary, ...supplemental.map(item => ({
    src: item.url, title: item.caption || item.title, caption: item.note,
    credit: item.artist, license: item.license, licenseUrl: item.licenseUrl,
    source: item.source, alt: item.caption || item.title
  }))];
  const seen = new Set();
  return items.filter(item => {
    if (!item.source || seen.has(item.source)) return false;
    seen.add(item.source);
    return true;
  });
}

function plateCredit(item) {
  const credit = escape(item.credit || '');
  const license = item.licenseUrl
    ? `<a href="${escape(item.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escape(item.license)}</a>`
    : escape(item.license || '');
  return [credit, license].filter(Boolean).join(' · ');
}

function description(item) {
  return `<strong>${escape(item.title)}</strong><p>${escape(item.caption)}</p>
    <div class="plate-credit">${plateCredit(item)} <a href="${escape(item.source)}" target="_blank" rel="noopener noreferrer">소장처·원본</a></div>`;
}

export function renderPlates(id, items, selected = 0) {
  const item = items[selected];
  if (!item) return '';
  const thumbs = items.map((record, index) => `
    <button type="button" data-plate-select="${index}" aria-pressed="${index === selected}" aria-label="${escape(record.title)} 보기" title="${escape(record.title)}">
      ${record.src ? `<img src="${escape(record.src)}" alt="" loading="lazy" decoding="async" />` : '원문'}
    </button>`).join('');
  return `<figure class="plate" data-plate-group="${escape(id)}">
    <div class="plate-main">
      ${item.src ? `<button type="button" data-plate-zoom="${selected}" aria-label="${escape(item.title)} 크게 보기">
        <img class="scene-image" src="${escape(item.src)}" alt="${escape(item.alt || item.title)}" loading="lazy" decoding="async" /><span class="zoom-label">확대</span>
      </button>` : `<a class="no-preview" href="${escape(item.source)}" target="_blank" rel="noopener noreferrer">소장처에서 보기</a>`}
    </div>
    <figcaption><div class="plate-counter">시각 사료 <span>${selected + 1} / ${items.length}</span></div>${description(item)}</figcaption>
    ${items.length > 1 ? `<div class="plate-thumbnails" role="group" aria-label="이 장면의 다른 사료">${thumbs}</div>` : ''}
  </figure>`;
}

export function bindArchive(getItems) {
  const dialog = document.querySelector('#plateDialog');
  document.querySelector('#closePlate').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-plate-select], [data-plate-zoom]');
    if (!button) return;
    const figure = button.closest('[data-plate-group]');
    const id = figure.dataset.plateGroup;
    const items = getItems(id);
    if ('plateSelect' in button.dataset) {
      const index = Number(button.dataset.plateSelect);
      const column = figure.parentElement;
      figure.outerHTML = renderPlates(id, items, index);
      column.querySelector(`[data-plate-select="${index}"]`).focus({preventScroll:true});
      return;
    }
    const item = items[Number(button.dataset.plateZoom)];
    document.querySelector('#plateDialogTitle').textContent = item.title;
    document.querySelector('#plateDialogBody').innerHTML = `<img src="${escape(item.src)}" alt="${escape(item.alt || item.title)}"><div>${description(item)}</div>`;
    dialog.showModal();
  });
}
