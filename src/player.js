// Reuse one media element so the initial tap authorizes subsequent scene changes.
const byId = id => document.getElementById(id);
const clock = seconds => {
  const value = Number.isFinite(seconds) ? Math.floor(seconds) : 0;
  return Math.floor(value / 60) + ':' + String(value % 60).padStart(2, '0');
};

export function initPlayer({chapters, curation, tracks, titleFor}) {
  const audio = byId('audioEl');
  const dock = byId('audioDock');
  const play = byId('playPause');
  const seek = byId('audioSeek');
  const info = byId('audioDetails');
  const sceneById = new Map(chapters.map(scene => [scene.id, scene]));
  const followButtons = [...document.querySelectorAll('[data-sound-follow]')];
  const cards = [...document.querySelectorAll('[data-audio-file]')];
  const scenes = [...document.querySelectorAll('.chapter')];
  let following = false;
  let selectedScene = null;
  let selectedKey = null;
  let activeAttempt = null;
  let switchTimer = 0;
  let frame = 0;
  let pendingScene = null;
  let pendingTracks = [];
  let lastOpener = null;

  function playlist(id) {
    return [...new Set(curation[id]?.audioFiles || [])].filter(key => tracks[key]?.url);
  }

  function readingScene() {
    const line = window.innerHeight * 0.39;
    let result = null;
    for (const element of scenes) {
      if (element.hidden) continue;
      if (!result) result = element.id;
      if (element.getBoundingClientRect().top > line) break;
      result = element.id;
    }
    return result;
  }

  function clearSwitch() {
    clearTimeout(switchTimer);
    pendingScene = null;
  }

  function setFollowing(value) {
    following = value;
    clearSwitch();
    for (const button of followButtons) {
      button.setAttribute('aria-pressed', String(value));
      const label = button.querySelector('[data-follow-label]');
      if (label) {
        label.dataset.idleText ??= label.textContent;
        label.textContent = value ? (button.dataset.followOn || '스크롤 음악 끄기') : label.dataset.idleText;
      }
    }
  }

  function updateTransport() {
    const playing = !audio.paused && !audio.ended;
    play.disabled = !selectedKey;
    play.setAttribute('aria-label', playing ? '음악 일시정지' : '음악 재생');
    play.dataset.playing = String(playing);
    for (const card of cards) {
      const current = playing && card.dataset.audioFile === selectedKey && card.dataset.chapter === selectedScene;
      if (card.getAttribute('aria-pressed') === String(current)) continue;
      card.classList.toggle('is-playing', current);
      card.setAttribute('aria-pressed', String(current));
      card.setAttribute('aria-label', titleFor(card.dataset.audioFile) + (current ? ' 일시정지' : ' 재생'));
      card.querySelector('.play-glyph').textContent = current ? 'Ⅱ' : '▶';
    }
  }

  function updateTime() {
    const duration = audio.duration;
    const ready = Number.isFinite(duration) && duration > 0;
    seek.disabled = !ready;
    seek.max = ready ? String(duration) : '1';
    seek.value = ready ? String(audio.currentTime) : '0';
    seek.setAttribute('aria-valuetext', clock(audio.currentTime) + ' / ' + clock(duration));
    byId('audioCurrent').textContent = clock(audio.currentTime);
    byId('audioDuration').textContent = clock(duration);
  }

  function describe(sceneId, key) {
    selectedScene = sceneId;
    selectedKey = key;
    const scene = sceneById.get(sceneId);
    const track = tracks[key];
    byId('audioScene').textContent = scene ? scene.country + ' · ' + scene.start + '–' + scene.end : '';
    byId('audioTitle').textContent = key ? titleFor(key) : '이 장면에 연결된 녹음이 없습니다';
    byId('audioStatus').textContent = '';
    info.hidden = !track;
    info.open = false;
    if (track) {
      info.querySelector('.audio-credits strong').textContent = titleFor(key);
      byId('audioMeta').textContent = track.artist || '원본 자료의 크레디트 참고';
      byId('audioEdit').textContent = track.clipNote || '';
      const source = byId('audioSource');
      source.hidden = !track.source;
      if (track.source) source.href = track.source;
      const license = byId('audioLicense');
      const licenseText = byId('audioLicenseText');
      license.hidden = !track.licenseUrl;
      licenseText.hidden = !!track.licenseUrl;
      if (track.licenseUrl) license.href = track.licenseUrl;
      (track.licenseUrl ? license : licenseText).textContent = track.license || '이용 조건';
    }
    dock.hidden = false;
  }

  function pause() {
    setFollowing(false);
    activeAttempt = null;
    pendingTracks = [];
    audio.pause();
    updateTransport();
  }

  function failure(attempt, error) {
    if (activeAttempt !== attempt || error?.name === 'AbortError') return;
    activeAttempt = null;
    if (error?.name === 'NotAllowedError') {
      pause();
      byId('audioStatus').textContent = '재생 버튼을 눌러 음악을 시작하세요.';
      return;
    }
    const next = pendingTracks.shift();
    if (following && next) {
      loadTrack(selectedScene, next);
      return;
    }
    byId('audioStatus').textContent = '녹음을 열 수 없습니다. 재생으로 다시 시도하거나 음원 정보에서 원본을 열어 보세요.';
    updateTransport();
  }

  function startPlayback() {
    const attempt = {};
    activeAttempt = attempt;
    byId('audioStatus').textContent = '';
    document.dispatchEvent(new Event('atlas:music-play'));
    const operation = audio.play();
    operation?.catch(error => failure(attempt, error));
    updateTransport();
  }

  function loadTrack(sceneId, key) {
    const changed = key !== selectedKey;
    const previousScene = selectedScene;
    describe(sceneId, key);
    if (!key) {
      activeAttempt = null;
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      updateTime();
      updateTransport();
      return;
    }
    if (changed || audio.error || !audio.hasAttribute('src')) {
      audio.src = tracks[key].url;
      audio.load();
    } else if (audio.ended) {
      audio.currentTime = 0;
    } else if (previousScene !== sceneId && !audio.paused) {
      // An adjacent chapter can cite the same performance. Keep its position.
      updateTransport();
      return;
    }
    startPlayback();
  }

  function followScene(sceneId) {
    if (!sceneId) {
      close(false);
      return;
    }
    const [first, ...alternatives] = playlist(sceneId);
    pendingTracks = alternatives;
    loadTrack(sceneId, first || null);
  }

  function scheduleSwitch() {
    if (!following || document.hidden || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!following || document.hidden) return;
      const next = readingScene();
      if (!next) {
        close(false);
        return;
      }
      if (next === selectedScene) {
        clearSwitch();
        return;
      }
      if (next === pendingScene) return;
      clearSwitch();
      pendingScene = next;
      switchTimer = setTimeout(() => {
        pendingScene = null;
        if (following && !document.hidden && readingScene() === next) followScene(next);
      }, 360);
    });
  }

  function close(restoreFocus = true) {
    pause();
    selectedKey = null;
    selectedScene = null;
    audio.removeAttribute('src');
    audio.load();
    dock.hidden = true;
    info.open = false;
    if (restoreFocus && lastOpener?.isConnected && lastOpener.getClientRects().length) {
      lastOpener.focus({preventScroll: true});
    }
  }

  document.addEventListener('click', event => {
    const follow = event.target.closest('[data-sound-follow]');
    if (follow) {
      if (following) {
        pause();
      } else {
        if (!dock.contains(follow)) lastOpener = follow;
        setFollowing(true);
        followScene(readingScene());
      }
      return;
    }
    const card = event.target.closest('[data-audio-file]');
    if (card) {
      lastOpener = card;
      const {chapter, audioFile} = card.dataset;
      if (chapter === selectedScene && audioFile === selectedKey && !audio.paused) {
        pause();
      } else {
        setFollowing(false);
        pendingTracks = [];
        loadTrack(chapter, audioFile);
      }
      return;
    }
    if (info.open && !info.contains(event.target)) info.open = false;
  });
  play.addEventListener('click', () => {
    if (!audio.paused) pause();
    else if (selectedKey) loadTrack(selectedScene, selectedKey);
  });
  byId('closeAudio').addEventListener('click', () => close());
  seek.addEventListener('input', () => {
    if (!seek.disabled) audio.currentTime = Number(seek.value);
  });
  info.addEventListener('keydown', event => {
    if (event.key === 'Escape' && info.open) {
      info.open = false;
      info.querySelector('summary').focus();
    }
  });
  window.addEventListener('scroll', scheduleSwitch, {passive: true});
  window.addEventListener('resize', scheduleSwitch, {passive: true});
  // A country filter can change the current scene without moving the viewport.
  const observer = new MutationObserver(scheduleSwitch);
  for (const scene of scenes) observer.observe(scene, {attributes: true, attributeFilter: ['hidden']});
  document.addEventListener('visibilitychange', () => document.hidden ? clearSwitch() : scheduleSwitch());
  document.addEventListener('atlas:concept-play', pause);
  for (const name of ['timeupdate', 'loadedmetadata', 'durationchange', 'emptied']) audio.addEventListener(name, updateTime);
  for (const name of ['playing', 'pause']) audio.addEventListener(name, updateTransport);
  audio.addEventListener('ended', () => {
    updateTransport();
    if (following && !document.hidden && readingScene() === selectedScene) {
      const next = pendingTracks.shift();
      if (next) loadTrack(selectedScene, next);
    }
  });
  audio.addEventListener('error', () => {
    if (activeAttempt && audio.error) failure(activeAttempt, audio.error);
  });
  setFollowing(false);
  updateTransport();
  updateTime();
}
