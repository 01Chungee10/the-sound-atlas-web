/**
 * The Sound Atlas · static, dependency-free scrollytelling frontend.
 * Source content and media attribution remain separate and editable.
 */
import { renderConceptLab, initConceptLabs } from './concepts.js';
import { renderPlates, scenePlates, bindArchive } from './archive.js';
import { initPlayer } from "./player.js";

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const esc = (value = '') => String(value).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
const storageKey = 'sound-atlas-study-v1';
const countryInfo = [
  ['italy', '이탈리아'], ['france', '프랑스'], ['england', '잉글랜드'], ['germany', '독일'],
  ['austria', '오스트리아'], ['russia', '러시아'], ['china', '중국'], ['korea', '한국']
].map(([id, name]) => ({id, name}));
const countryMap = Object.fromEntries(countryInfo.map(x => [x.id,x]));
const eras = [
  {start:1600,end:1625,label:'새로운 소리가 태어나다',summary:'바로크의 시작과 궁정·교회의 변화. 비슷한 시기, 동아시아에서는 악보와 연희의 전통이 다른 길을 걸었습니다.'},
  {start:1625,end:1650,label:'전쟁과 무대, 격변의 시대',summary:'베네치아에서는 표를 사는 관객이 등장하고, 런던에서는 극장이 문을 닫습니다. 조선과 명·청 교체기의 음악 기록도 함께 읽습니다.'},
  {start:1650,end:1675,label:'궁정 밖으로 번지는 음악',summary:'런던에서는 춤 교본이 팔리고, 뤼베크에서는 시민이 교회의 저녁 음악회를 찾습니다. 조선에서는 악서를 다시 찍습니다.'},
  {start:1675,end:1700,label:'다음 세기의 문턱에서',summary:'로마에서는 코렐리의 소나타가 인쇄되고, 모스크바에서는 여러 성부로 곡을 쓰는 법을 가르칩니다. 조선의 《신증금보》에는 분화하는 가곡의 모습이 남습니다.'}
];
const trackNames = {
  'Orfeo - Toccata.ogg': '몬테베르디 · 오르페오 서곡(토카타)',
  'Corelli-Trio Sonata 11-1.ogg': '코렐리 · 트리오 소나타 11번 I',
  'Purcell from Dido & Aeneas, Act 2, scene 1, echo chorus 01.wav': '퍼셀 · 디도와 에네아스 / 에코 합창 (발췌)',
  'John Dowland (1563-1626) - Mistress Nichols Almand à5, Lachrimae, No.20 for Treble, Tenor & Bass Viols with Great Bass Violone in G.ogg': '다울랜드 · 미스트리스 니컬스 알망드',
  'William Byrd - Browning a5.ogg': '윌리엄 버드 · Browning a5',
  'The Begger Boy – Playford\'s The English Dancing Master (1651).ogg': '플레이퍼드 · 거지 소년 (1651 춤곡집)',
  'Henry Purcell (1659-1695) – In Nomine à6, Z.746 for Treble, Tenor & Bass Viols.ogg': '퍼셀 · In Nomine a6',
  'Schutz Heu mihi, Domine from Cantiones Sacrae 01.wav': '쉬츠 · Heu mihi, Domine (1625)',
  'Buxtehude - Toccata in F-Dur BuxWV 161.ogg': '북스테후데 · 토카타 F장조',
  'Pachelbel - Canon in D major, P. 37 (Guitar).ogg': '파헬벨 · 캐논 D장조 (기타 편곡)',
  'Johann Jakob Froberger - Toccata and Suite in A minor.ogg': '프로베르거 · 토카타와 모음곡 a단조',
  'Froberger Tombeau de Monsieur de Blancheroche.ogg': '프로베르거 · 블랑슈로슈를 위한 애도곡',
  'Lully Le Bourgeois Gentilhomme - 11. Marche pour la Ceremonie des Turcs.ogg': '륄리 · 터키인들의 의식 행진곡 (1670)',
  '07 Armide. Acte II, Scene 5- Prelude.ogg': '륄리 · 아르미드 2막 5장 전주곡 (1686)',
  'Couperin-plein jeu kyrie messe pour les couvents.ogg': '쿠프랭 · 수도원 미사 / 키리에',
  '04 Bogorodice Devo radujsja znamennyj raspev grind Moscow Patriarchal Choir.ogg': '즈나멘니 성가 · 성모여 기뻐하소서 (현대 연주)',
  'Guqin-Zuiyu Changwan.ogg': '고금(古琴) · 취어창만 (현대 연주)',
  'Guqin-Yangguan Sandie.ogg': '고금(古琴) · 양관삼첩 (현대 연주)'
};
const studyAnswers = [
  ['1600–1625','《오르페오》의 첫 토카타에서 관객의 주의를 끄는 소리는 무엇일까요?','관악기의 팡파르입니다. 몬테베르디는 인물이 노래를 시작하기 전에 기악곡을 두어 만토바 궁정의 관객에게 공연의 시작을 알렸습니다.'],
  ['1625–1650','1637년 베네치아에서 일어난 음악사의 전환은?','산카시아노 공공 오페라 극장 개관입니다. 궁정에서 후원받던 무대가 유료 관객의 공연 문화로 확장되었습니다.'],
  ['1650–1675','1672년 런던에서 유료 음악회를 연 연주자는 누구였을까요?','1672년 존 배니스터의 유료 공개 음악회가 대표 사례입니다. 상업적 공연 문화의 새로운 장이 열렸습니다.'],
  ['1675–1700','동아시아와 유럽에서 음악 이론·악보가 발전한 사례를 하나씩 들어보세요.','조선의 《신증금보》(1680)는 거문고 음악을 기록했고, 딜레츠키의 《음악 문법》 모스크바 판본(1679)은 다성 음악의 작곡법을 다뤘습니다.']
];

let chapters = [], curation = {}, media = {images:{},audio:{}};
let enrichment = {sources:{},chapters:{}}, gallery = {};
let primaryPlates = {}, historyNotes = {}, archives = {};
let searchQuery = '';
let currentFilter = 'all';
let saveDebounce;
let study = loadStudy();

function loadStudy(){
  try {const val=JSON.parse(localStorage.getItem(storageKey));if(val && typeof val==='object') return {notes: val.notes || {}, read: val.read || {}};} catch{}
  return {notes:{},read:{}};
}
function persistStudy(){try {localStorage.setItem(storageKey, JSON.stringify(study));}catch{}}
function mediaLink(label,href,extra=''){return href ? `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer" ${extra}>${esc(label)}</a>`:'';}
function trackTitle(key){
  const title=media.audio?.[key]?.title;
  return (title && title!==key ? title : trackNames[key]) || key.replace(/\.[^.]+$/,'');
}
function buildAudioHtml(ch,cur){
  const available=(cur.audioFiles || []).filter(key => !!media.audio?.[key]?.url);
  if(!available.length){
    const query=encodeURIComponent([ch.country,ch.title,'17th century music'].join(' '));
    return `<div class="no-audio">검증된 자유 이용 녹음을 아직 연결하지 않았습니다. 시대를 잘못 대표하는 녹음을 임의로 재생하지 않습니다.<br/><a href="https://commons.wikimedia.org/w/index.php?search=${query}&title=Special:MediaSearch&type=audio" target="_blank" rel="noopener noreferrer">Wikimedia Commons에서 관련 음악 찾기 ↗</a></div>`;
  }
  return available.map(key=>{
    const obj=media.audio[key];
    return `<button class="listen-card" data-audio-file="${esc(key)}" data-chapter="${esc(ch.id)}" type="button" aria-label="${esc(trackTitle(key))} 재생"><span class="play-glyph" aria-hidden="true">▶</span><span><strong class="listen-title">${esc(trackTitle(key))}</strong><small class="listen-license">${esc(obj.clipNote || (obj.kind === 'audio' ? '연주 녹음' : obj.kind) || '연주 녹음')}</small></span></button>`;
  }).join('');
}
function richContext(ch) {
  const item = enrichment.chapters[ch.id] || {people:[], sources:[]};
  const guide = historyNotes[ch.id] || {};
  const sections = [
    ['사회와 생활', item.setting], ['후원자와 청중', item.why],
    ['음악의 변화', item.musical], ['그림에서 살펴볼 점', item.look],
    ['사료를 읽을 때', item.caution]
  ];
  const citations = [
    ...(guide.sources || []),
    ...item.sources.map(key => enrichment.sources[key]).filter(Boolean).map(src => ({title:src.label, url:src.url}))
  ];
  const links = [...new Map(citations.map(src => [src.url, src])).values()]
    .map(src => `<li>${mediaLink(src.title, src.url)}</li>`).join('');
  return `<details class="reading-details"><summary>시대적 배경과 참고 자료</summary><div class="reading-body">
    ${sections.filter(([,copy])=>copy).map(([name,copy])=>`<h4>${name}</h4><p>${esc(copy)}</p>`).join('')}
    <h4>관련 인물</h4><ul>${item.people.map(person=>`<li>${esc(person)}</li>`).join('')}</ul>
    <h4>출처와 더 읽을 자료</h4><ul class="reading-sources">${links}</ul>
  </div></details>`;
}

function eventText(event) {
  return event.text.replace(new RegExp('^'+event.year+'(?:경|년대|년)?\\s*'), '').trim() || event.text;
}
function timelineRows(events, prefix) {
  return events.map((item,i) => `<li class="event-item" id="${prefix}-${i}"><time>${esc(item.dateLabel || (String(item.year) + (item.approx ? '경' : '')))}</time><span>${esc(eventText(item))}</span></li>`).join('');
}
function buildChapter(ch) {
  const cur = curation[ch.id];
  const read = !!study.read[ch.id];
  const guide = historyNotes[ch.id] || {};
  const adjacent = [['이 시기 이전',ch.earlier],['다음 세기로',ch.afterwards]];
  return `<section class="chapter" id="${ch.id}" data-country="${ch.countryId}" data-era="${ch.eraIndex}" aria-labelledby="title-${ch.id}">
    <div class="chapter-grid section-container">
      <div class="visual-column">${renderPlates(ch.id, archives[ch.id])}</div>
      <header class="scene-heading">
        <div class="story-tag"><span class="country-dot" aria-hidden="true"></span><b>${esc(countryMap[ch.countryId].name)}</b><span class="tag-rule"></span><time>${ch.start} — ${ch.end}</time></div>
        <h2 class="story-title" id="title-${ch.id}">${esc(ch.title)}</h2>
        <p class="story-summary">${esc(ch.summary)}</p>
      </header>
      <article class="story-column" aria-labelledby="title-${ch.id}">
        <div class="listening-block"><h3>이 장면의 소리</h3><div class="audio-list">${buildAudioHtml(ch,cur)}</div>
          <p class="listening-note">${esc(cur.listeningNote || '')}</p>
          ${cur.listeningSource ? `<p class="listening-source">${mediaLink(cur.listeningSource.title, cur.listeningSource.url)}</p>` : ''}</div>
        ${renderConceptLab(ch.id)}
        ${guide.context ? `<p class="context-intro">${esc(guide.context)}</p>` : ''}
        ${guide.focus ? `<p class="focus-note"><strong>살펴볼 점</strong> ${esc(guide.focus)}</p>` : ''}
        <details class="events-disclosure reading-details"><summary>장면의 사건 연표 <span>${ch.events.length}건</span></summary>
          <ol class="event-timeline">${timelineRows(ch.events, ch.id + '-event')}</ol>
          ${adjacent.filter(([,events])=>events?.length).map(([name,events])=>`<h4>${name}</h4><ol class="event-timeline">${timelineRows(events, ch.id + (events === ch.earlier ? '-before' : '-after'))}</ol>`).join('')}
        </details>
        ${richContext(ch)}
        <div class="question-box"><small>생각해 보기</small><p>${esc(cur.question)}</p></div>
        <button class="notes-toggle" type="button" data-notes-toggle="${ch.id}" aria-expanded="false"><span>나의 학습 메모</span><span>열기 +</span></button>
        <div class="notes-panel" data-notes-panel="${ch.id}" hidden><label for="note-${ch.id}">이 장면에서 기억할 것</label><textarea id="note-${ch.id}" rows="3"></textarea><button type="button" data-notes-save="${ch.id}">메모 저장</button></div>
        <button class="notes-toggle read-toggle" type="button" data-mark-read="${ch.id}" aria-pressed="${read}"><span>${read?'✓ 학습 완료':'이 장면 학습 완료 표시'}</span><span>${read?'완료':'표시'}</span></button>
      </article>
    </div>
  </section>`;
}
function renderAtlas(){
  const sorted=[...chapters].sort((a,b)=>a.eraIndex-b.eraIndex || countryInfo.findIndex(c=>c.id===a.countryId)-countryInfo.findIndex(c=>c.id===b.countryId));
  const fragments=[];
  for(let i=0;i<eras.length;i++){
    const era=eras[i];
    fragments.push(`<section class="era-divider" id="era-${i}" data-era="${i}" aria-labelledby="era-title-${i}"><div class="section-container">
      <div class="era-date">${era.start}<i>–</i>${era.end}</div><div><h2 id="era-title-${i}">${esc(era.label)}</h2><p>${esc(era.summary)}</p></div>
      </div></section>`);
    fragments.push(...sorted.filter(c=>c.eraIndex===i).map(buildChapter));
  }
  $('#atlas').innerHTML=fragments.join('');
  // Re-populate note fields with browser-local drafts after rendering.
  for(const ch of chapters){const field=$(`#note-${ch.id}`);if(field) field.value=study.notes[ch.id] || '';}
  $$('.concept-lab').forEach(lab => {lab.id = 'concept-' + lab.dataset.conceptScene;});
  applyFilter('all',false);
  scheduleProgress();
}
function renderControls(){
  const covers = ['italy-1600','france-1650','england-1650','germany-1650','austria-1650','russia-1600','china-1600','korea-1675'];
  $('#countryMosaic').innerHTML = countryInfo.map((country, i) => {
    const item = archives[covers[i]]?.[0];
    return `<button class="mosaic-item" type="button" data-filter="${country.id}" data-country="${country.id}" aria-pressed="false">
      <span class="mosaic-art">${item?.src ? `<img src="${esc(item.src)}" loading="lazy" alt="" />` : ''}</span>
      <strong>${esc(country.name)}</strong></button>`;
  }).join('');
  $('#countryFilters').innerHTML = '<button class="filter-chip" data-filter="all" aria-pressed="true" type="button">전체 지역</button>';
  $('#eraNav').innerHTML = eras.map((era,i) => `<a class="era-link" data-era="${i}" href="#era-${i}"><span>${era.start}<i>–</i>${era.end}</span><small>${esc(era.label)}</small></a>`).join('');
  $('#learningChecks').innerHTML=studyAnswers.map(([period,q,a])=>`<div class="learning-check"><small>${period}</small><h3>${esc(q)}</h3><details><summary>생각한 뒤 답 펼치기 +</summary><p>${esc(a)}</p></details></div>`).join('');
}
function applyFilter(id,scroll=true){
  currentFilter=id;
  const query = searchQuery.trim().toLocaleLowerCase('ko');
  const visible = [];
  $$('.chapter').forEach(el => {
    const match = (id === 'all' || el.dataset.country === id) && (!query || el.textContent.toLocaleLowerCase('ko').includes(query));
    el.hidden = !match;
    if (match) visible.push(el);
  });
  $$('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === id)));
  $$('.era-divider, .era-link').forEach(el => {el.hidden = !visible.some(scene => scene.dataset.era === el.dataset.era);});
  $('#resultCount').textContent = `${id === 'all' ? '전체 지역' : countryMap[id].name} · ${visible.length}개 장면 · 완료 ${visible.filter(el => study.read[el.id]).length}개`;
  const matches = $('#matches');
  matches.hidden = !query && id === 'all';
  matches.innerHTML = visible.length
    ? visible.map(el => {
      const hit = query && $$('.event-item', el).find(row => row.textContent.toLocaleLowerCase('ko').includes(query));
      const text = hit ? hit.querySelector('time').textContent + ' · ' + hit.querySelector('span').textContent : '';
      return `<a data-search-jump href="#${hit ? hit.id : el.id}"><strong>${esc(countryMap[el.dataset.country].name)} · ${esc(el.querySelector('.story-title').textContent)}</strong>${text ? `<small>${esc(text)}</small>` : ''}</a>`;
    }).join('')
    : '<p>일치하는 장면이 없습니다. 검색어나 지역을 바꿔 보세요.</p>';
  const labs = new Map();
  for (const scene of visible) {
    const lab = $('.concept-lab', scene);
    const title = lab?.querySelector('summary strong')?.textContent;
    if (title && !labs.has(title)) labs.set(title, {id:lab.id, country:countryMap[scene.dataset.country].name});
  }
  $('#conceptDirectory').hidden = labs.size === 0;
  $('#conceptCount').textContent = `${labs.size}가지`;
  $('#conceptLinks').innerHTML = [...labs].map(([title,lab]) => `<a href="#${lab.id}"><small>${esc(lab.country)}</small>${esc(title)}</a>`).join('');
  const first = $('[data-first-scene]');
  first.href = visible.length ? '#' + visible[0].id : '#routes';
  if(scroll && visible.length) visible[0].scrollIntoView({behavior:'instant',block:'start'});
  scheduleProgress();
}
function toggleNotes(id){const p=$(`[data-notes-panel="${CSS.escape(id)}"]`);const b=$(`[data-notes-toggle="${CSS.escape(id)}"]`);if(!p||!b)return;const expanded=b.getAttribute('aria-expanded')==='true';p.hidden=expanded;b.setAttribute('aria-expanded',String(!expanded));b.querySelector('span:last-child').textContent=expanded?'열기 +':'닫기 −';if(!expanded)$(`#note-${id}`)?.focus();}
function renderSavedNotes() {
  const saved = chapters.filter(ch => study.notes[ch.id]?.trim());
  $('#savedNotes').hidden = !saved.length;
  $('#savedNotesList').innerHTML = saved.map(ch => `<li><a data-saved-jump href="#${ch.id}">${esc(ch.country)} · ${esc(ch.title)}</a><p>${esc(study.notes[ch.id])}</p></li>`).join('');
}
function revealTarget(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const disclosure = target.closest('details');
  if (disclosure) disclosure.open = true;
  return target;
}
function saveNote(id){const txt=$(`#note-${id}`)?.value||'';study.notes[id]=txt;persistStudy();renderSavedNotes();const b=$(`[data-notes-save="${CSS.escape(id)}"]`);if(b){b.textContent='저장됨 ✓';clearTimeout(saveDebounce);saveDebounce=setTimeout(()=>{if(b.isConnected)b.textContent='메모 저장';},1600);}}
function markRead(id){study.read[id]=!study.read[id];persistStudy();const b=$(`[data-mark-read="${CSS.escape(id)}"]`);const yes=study.read[id];b.setAttribute('aria-pressed',String(yes));b.innerHTML=`<span>${yes?'✓ 학습 완료 표시됨':'○ 이 장면 학습 완료 표시'}</span><span>${yes?'완료':'표시'}</span>`;applyFilter(currentFilter,false);}
function exportNotes(){
  const data={version:1,title:'17세기 소리의 세계 — 학습 메모',createdAt:new Date().toISOString(),notes:study.notes,read:study.read};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='17-century-music-study-notes.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}
let progressFrame = 0;
function scheduleProgress() {
  if (!progressFrame) progressFrame = window.requestAnimationFrame(syncProgress);
}
function syncProgress() {
  progressFrame = 0;
  const limit = document.documentElement.scrollHeight - innerHeight;
  $('#readingMeter').style.width = (limit ? Math.min(100, Math.max(0, scrollY / limit * 100)) : 0) + '%';
  const visible = $$('.chapter:not([hidden])');
  const line = innerHeight * .39;
  const index = visible.findIndex(scene => {
    const rect = scene.getBoundingClientRect();
    return rect.top <= line && rect.bottom > line;
  });
  const label = index < 0 ? '' : `${index + 1} / ${visible.length} · ${countryMap[visible[index].dataset.country].name}`;
  const status = $('#headerProgress');
  if (status.textContent !== label) status.textContent = label;
}
function bindEvents(){
  document.addEventListener('click',event=>{
    const filter=event.target.closest('[data-filter]');if(filter){applyFilter(filter.dataset.filter);return;}
    const toggle=event.target.closest('[data-notes-toggle]');if(toggle){toggleNotes(toggle.dataset.notesToggle);return;}
    const save=event.target.closest('[data-notes-save]');if(save){saveNote(save.dataset.notesSave);return;}
    const read=event.target.closest('[data-mark-read]');if(read){markRead(read.dataset.markRead);return;}
  });
  $('#routes').addEventListener('click', event => {
    const link = event.target.closest('[data-search-jump], #conceptLinks a');
    if (link) revealTarget(link.hash.slice(1));
  });
  $('#savedNotes').addEventListener('click', event => {
    const link = event.target.closest('[data-saved-jump]');
    if (!link) return;
    searchQuery='';$('#atlasSearch').value='';applyFilter('all',false);
    const id=link.hash.slice(1);
    const toggle=$(`[data-notes-toggle="${id}"]`);
    if (toggle?.getAttribute('aria-expanded') === 'false') toggleNotes(id);
  });
  initPlayer({chapters,curation,tracks:media.audio,titleFor:trackTitle});
  $('#atlasSearch').addEventListener('input',e=>{searchQuery=e.target.value||'';applyFilter(currentFilter,false);});
  $('#atlasSearchClear').addEventListener('click',()=>{searchQuery='';$('#atlasSearch').value='';applyFilter(currentFilter,false);$('#atlasSearch').focus();});
  $('#exportNotes').addEventListener('click',exportNotes);
  $('#openAbout').addEventListener('click',()=>$('#aboutDialog').showModal());
  $('#openSources').addEventListener('click',()=>$('#aboutDialog').showModal());
  $('#closeAbout').addEventListener('click',()=>$('#aboutDialog').close());
  $('#aboutDialog').addEventListener('click',e=>{if(e.target===$('#aboutDialog'))$('#aboutDialog').close();});
  window.addEventListener('scroll',scheduleProgress,{passive:true});window.addEventListener('resize',scheduleProgress,{passive:true});
}
async function init(){
  try{
    const embedded=window.__SOUND_ATLAS_DATA__;
    if(embedded && Array.isArray(embedded.chapters)){
      [chapters,curation,media]=[embedded.chapters,embedded.curation,embedded.media];
      enrichment=embedded.enrichment||enrichment;gallery=embedded.gallery||gallery;primaryPlates=embedded.plates||{};historyNotes=embedded.history||{};
    }else{
      const urls=['./src/data/chapters.json','./src/data/curation.json','./src/data/media.json','./src/data/enriched.json','./src/data/gallery.json','./src/data/plates.json','./src/data/history.json'];
      const responses=await Promise.all(urls.map(u=>fetch(u,{cache:'no-cache'})));
      for(const [i,res] of responses.entries())if(!res.ok)throw new Error(`${urls[i]}: HTTP ${res.status}`);
      [chapters,curation,media,enrichment,gallery,primaryPlates,historyNotes]=await Promise.all(responses.map(r=>r.json()));
    }
    if(!Array.isArray(chapters)||chapters.length!==32)throw new Error('본문 32개 장면을 불러오지 못했습니다.');
    archives = Object.fromEntries(chapters.map(ch => [ch.id, scenePlates(primaryPlates[ch.id], gallery[ch.id])]));
    renderControls();renderAtlas();renderSavedNotes();bindEvents();initConceptLabs();bindArchive(id => archives[id]);scheduleProgress();
    if(location.hash){const target=revealTarget(decodeURIComponent(location.hash.slice(1)));if(target)setTimeout(()=>target.scrollIntoView({block:'start'}),50);}
  }catch(e){console.error(e);$('#atlas').innerHTML=`<div class="section-container" style="padding:60px 0"><h2>자료를 불러오지 못했습니다.</h2><p>${esc(e.message)}</p><p>로컬에서는 파일을 직접 더블클릭하지 말고 웹 서버(http://localhost)로 열어 주세요.</p></div>`;}
}
init();
