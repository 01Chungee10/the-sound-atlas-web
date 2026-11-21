/**
 * The Sound Atlas · static, dependency-free scrollytelling frontend.
 * Source content and media attribution remain separate and editable.
 */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const esc = (value = '') => String(value).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
const storageKey = 'sound-atlas-study-v1';
const countryInfo = [
  ['italy','이탈리아','IT','♬','#cfb27e'],
  ['france','프랑스','FR','⚜','#a9b6cf'],
  ['england','영국','GB','♮','#ce9691'],
  ['germany','독일','DE','♩','#9ab68b'],
  ['austria','오스트리아','AT','✧','#c5a48d'],
  ['russia','러시아','RU','✣','#94bfc5'],
  ['china','중국','CN','琴','#c88f85'],
  ['korea','한국','KR','音','#9dc2ae']
].map(([id,name,code,symbol,color]) => ({id,name,code,symbol,color}));
const countryMap = Object.fromEntries(countryInfo.map(x => [x.id,x]));
const eras = [
  {start:1600,end:1625,label:'새로운 소리가 태어나다',summary:'바로크의 시작과 궁정·교회의 변화. 비슷한 시기, 동아시아에서는 악보와 연희의 전통이 다른 길을 걸었습니다.'},
  {start:1625,end:1650,label:'전쟁과 무대, 격변의 시대',summary:'전쟁과 왕조 교체 속에서도 예술은 멈추지 않았습니다. 극장의 탄생과 위기의 기록을 함께 살펴봅니다.'},
  {start:1650,end:1675,label:'궁정 밖으로 번지는 음악',summary:'시민이 공연을 듣고 악보를 사고, 각국의 음악 양식이 서로를 바꾸기 시작합니다.'},
  {start:1675,end:1700,label:'다음 세기의 문턱에서',summary:'기악과 성악, 음악이론이 새로운 형태로 굳어지고 18세기를 준비합니다.'}
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
  ['1600–1625','1607년 이탈리아의 대표 오페라 작품과 작곡가는?','몬테베르디의 《오르페오》입니다. 새로운 모노디와 극적 표현은 초기 바로크를 이해하는 핵심입니다.'],
  ['1625–1650','1637년 베네치아에서 일어난 음악사의 전환은?','산카시아노 공공 오페라 극장 개관입니다. 궁정에서 후원받던 무대가 유료 관객의 공연 문화로 확장되었습니다.'],
  ['1650–1675','런던의 첫 유료 공개 음악회는 언제 시작되었을까요?','1672년 존 배니스터의 유료 공개 음악회가 대표 사례입니다. 상업적 공연 문화의 새로운 장이 열렸습니다.'],
  ['1675–1700','동아시아와 유럽에서 음악 이론·악보가 발전한 사례를 하나씩 들어보세요.','중국의 주재육 12평균율 이론, 러시아 딜레츠키의 이론서, 한국의 《신증금보》, 독일의 베르크마이스터 조율법 등을 비교할 수 있습니다.']
];

let chapters = [], curation = {}, media = {images:{},audio:{}};
let enrichment = {sources:{},chapters:{}}, gallery = {};
let searchQuery = '';
let currentFilter = 'all';
let audioFile = null;
let saveDebounce;
let study = loadStudy();

function loadStudy(){
  try {const val=JSON.parse(localStorage.getItem(storageKey));if(val && typeof val==='object') return {notes: val.notes || {}, read: val.read || {}};} catch{}
  return {notes:{},read:{}};
}
function persistStudy(){try {localStorage.setItem(storageKey, JSON.stringify(study));}catch{}}
function mediaLink(label,href,extra=''){return href ? `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer" ${extra}>${esc(label)}</a>`:'';}
function mediaImage(ch,cur){
  const asset=media.images?.[ch.id];
  if(!asset?.url) return `<div class="image-frame no-image"><span class="image-overprint">HISTORICAL RECORD · ARCHIVE PENDING</span><span class="image-symbol" aria-hidden="true">${esc(countryMap[ch.countryId].symbol)}</span><span class="image-number">${String(ch.page).padStart(2,'0')}</span></div>`;
  return `<div class="image-frame"><span class="image-overprint">ARCHIVE / ${esc(ch.country.toUpperCase())}</span><img class="scene-image" src="${esc(asset.url)}" loading="lazy" decoding="async" alt="${esc(cur.imageCaption)}" /><span class="image-number">${String(ch.page).padStart(2,'0')}</span></div>`;
}
function buildAudioHtml(ch,cur){
  const available=(cur.audioFiles || []).filter(key => !!media.audio?.[key]?.url);
  if(!available.length){
    const query=encodeURIComponent([ch.country,ch.title,'17th century music'].join(' '));
    return `<div class="no-audio">검증된 자유 이용 녹음을 아직 연결하지 않았습니다. 시대를 잘못 대표하는 녹음을 임의로 재생하지 않습니다.<br/><a href="https://commons.wikimedia.org/w/index.php?search=${query}&title=Special:MediaSearch&type=audio" target="_blank" rel="noopener noreferrer">Wikimedia Commons에서 관련 음악 찾기 ↗</a></div>`;
  }
  return available.map(key=>{
    const obj=media.audio[key];
    return `<button class="listen-card" data-audio-file="${esc(key)}" data-chapter="${esc(ch.id)}" type="button" aria-label="${esc(trackNames[key]||key)} 재생"><span class="play-glyph" aria-hidden="true">▶</span><span><strong class="listen-title">${esc(trackNames[key] || key.replace(/\.(ogg|oga|wav|mp3)$/i,''))}</strong><small class="listen-license">${esc(obj.license||'출처 확인')} · ${esc(obj.kind||'현대 연주 녹음')} · 눌러서 듣기</small></span></button>`;
  }).join('');
}
function richContext(ch){
  const item=enrichment.chapters?.[ch.id];
  if(!item) return '';
  const sections=[
    ['01','정치·사회·생활',item.setting],
    ['02','왜 이 음악이 필요했고 퍼졌을까?',item.why],
    ['03','무엇이 음악적으로 달라졌을까?',item.musical]
  ];
  const sources=(item.sources || []).map(key=>enrichment.sources?.[key]).filter(Boolean);
  return `<section class="historical-context" aria-label="${esc(ch.country)} ${ch.start}년 역사 심화 설명">
    <p class="context-kicker">CONTEXT / WHY / SOUND</p>
    <h3>시대가 음악을 바꾼 이유</h3>
    <div class="context-sections">${sections.map(([n,name,copy])=>`<section class="context-panel"><small><span>${n}</span> ${esc(name)}</small><p>${esc(copy)}</p></section>`).join('')}</div>
    <section class="people-context"><h4>시대를 움직인 사람들</h4><ul>${(item.people || []).map(p=>`<li>${esc(p)}</li>`).join('')}</ul></section>
    ${item.caution?`<aside class="historical-caveat"><strong>사료 해석 주의</strong><p>${esc(item.caution)}</p></aside>`:''}
    <section class="source-reading"><h4>이 장면의 연구 자료</h4><p>PDF ${ch.page}쪽의 사건 기록을 기본으로 삼고, 아래 자료로 배경을 보완했습니다.</p><div class="source-link-set">${sources.map(src=>`<a href="${esc(src.url)}" target="_blank" rel="noopener noreferrer" title="${esc(src.label)} 원문 열기"><small>${esc(src.type)}</small><strong>${esc(src.label)}</strong><span aria-hidden="true">↗</span></a>`).join('')}</div></section>
  </section>`;
}
function historicalGallery(ch){
  const items=gallery?.[ch.id] || [];
  const enriched=enrichment.chapters?.[ch.id];
  const curated=(items||[]).filter(item=>item.url&&item.source);
  if(!curated.length) return '';
  return `<section class="historical-gallery" aria-label="역사 자료 이미지 갤러리">
    <div class="gallery-label"><div><p class="context-kicker">VISUAL ARCHIVE</p><h3>이미지로 읽는 역사</h3></div><span>추가 사료·인물·악보 · ${curated.length}점</span></div>
    <div class="gallery-grid">${curated.map((item,i)=>`<figure class="gallery-figure"><a href="${esc(item.source)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(item.caption||item.title)} 사료 원본·저작권 보기"><div class="gallery-image"><img src="${esc(item.url)}" loading="lazy" decoding="async" alt="${esc(item.caption||item.title)}"/><span class="gallery-kind">${esc(item.type||'사료')}</span></div></a><figcaption><strong>${esc(item.caption||item.title)}</strong>${item.note?`<small class="gallery-date-note">${esc(item.note)}</small>`:''}<small class="gallery-credit">${esc(item.license)} · ${esc((item.artist||'자료 소장자/제작자 정보는 원문 확인').slice(0,70))}</small></figcaption></figure>`).join('')}</div>
    ${enriched?.look?`<p class="look-prompt"><span>관찰 포인트</span>${esc(enriched.look)}</p>`:''}
    <p class="gallery-license-disclaimer">사료 이미지와 현대 사진·후대의 역사화는 자료마다 제작 시점이 다릅니다. 모든 그림을 17세기의 직접 기록으로 간주하지 마세요. 원본과 사용 조건은 각 이미지를 눌러 확인할 수 있습니다.</p>
  </section>`;
}
function eventText(evt){return evt.text.replace(new RegExp('^'+evt.year+'(?:경|년대|년)?\\s*'),'').trim() || evt.text;}
function buildChapter(ch){
  const country=countryMap[ch.countryId];const cur=curation[ch.id] || {audioFiles:[]};const img=media.images?.[ch.id];
  const events=ch.events.map(item=>`<div class="event-item"><time>${esc(item.year)}${item.approx?'경':''}</time><p>${esc(eventText(item))}</p></div>`).join('');
  const meta=img? `${mediaLink('원본 이미지',img.source)} · ${esc(img.license||'권리 정보 확인')} ${img.artist?' · '+esc(img.artist.slice(0,75)):''}`:'이미지 및 저작권 검증 진행 중';
  const read=!!study.read[ch.id];
  return `<section class="chapter" id="${esc(ch.id)}" style="--accent:${country.color}" data-country="${esc(ch.countryId)}" data-era="${ch.eraIndex}" aria-labelledby="title-${esc(ch.id)}">
    <div class="chapter-grid">
      <div class="visual-column"><figure style="margin:0">${mediaImage(ch,cur)}<figcaption class="image-caption"><span>${esc(cur.imageCaption||ch.title)}</span>${mediaLink('사료 보기 ↗',img?.source||'')}</figcaption></figure></div>
      <article class="story-column"><div class="story-tag"><span class="country-dot"></span><b>${esc(ch.country)} / ${country.code}</b><span>•</span><span>${ch.start}—${ch.end}</span><span>•</span><span>${String(ch.page).padStart(2,'0')} / 32</span></div>
      <p class="story-year">${ch.start}<small>– ${ch.end}</small></p><h2 class="story-title" id="title-${esc(ch.id)}">${esc(ch.title)}</h2><p class="story-summary">${esc(ch.summary)}</p>
      ${richContext(ch)}${historicalGallery(ch)}<div class="story-divider"></div><div class="listen-heading"><strong>이 장면의 소리</strong><span>EXPLICIT PLAY ONLY</span></div><div class="audio-list">${buildAudioHtml(ch,cur)}</div>
      <p class="listening-note">${esc(cur.listeningNote||'음원마다 연주 시기와 역사적 맥락을 확인해 보세요.')}</p>
      <div class="question-box"><small>THINK ABOUT IT</small><p>${esc(cur.question||'음악은 이 시대의 사회 변화와 어떤 관계가 있을까요?')}</p></div>
      <button class="notes-toggle" type="button" data-notes-toggle="${esc(ch.id)}" aria-expanded="false"><span>✎ 나의 학습 메모</span><span>열기 +</span></button><div class="notes-panel" data-notes-panel="${esc(ch.id)}" hidden><label for="note-${esc(ch.id)}">이 장면에서 기억할 것</label><textarea id="note-${esc(ch.id)}" placeholder="느낀 점, 비교할 내용, 궁금한 점을 적어보세요."></textarea><small>메모는 이 브라우저에만 저장됩니다.</small><button type="button" data-notes-save="${esc(ch.id)}">메모 저장</button></div>
      <details class="events-disclosure"><summary>연표 사건 모두 보기 <span>${ch.events.length}개</span></summary><div class="event-timeline">${events}</div></details>
      <button class="notes-toggle read-toggle" type="button" data-mark-read="${esc(ch.id)}" aria-pressed="${read}"><span>${read?'✓ 학습 완료 표시됨':'○ 이 장면 학습 완료 표시'}</span><span>${read?'완료':'표시'}</span></button>
      <p class="chapter-source-note"><span></span>원본 연표 ${ch.page}쪽 · 이미지: ${meta}</p>
      </article>
    </div>
  </section>`;
}
function renderAtlas(){
  const sorted=[...chapters].sort((a,b)=>a.eraIndex-b.eraIndex || countryInfo.findIndex(c=>c.id===a.countryId)-countryInfo.findIndex(c=>c.id===b.countryId));
  const fragments=[];
  for(let i=0;i<eras.length;i++){
    const era=eras[i];
    fragments.push(`<section class="era-divider" id="era-${i}" data-number="${String(i+1).padStart(2,'0')}" aria-label="${era.start}년부터 ${era.end}년까지"><div class="section-container"><p class="era-caption">CHAPTER ${String(i+1).padStart(2,'0')} · A QUARTER CENTURY</p><h2>${era.start}—${era.end}</h2><p>${esc(era.label)} · ${esc(era.summary)}</p></div></section>`);
    fragments.push(...sorted.filter(c=>c.eraIndex===i).map(buildChapter));
  }
  $('#atlas').innerHTML=fragments.join('');
  // Re-populate note fields with browser-local drafts after rendering.
  for(const ch of chapters){const field=$(`#note-${ch.id}`);if(field) field.value=study.notes[ch.id] || '';}
  applyFilter('all',false);
  attachScrollObserver();
}
function renderControls(){
  $('#countryMosaic').innerHTML=countryInfo.map(c=>`<button class="mosaic-item" data-filter="${c.id}" type="button"><span class="mosaic-icon" aria-hidden="true" style="color:${c.color}">${c.symbol}</span><strong>${c.name}</strong><small>4개 시기</small></button>`).join('');
  $('#countryFilters').innerHTML=`<button class="filter-chip" data-filter="all" aria-pressed="true" type="button">전체 8개국</button>`+countryInfo.map(c=>`<button class="filter-chip" data-filter="${c.id}" aria-pressed="false" type="button">${c.name}</button>`).join('');
  $('#eraNav').innerHTML=eras.map((e,i)=>`<a class="era-link" href="#era-${i}"><span>${e.start}–${e.end}</span><small>${esc(e.label)}</small></a>`).join('');
  $('#learningChecks').innerHTML=studyAnswers.map(([period,q,a])=>`<div class="learning-check"><small>${period}</small><h3>${esc(q)}</h3><details><summary>생각한 뒤 답 펼치기 +</summary><p>${esc(a)}</p></details></div>`).join('');
}
let intersectionObserver;
function attachScrollObserver(){
  intersectionObserver?.disconnect();
  intersectionObserver=new IntersectionObserver(entries=>{
    const most=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!most)return;
    $$('.chapter.is-active').forEach(el=>el.classList.remove('is-active'));
    most.target.classList.add('is-active');
    const visible=$$('.chapter:not([hidden])');
    const index=visible.indexOf(most.target)+1;
    const country=countryMap[most.target.dataset.country];
    $('#headerProgress').textContent=`${String(index).padStart(2,'0')} / ${String(visible.length).padStart(2,'0')} · ${country.name}`;
  },{rootMargin:'-24% 0px -44% 0px',threshold:[0,.05,.15,.35,.5]});
  $$('.chapter').forEach(c=>intersectionObserver.observe(c));
}
function applyFilter(id,scroll=true){
  currentFilter=id;
  let visible=0;
  const query=searchQuery.toLocaleLowerCase('ko').trim();
  $$('.chapter').forEach(el=>{
    const idOk=id==='all'||el.dataset.country===id;
    const ch=chapters.find(c=>c.id===el.id);
    const rich=enrichment.chapters?.[el.id];
    const haystack=[ch?.title,ch?.summary, ...(ch?.events||[]).map(e=>e.text),rich?.setting,rich?.why,rich?.musical,...(rich?.people||[])].filter(Boolean).join(' ').toLocaleLowerCase('ko');
    const show=idOk && (!query || haystack.includes(query));
    el.hidden=!show;if(show)visible++;
  });
  $$('[data-filter]').forEach(ch=>{const active=ch.dataset.filter===id;ch.setAttribute('aria-pressed',String(active));});
  $('#resultCount').textContent=`${visible}개 장면 · 완료 ${Object.entries(study.read).filter(([ch,done])=>done && (id==='all' || ch.startsWith(id+'-'))).length}개`;
  if(scroll)$('#atlas').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
}
function formatTime(seconds){if(!Number.isFinite(seconds))return '0:00';return `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;}
function updatePlayerUi(){
  const el=$('#audioEl');const duration=el.duration||0;
  $('#audioCurrent').textContent=formatTime(el.currentTime||0);
  $('#audioDuration').textContent=formatTime(duration);
  $('#audioSeek').value=duration?String(Math.round(el.currentTime/duration*100)):0;
  const playing=!el.paused&&!el.ended;
  $('#playPause').textContent=playing?'Ⅱ':'▶';
  $('#playPause').setAttribute('aria-label',playing?'일시정지':'재생');
  $$('.listen-card').forEach(b=>{b.classList.toggle('is-playing',playing&&b.dataset.audioFile===audioFile);b.querySelector('.play-glyph').textContent=playing&&b.dataset.audioFile===audioFile?'Ⅱ':'▶';});
}
async function playFile(key){
  const obj=media.audio[key];if(!obj?.url)return;
  const el=$('#audioEl');
  if(audioFile===key){if(el.paused) await el.play().catch(showPlayError); else el.pause();updatePlayerUi();return;}
  audioFile=key;el.pause();el.src=obj.url;el.load();
  $('#audioDock').hidden=false;$('#audioTitle').textContent=trackNames[key] || key.replace(/\.[^.]+$/,'');
  $('#audioMeta').textContent=[obj.license,obj.artist].filter(Boolean).join(' · ').slice(0,120);
  $('#audioSource').href=obj.source || 'https://commons.wikimedia.org/';
  await el.play().catch(showPlayError);updatePlayerUi();
}
function showPlayError(e){$('#audioMeta').textContent='재생 실패: 원본 사이트에서 직접 들어보세요. 재생 형식/네트워크 지원을 확인해 주세요.';$('#playPause').textContent='▶';console.warn('audio playback unavailable',e);}
function toggleNotes(id){const p=$(`[data-notes-panel="${CSS.escape(id)}"]`);const b=$(`[data-notes-toggle="${CSS.escape(id)}"]`);if(!p||!b)return;const expanded=b.getAttribute('aria-expanded')==='true';p.hidden=expanded;b.setAttribute('aria-expanded',String(!expanded));b.querySelector('span:last-child').textContent=expanded?'열기 +':'닫기 −';if(!expanded)$(`#note-${id}`)?.focus();}
function saveNote(id){const txt=$(`#note-${id}`)?.value||'';study.notes[id]=txt;persistStudy();const b=$(`[data-notes-save="${CSS.escape(id)}"]`);if(b){b.textContent='저장됨 ✓';clearTimeout(saveDebounce);saveDebounce=setTimeout(()=>{if(b.isConnected)b.textContent='메모 저장';},1600);}}
function markRead(id){study.read[id]=!study.read[id];persistStudy();const b=$(`[data-mark-read="${CSS.escape(id)}"]`);const yes=study.read[id];b.setAttribute('aria-pressed',String(yes));b.innerHTML=`<span>${yes?'✓ 학습 완료 표시됨':'○ 이 장면 학습 완료 표시'}</span><span>${yes?'완료':'표시'}</span>`;applyFilter(currentFilter,false);}
function exportNotes(){
  const data={version:1,title:'17세기 소리의 세계 — 학습 메모',createdAt:new Date().toISOString(),notes:study.notes,read:study.read};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='17-century-music-study-notes.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}
function syncProgress(){
  const limit=document.documentElement.scrollHeight-innerHeight;
  $('#readingMeter').style.width=`${limit>0?Math.min(100,Math.max(0,scrollY/limit*100)):0}%`;
}
function bindEvents(){
  document.addEventListener('click',event=>{
    const filter=event.target.closest('[data-filter]');if(filter){applyFilter(filter.dataset.filter);return;}
    const listen=event.target.closest('[data-audio-file]');if(listen){playFile(listen.dataset.audioFile);return;}
    const toggle=event.target.closest('[data-notes-toggle]');if(toggle){toggleNotes(toggle.dataset.notesToggle);return;}
    const save=event.target.closest('[data-notes-save]');if(save){saveNote(save.dataset.notesSave);return;}
    const read=event.target.closest('[data-mark-read]');if(read){markRead(read.dataset.markRead);return;}
  });
  const audio=$('#audioEl');['loadedmetadata','timeupdate','play','pause','ended'].forEach(ev=>audio.addEventListener(ev,updatePlayerUi));
  audio.addEventListener('error',()=>{if(audioFile)showPlayError('media error');});
  $('#playPause').addEventListener('click',()=>{if(audio.paused)audio.play().catch(showPlayError);else audio.pause();});
  $('#audioSeek').addEventListener('input',e=>{if(Number.isFinite(audio.duration))audio.currentTime=audio.duration*Number(e.target.value)/100;});
  $('#closeAudio').addEventListener('click',()=>{audio.pause();audio.removeAttribute('src');audio.load();audioFile=null;$('#audioDock').hidden=true;updatePlayerUi();});
  $('#atlasSearch').addEventListener('input',e=>{searchQuery=e.target.value||'';applyFilter(currentFilter,false);});
  $('#atlasSearchClear').addEventListener('click',()=>{searchQuery='';$('#atlasSearch').value='';applyFilter(currentFilter,false);$('#atlasSearch').focus();});
  $('#exportNotes').addEventListener('click',exportNotes);
  $('#openAbout').addEventListener('click',()=>$('#aboutDialog').showModal());
  $('#openSources').addEventListener('click',()=>$('#aboutDialog').showModal());
  $('#closeAbout').addEventListener('click',()=>$('#aboutDialog').close());
  $('#aboutDialog').addEventListener('click',e=>{if(e.target===$('#aboutDialog'))$('#aboutDialog').close();});
  window.addEventListener('scroll',syncProgress,{passive:true});window.addEventListener('resize',syncProgress,{passive:true});
}
async function init(){
  try{
    const embedded=window.__SOUND_ATLAS_DATA__;
    if(embedded && Array.isArray(embedded.chapters)){
      [chapters,curation,media]=[embedded.chapters,embedded.curation,embedded.media];
      enrichment=embedded.enrichment||enrichment;gallery=embedded.gallery||gallery;
    }else{
      const urls=['./src/data/chapters.json','./src/data/curation.json','./src/data/media.json','./src/data/enriched.json','./src/data/gallery.json'];
      const responses=await Promise.all(urls.map(u=>fetch(u,{cache:'no-cache'})));
      for(const [i,res] of responses.entries())if(!res.ok)throw new Error(`${urls[i]}: HTTP ${res.status}`);
      [chapters,curation,media,enrichment,gallery]=await Promise.all(responses.map(r=>r.json()));
    }
    if(!Array.isArray(chapters)||chapters.length!==32)throw new Error('본문 32개 장면을 불러오지 못했습니다.');
    renderControls();renderAtlas();bindEvents();syncProgress();
    if(location.hash){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target)setTimeout(()=>target.scrollIntoView({block:'start'}),50);}
  }catch(e){console.error(e);$('#atlas').innerHTML=`<div class="section-container" style="padding:60px 0;color:#e9c1a8"><h2>자료를 불러오지 못했습니다.</h2><p>${esc(e.message)}</p><p>로컬에서는 파일을 직접 더블클릭하지 말고 웹 서버(http://localhost)로 열어 주세요.</p></div>`;}
}
init();
