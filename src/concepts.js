// Each mark stores its onset, duration and pitch. The diagram and synthesizer
// read the same events so either representation can be used on its own.
function note(at, length, pitch, options = {}) {
  return { at, length, pitch, ...options };
}
function line(pitches, step = 0.56, at = 0) {
  return pitches.map((pitch, i) => note(at + i * step, step * 0.92, pitch));
}
function row(label, notes, tone = 'clear') {
  return { label, notes, tone };
}
function example(label, detail, rows) {
  return { label, detail, rows };
}

const theme = [67, 69, 71, 74, 72, 71];
const upper = row('높은 선율', line(theme));
const lower = row('낮은 선율', line([48, 45, 43], 1.12), 'plucked');
const metTerms = ['메트로폴리탄 미술관 · 바로크 음악 용어', 'https://www.metmuseum.org/essays/musical-terms-for-the-seventeenth-and-eighteenth-centuries'];
const operaTerms = ['메트로폴리탄 오페라 · 레치타티보와 아리아', 'https://www.metopera.org/discover/education/educator-guides/agrippina/classroom-activities/arias-of-influence/'];
const choirSource = ['캐나다 우크라이나연구소 · 교회음악의 전개', 'https://www.encyclopediaofukraine.com/Culture.asp'];
const qinSource = ['유네스코 · 고금과 그 음악', 'https://ich.unesco.org/en/RL/guqin-and-its-music-00061'];
const rhythm = (times) => times.map(([at, len], i) => note(at, len, [67, 69, 71, 69][i % 4]));
const syllables = ['어', '디', '로', '가', '나'];
const verse = (times, pitches) => times.map(([at, length], i) => note(at, length, pitches[i], { text: syllables[i] }));
const bassPattern = [48, 47, 45, 43];
const openStrings = (pitches) => row('개방현', line(pitches, 0.7), 'plucked');
const chorus1 = row('첫째 성부', line([65, 67, 69, 67, 65, 64]));
const choir1 = [note(0, 0.82, 67), note(0.9, 0.82, 64)];
const choir2 = [note(1.8, 0.82, 62), note(2.7, 0.82, 65)];
const geomungo = ['국립국악원 · 술대를 쥐고 연주하는 법', 'https://www.gugak.go.kr/ency/topic/view/1752'];

const lessons = {
  monody: {
    title: '모노디에서 노랫말을 이끄는 선율',
    prompt: '피렌체의 작곡가들은 노랫말의 억양과 정서를 살리려 독창과 반주를 결합했습니다. 같은 노랫가락을 혼자 듣고, 다음에는 반주와 함께 들어 보세요.',
    source: ['옥스퍼드 대학교 출판부 · 초기 바로크의 모노디', 'https://academic.oup.com/book/49200/chapter-abstract/422057916'],
    examples: [
      example('독창의 가락', '‘어디로 가나’ 다섯 음절의 높낮이를 먼저 익혀 보세요.', [row('노랫가락', verse([[0,.45],[.5,.45],[1,.85],[1.9,.4],[2.35,.7]],[67,69,72,71,67]))]),
      example('반주와 함께', '말의 높낮이는 한 성부가 이끌고 반주가 아래에서 받칩니다. 모노디에서 서로 다른 역할을 맡는 두 층입니다.', [
        row('노랫가락', verse([[0,.45],[.5,.45],[1,.85],[1.9,.4],[2.35,.7]],[67,69,72,71,67])),
        row('반주', [note(0,.92,48),note(0,.92,64),note(1,.84,53),note(1,.84,65),note(1.9,1.12,43),note(1.9,1.12,59)],'plucked')
      ])
    ]
  },
  kunqu: {
    title: '곤곡에서 동작을 짚어 주는 타악',
    prompt: '곤곡 배우의 노래에는 대나무 피리와 북, 박자목, 징 등이 함께합니다. 타악기는 무대의 움직임과 감정을 짚어 주기도 합니다. 이 예시에서 몸을 돌리고 멈추는 두 순간을 들어 보세요.',
    source: ['유네스코 · 곤곡 영상과 해설', 'https://ich.unesco.org/en/RL/kun-qu-opera-00004'],
    examples: [
      example('가락만', '네 음이 이어집니다. 무대 동작의 시점을 표시하는 소리는 아직 없습니다.', [row('가락',line([65,69,67,65],.7),'soft')]),
      example('동작에 타악 넣기', '둘째 음에서 돌아서고 넷째 음에서 멈춘다고 가정했습니다. 아래 줄의 짧은 타격음 둘이 그 시점을 표시합니다.', [row('가락',line([65,69,67,65],.7),'soft'),row('동작', [note(.7,.11,49),note(2.1,.16,49)],'plucked')])
    ]
  },
  lute: {
    title: '류트 가곡에서 반주를 따라가기',
    prompt: '17세기 초의 궁정과 가정에서는 류트 소리에 맞춰 노래를 불렀습니다. 예시에서 노랫가락이 긴 음을 붙들고 있는 동안, 반주가 몇 음을 더 짚는지 들어 보세요.',
    source: ['폴저 셰익스피어 도서관 · 영국의 류트 가곡', 'https://www.folger.edu/whats-on/shakespeare-in-step-and-song/'],
    examples: [
      example('노랫가락', '두 개의 긴 음이 이어집니다.', [row('노랫가락', line([67,65],1.5),'soft')]),
      example('류트 반주를 더하면', '긴 음 하나가 이어지는 동안 반주에서 짧은 세 음을 뜯습니다.', [row('노랫가락', line([67,65],1.5),'soft'),row('반주',line([48,55,64,50,57,62],.5),'plucked')])
    ]
  },
  royalStrings: {
    title: '현악 합주의 안쪽 성부 듣기',
    prompt: '프랑스 왕실의 ‘24 바이올린’에는 다섯 성부가 있었습니다. 양끝 음역을 먼저 듣고 중간에 세 성부를 더해 보세요.',
    source: ['베르사유 바로크 음악센터 · 왕의 24 바이올린', 'https://cmbv.fr/en/resources/cmbv-collections/instruments/les-vingt-quatre-violons-du-roi'],
    examples: [
      example('위와 아래', '가장 높은 선율과 가장 낮은 성부만 들립니다.', [upper, lower]),
      example('다섯 성부', '세 중간 성부가 양끝 음역 사이를 채웁니다. 도식의 줄 수는 서로 다른 성부의 수를 뜻합니다.', [
        upper,row('중간 1',line([64,64,62],1.12),'soft'),row('중간 2',line([60,60,59],1.12),'soft'),row('중간 3',line([55,57,55],1.12),'soft'),lower
      ])
    ]
  },
  fifths: {
    title: '5도씩 옮겨 가는 길',
    prompt: '딜레츠키는 17세기 후반에 5도로 연결되는 조들의 관계를 그림으로 제시했습니다. 출발음을 도로 잡고 완전5도씩 옮겨 보세요. 두 번째 경로에서는 같은 음이름이 듣기 편한 옥타브에 놓입니다.',
    source: ['미국 음악학회 · 딜레츠키의 음악 문법과 5도권', 'https://online.ucpress.edu/jams/article-abstract/45/2/305/50490/A-Theoretical-Work-of-Late-Seventeenth-Century'],
    examples: [
      example('쌓아 올리기', '도–솔–레–라. 매번 완전5도씩 높아집니다.', [row('음이름', line([48,55,62,69],.7).map((n,i) => ({...n,text:['도','솔','레','라'][i]})))]),
      example('한 옥타브 안에 놓기', '레와 라를 낮은 옥타브로 옮겨도 이어지는 음이름의 순서는 같습니다.', [row('음이름',line([48,55,50,57],.7).map((n,i) => ({...n,text:['도','솔','레','라'][i]})))])
    ]
  },
  articulation: {
    title: '현을 뜯는 소리와 켜는 소리',
    prompt: '스코모로히가 사용한 악기에는 줄을 뜯는 구슬리와 활로 켜는 구도크가 있었습니다. 같은 음을 낼 때 시작한 소리의 세기가 어떻게 달라질까요?',
    source: ['미국 의회도서관 소장 자료 · 스코모로히의 악기', 'https://tile.loc.gov/storage-services/master/gdc/gdcebookspublic/20/19/66/67/85/2019666785/2019666785.pdf'],
    examples: [
      example('뜯기', '처음이 가장 또렷하고 손을 뗀 뒤 소리가 점점 약해집니다.', [row('뜯는 줄', line([60,62,60],.9),'plucked')]),
      example('켜기', '활을 계속 움직여 한 음의 울림을 유지하는 과정을 단순화했습니다.', [row('켜는 줄',line([60,62,60],.9),'bowed')])
    ]
  },
  continuo: {
    title: '통주저음에서 화음 찾기',
    prompt: '낮은 음 세 개를 먼저 따라가 보세요. 바로크의 통주저음 연주자는 적힌 저음과, 때로는 그 위에 적힌 숫자를 바탕으로 화음을 채웠습니다.',
    source: metTerms,
    examples: [
      example('저음만', '도–라–솔의 낮은 줄기만 남긴 예입니다.', [lower]),
      example('화음을 채우면', '낮은 음이 바뀌는 때에 맞춰 위에서 두 음이 더 울립니다. 저음은 처음과 같습니다.', [lower,
        row('화음', [0, 1, 2].flatMap((i) => [64 - [0, 4, 5][i], 67 - [0, 3, 5][i]].map(p => note(i * 1.12, 0.99, p))), 'plucked')])
    ]
  },
  recitative: {
    title: '말하듯이, 노래하듯이',
    prompt: '오페라에서 레치타티보는 대화의 억양과 리듬을 좇고, 아리아는 한 인물의 감정을 선율로 펼칩니다. 같은 다섯 음절 ‘어디로 가나’를 두 방식으로 짚어 보세요.',
    source: operaTerms,
    examples: [
      example('말의 억양', '앞의 세 음절이 비슷한 높이로 빠르게 이어지다가, 끝 음절에서 내려앉습니다.', [row('음절', verse([[0,.24],[.28,.22],[.54,.56],[1.32,.27],[1.63,.68]],[67,67,67,69,65]))]),
      example('노래의 선율', '같은 말을 더 긴 호흡으로 부릅니다. ‘로’에서 선율의 꼭대기까지 올라갑니다.', [row('음절', verse([[0,.48],[.52,.48],[1.04,1.09],[2.18,.46],[2.7,.86]],[65,69,74,72,67]))])
    ]
  },
  trio: {
    title: '트리오 소나타의 세 성부',
    prompt: '코렐리의 트리오 소나타에서는 높은 두 성부와 통주저음이 어우러집니다. 저음 연주와 화음 반주를 여러 사람이 나눠 맡을 수 있어 성부 수와 연주자 수는 다를 수 있습니다.',
    source: ['새너제이 주립대학교 · 코렐리의 소나타', 'https://www.sjsu.edu/people/gordon.haramaki/courses/baroque/s1/8.-Corelli-and-Tonality.pdf'],
    examples: [
      example('위 성부 하나', '첫째 선율의 여섯 음을 기억해 보세요.', [upper]),
      example('세 성부', '첫째 선율 아래에서 둘째 선율이 다른 길로 움직입니다. 가장 낮은 성부는 긴 음으로 둘을 받칩니다.', [upper, row('둘째 선율', line([64,65,67,65,64,62]), 'soft'), lower])
    ]
  },
  meter: {
    title: '춤의 박을 둘과 셋으로 묶기',
    prompt: '춤을 출 때 어느 박으로 돌아와 발을 디딜까요? 같은 간격의 열두 박을 듣고 강한 첫 박에만 손가락을 대 보세요. 모음곡에는 박의 묶음이 서로 다른 춤곡이 함께 들어갑니다.',
    source: ['LibreTexts · 바로크 춤 모음곡', 'https://human.libretexts.org/Bookshelves/Music/Music_Appreciation/Music_Appreciation_II_(Kuznetsova)/12%3A_Baroque_Instrumental_Music_A._Vivaldi/12.03%3A_Suite'],
    examples: [2,3].map(m => example(m === 2 ? '두 박씩' : '세 박씩', m === 2 ? '하나 둘, 하나 둘. 열두 박 동안 강한 박으로 여섯 번 돌아옵니다.' : '하나 둘 셋, 하나 둘 셋. 같은 시간에 강한 박은 네 번만 돌아옵니다.', [
      row('박', Array.from({length:12}, (_,i) => note(i * .32, .15, i % m === 0 ? 64 : 57, { gain: i % m === 0 ? 1 : .48, text: String(i % m + 1) })), 'plucked')
    ]))
  },
  dotted: {
    title: '프랑스풍 서곡의 부점 리듬',
    prompt: '륄리의 프랑스풍 서곡은 느린 첫 부분의 긴 음과 짧은 음으로 잘 알려져 있습니다. 음높이와 전체 길이는 그대로 두고 두 음 사이의 시간만 바꿔 보세요.',
    source: ['케임브리지 국제교육 · 프랑스풍 서곡', 'https://www.cambridgeinternational.org/Images/598287-2021-2022-teachers-guide-to-set-works.pdf'],
    examples: [
      example('고른 길이', '둘씩 짝지은 음이 같은 길이로 움직입니다.', [row('선율', rhythm([[0,.44],[.5,.44],[1,.44],[1.5,.44],[2,.44],[2.5,.44]]))]),
      example('긴 음과 짧은 음', '둘째 음이 뒤로 밀려 다음 첫 박 바로 앞에 붙습니다. 여기서는 한 쌍을 3 대 1로 나눴습니다.', [row('선율', rhythm([[0,.69],[.75,.19],[1,.69],[1.75,.19],[2,.69],[2.75,.19]]))])
    ]
  },
  ground: {
    title: '그라운드 베이스의 반복',
    prompt: '퍼셀은 《디도와 에네아스》에서 되풀이되는 저음 위에 노래를 얹었습니다. 예시의 두 번째 구절에서 어떤 성부가 처음으로 돌아오는지 들어 보세요.',
    source: ['옥스퍼드 대학교 출판부 · 퍼셀의 반복저음 기법', 'https://academic.oup.com/book/27767/chapter-abstract/198005447'],
    examples: [
      example('저음만', '낮은 네 음이 같은 순서로 두 번 나옵니다.', [row('반복저음', line([...bassPattern, ...bassPattern], .48), 'plucked')]),
      example('선율 얹기', '다섯째 음에서 저음은 다시 도로 돌아오지만 위 선율은 첫 구절보다 높은 음으로 향합니다.', [row('반복저음', line([...bassPattern, ...bassPattern], .48), 'plucked'), row('선율', line([64,62,64,67,72,71,69,67], .48))])
    ]
  },
  canon: {
    title: '카논에서 뒤따르는 성부 찾기',
    prompt: '카논에서는 나중에 들어오는 성부가 먼저 나온 선율을 일정한 규칙으로 따라갑니다. 파헬벨의 작품을 듣기 전에 한 박 뒤에서 같은 가락이 들어오는 순간을 찾아보세요.',
    source: ['미국 교육자료정보센터 · 합창과 카논', 'https://files.eric.ed.gov/fulltext/ED026402.pdf'],
    examples: [
      example('먼저 나오는 선율', '첫째 성부의 첫 세 음이 올라가는 방향을 눈으로 따라가세요.', [chorus1]),
      example('한 박 뒤의 모방', '둘째 성부는 같은 음들을 한 박 뒤에 시작합니다. 두 성부의 자취를 옆으로 밀면 포개집니다.', [chorus1, row('둘째 성부', line([65,67,69,67,65,64], .56, .56), 'soft')])
    ]
  },
  choirs: {
    title: '두 합창단이 소리를 주고받는 법',
    prompt: '베네치아의 다합창 양식을 배운 쉬츠는 여러 합창단을 위해 곡을 썼습니다. 두 무리가 한꺼번에 움직일 때와 한쪽의 구절을 다른 쪽이 받아 이어갈 때를 비교하세요.',
    source: ['노스다코타 주립대학교 · 가브리엘리와 쉬츠의 다합창', 'https://library.ndsu.edu/ir/bitstream/10365/26528/1/The%20Development%20of%20Works%20for%20Choir%20and%20Brass%20-%20A%20Study%20of%20Four%20Representative%20Works.pdf'],
    examples: [
      example('함께', '두 무리의 시작점이 같습니다. 높은 음과 낮은 음이 함께 들립니다.', [row('첫 무리', choir1),row('둘째 무리', choir2.map(n => ({...n, at:n.at - 1.8})), 'soft')]),
      example('주고받기', '첫 무리의 두 음이 끝나는 자리에서 둘째 무리가 응답합니다.', [row('첫 무리', choir1), row('둘째 무리', choir2, 'soft')])
    ]
  },
  organ: {
    title: '오르간의 스톱으로 음색 바꾸기',
    prompt: '오르가니스트는 스톱을 골라 어떤 파이프 줄에 바람을 보낼지 정합니다. 같은 건반을 누르면서 8피트 음에 한 옥타브 위의 4피트 음을 겹쳐 보세요.',
    source: ['앨런 오르간 · 스톱의 음높이', 'https://www.allenorgan.com/support/ownersmanuals/03300082-3m.pdf'],
    examples: [
      example('8피트', '건반을 누른 높이에서 네 음이 차례로 울립니다.', [row('8피트', line([60,62,64,67], .7), 'soft')]),
      example('8 + 4피트', '같은 건반을 눌러도 한 옥타브 높은 소리가 함께 나서 음색이 한층 밝아집니다.', [row('8피트', line([60,62,64,67], .7), 'soft'), row('4피트', line([72,74,76,79], .7), 'soft')])
    ]
  },
  scordatura: {
    title: '비버의 바이올린 변칙 조율',
    prompt: '비버는 《묵주 소나타》에서 손가락을 대지 않은 줄의 음높이부터 바꾸었습니다. 제6곡 〈겟세마네의 기도〉를 연주하려면 어느 줄을 올리고 내려야 할까요?',
    source: ['미국 음악이론학회 · 비버의 조율과 연주', 'https://mtosmt.org/issues/mto.20.26.4/mto.20.26.4.desouza.html'],
    examples: [
      example('통상 조율', '낮은 줄부터 솔–레–라–미. 이웃한 두 줄이 완전5도 간격입니다.', [openStrings([55,62,69,76])]),
      example('소나타 제6곡', '라♭–미♭–솔–레. 낮은 두 줄을 반음씩 올리고 높은 두 줄을 온음씩 내립니다.', [openStrings([56,63,67,74])])
    ]
  },
  voices: {
    title: '한 선율에서 여러 성부로',
    prompt: '즈나멘니 성가는 여러 사람이 함께 불러도 한 가락을 좇습니다. 17세기 키이우 등을 거쳐 모스크바로 전해진 파르테스 합창에서는 가수들이 서로 다른 성부를 맡습니다.',
    source: choirSource,
    examples: [
      example('한 선율', '네 음이 한 줄로 이어집니다. 노래하는 사람 수와 관계없이 선율은 하나입니다.', [row('선율', line([65,67,69,65], .8), 'soft')]),
      example('여러 성부', '높은 가락 아래에서 서로 다른 두 음줄기가 함께 움직입니다. 합창 편성의 차이를 단순화했습니다.', [row('위',line([65,67,69,65],.8),'soft'),row('가운데',line([60,64,65,60],.8)),row('아래',line([53,48,50,53],.8),'soft')])
    ]
  },
  temperament: {
    title: '옥타브를 열두 칸으로 나누기',
    prompt: '명대 주재육은 1584년에 열두 음을 고른 비율로 나누는 방법을 제시했습니다. 이 모형에서는 낮은 라를 220Hz로 정합니다. 높이를 열두 번 올린 뒤 진동수는 얼마일까요?',
    source: ['Music Theory Spectrum · 주재육의 음률론', 'https://doi.org/10.1093/mts/mtac004'],
    examples: [
      example('양 끝음', '220Hz와 440Hz의 간격이 한 옥타브입니다.', [row('높이', [note(0,.85,57), note(2.4,.85,69)], 'soft')]),
      example('열두 반음', '각 단계에서 진동수에 약 1.05946을 곱합니다. 첫 음을 포함해 열세 음을 세면 한 옥타브에 닿습니다.', [row('높이', line(Array.from({length:13}, (_,i) => 57+i), .24), 'soft')])
    ]
  },
  qin: {
    title: '고금 한 줄에서 나는 세 가지 소리',
    prompt: '고금 연주자는 오른손으로 줄을 뜯으며 왼손으로 줄을 누르거나 가볍게 댑니다. 같은 줄에 왼손을 어떻게 쓰는지에 따라 소리가 달라집니다.',
    source: qinSource,
    examples: [
      example('산음 · 줄만 뜯기', '왼손을 떼고 줄 전체를 울리면 개방현의 낮은 음이 납니다.', [row('줄', [note(0,2.1,55)], 'plucked')]),
      example('범음 · 살짝 대기', '줄의 한가운데에 가볍게 손을 대면 한 옥타브 높은 배음이 도드라집니다.', [row('줄', [note(0,2.1,67)], 'harmonic')]),
      example('안음 · 눌러 밀기', '줄을 눌러 뜯은 뒤 손가락을 옮겨 음높이를 연속적으로 올립니다.', [row('줄', [note(0,2.1,59,{ to:62 })], 'sliding')])
    ]
  },
  geomungo: {
    title: '거문고 술대의 점과 획',
    prompt: '《양금신보》에는 술대를 잡는 법과 줄을 타는 법이 적혀 있습니다. 술대로 한 줄을 치는 ‘점’과 여러 줄을 가로지르는 ‘획’을 동작의 순서로 비교해 보세요.',
    source: geomungo,
    examples: [
      example('점 · 한 줄', '한 줄에 술대가 닿아 한 음이 울립니다.', [row('첫 줄', [note(0,1.4,52)],'plucked')]),
      example('획 · 여러 줄', '한 번의 움직임 안에서 여러 줄에 차례로 닿습니다. 음높이와 시간 간격은 동작 설명을 위해 정했습니다.', [row('첫 줄',[note(0,1.4,52)],'plucked'),row('다음 줄',[note(.11,1.29,57)],'plucked'),row('다음 줄',[note(.22,1.18,62)],'plucked')])
    ]
  },
  tempo: {
    title: '노래의 빠르기를 귀로 비교하기',
    prompt: '옛 가곡의 이름 만(慢)·중(中)·삭(數)에는 서로 다른 빠르기의 흔적이 남아 있습니다. 같은 네 음을 빠르기만 바꾸어 들어 보세요. 여기 쓰인 선율과 속도는 비교를 위해 정했습니다.',
    source: ['국립국악원 · 가곡의 변천', 'https://www.gugak.go.kr/ency/topic/view/263'],
    examples: [
      example('느리게', '한 음에서 다음 음까지 기다리는 시간이 깁니다.', [row('예시 선율', line([62,67,69,67], .9), 'plucked')]),
      example('빠르게', '같은 선율이 절반의 시간 안에 끝납니다. 이후 삭대엽에서 갈라져 나온 곡 중에는 다시 느려진 곡들도 있습니다.', [row('예시 선율', line([62,67,69,67], .45), 'plucked')])
    ]
  }
};
const sceneLessons = {
  italy: ['monody','recitative','recitative','trio'],
  france: ['lute','royalStrings','dotted','organ'],
  england: ['lute','meter','meter','ground'],
  germany: ['choirs','continuo','organ','canon'],
  austria: ['recitative','meter','recitative','scordatura'],
  russia: ['voices','articulation','voices','fifths'],
  china: ['temperament','kunqu','qin','kunqu'],
  korea: ['geomungo','geomungo','tempo','tempo']
};

function lessonForScene(id) {
  const [place, start] = id.split('-');
  const lesson = lessons[sceneLessons[place]?.[(Number(start) - 1600) / 25]];
  if (id === 'france-1600') {
    return {...lesson, source: ['미국 의회도서관 · 에르 드 쿠르 악보집', 'https://www.loc.gov/item/2020562626/']};
  }
  return lesson;
}
function limits(lesson) {
  const notes = lesson.examples.flatMap(v => v.rows.flatMap(r => r.notes));
  const pitches = notes.flatMap(n => [n.pitch, n.to ?? n.pitch]);
  return {
    duration: Math.max(...notes.map(n => n.at + n.length)),
    lowest: Math.min(...pitches), highest: Math.max(...pitches)
  };
}
function renderTrace(lesson, ex) {
  const { duration, lowest, highest } = limits(lesson);
  const height = pitch => 12 + (pitch - lowest) / Math.max(highest - lowest, 1) * 54;
  return ex.rows.map(r => {
    const marks = r.notes.map(n => {
      const left = n.at / duration * 100;
      const width = Math.min(100 - left, n.length / duration * 100);
      let style = 'left:' + left.toFixed(3) + '%;width:' + width.toFixed(3) + '%;bottom:' + height(n.pitch).toFixed(2) + '%';
      if (n.to) style += ';height:calc(' + (height(n.to) - height(n.pitch)).toFixed(2) + '% + .29rem)';
      const type = n.to ? 'glide' : r.tone;
      return '<span class="concept-note" data-tone="' + type + '" style="' + style + '">' + (n.text || '') + '</span>';
    }).join('');
    return '<div class="concept-trace-row"><span class="concept-row-label">' + r.label + '</span><div class="concept-staff">' + marks + '</div></div>';
  }).join('');
}
export function renderConceptLab(id) {
  const lesson = lessonForScene(id);
  if (!lesson) return '';
  const first = lesson.examples[0];
  return `<details class="concept-lab" data-concept-scene="${id}">
    <summary><span><small>개념 실험실</small><strong>${lesson.title}</strong></span></summary>
    <div class="concept-body"><p class="concept-prompt">${lesson.prompt}</p>
    <div class="concept-variants" role="group" aria-label="비교할 예시">
      ${lesson.examples.map((v,i) => `<button type="button" data-concept-example="${i}" aria-pressed="${i === 0}">${v.label}</button>`).join('')}
    </div>
    <div data-concept-graph class="concept-graph" aria-hidden="true">${renderTrace(lesson,first)}</div>
    <p class="concept-detail" data-concept-detail aria-live="polite">${first.detail}</p>
    <div class="concept-actions"><button type="button" class="concept-play" data-concept-play aria-label="${first.label} 예시 듣기">예시 듣기</button><small>학습용 합성음</small></div>
    <a class="concept-source" href="${lesson.source[1]}" target="_blank" rel="noopener noreferrer">${lesson.source[0]}</a>
    <span class="concept-feedback" data-concept-feedback role="status"></span>
    </div></details>`;
}

let audioContext;
let current;
let installed = false;
function speakPitch(pitch) {
  return 440 * 2 ** ((pitch - 69) / 12);
}
function scheduleNote(ctx, master, track, n, when) {
  const osc = ctx.createOscillator();
  const vol = ctx.createGain();
  const begin = when + n.at;
  const end = begin + n.length;
  const level = .13 * (n.gain ?? 1);
  const plucked = ['plucked','harmonic','sliding'].includes(track.tone);
  osc.type = ['soft','harmonic'].includes(track.tone) ? 'sine' : 'triangle';
  osc.frequency.setValueAtTime(speakPitch(n.pitch), begin);
  if (n.to) osc.frequency.exponentialRampToValueAtTime(speakPitch(n.to), end - .05);
  vol.gain.setValueAtTime(.0001, begin);
  vol.gain.exponentialRampToValueAtTime(level, begin + Math.min(n.length * .15, track.tone === 'bowed' ? .12 : .018));
  if (plucked) {
    vol.gain.exponentialRampToValueAtTime(.0001, end);
  } else {
    vol.gain.setValueAtTime(level, end - Math.min(.07, n.length / 3));
    vol.gain.exponentialRampToValueAtTime(.0001, end);
  }
  osc.connect(vol);
  vol.connect(master);
  osc.onended = () => { osc.disconnect(); vol.disconnect(); };
  osc.start(begin);
  osc.stop(end + .01);
  return osc;
}
function setPlayText(lab, active) {
  const play = lab.querySelector('[data-concept-play]');
  const { label } = lessonForScene(lab.dataset.conceptScene).examples[Number(lab.dataset.variant || 0)];
  play.textContent = active ? '멈추기' : '예시 듣기';
  play.setAttribute('aria-label', label + (active ? ' 예시 멈추기' : ' 예시 듣기'));
}
function stopDemo() {
  if (!current) return;
  const run = current;
  current = null;
  clearTimeout(run.timer);
  for (const osc of run.nodes) {
    try { osc.stop(); } catch { /* Nodes can end before the final voice. */ }
  }
  run.master?.disconnect();
  run.lab.classList.remove('concept-playing');
  setPlayText(run.lab, false);
}
async function playDemo(lab) {
  const wasActive = current?.lab === lab;
  stopDemo();
  if (wasActive) return;
  const feedback = lab.querySelector('[data-concept-feedback]');
  feedback.textContent = '';
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) {
    feedback.textContent = '이 브라우저에서는 합성음을 재생할 수 없습니다. 위 도식에서 두 예시의 차이를 확인하세요.';
    return;
  }
  const run = { lab, nodes: [] };
  current = run;
  try {
    audioContext ??= new Audio();
    document.dispatchEvent(new Event('atlas:concept-play'));
    await audioContext.resume();
    if (run !== current) return;
    const lesson = lessonForScene(lab.dataset.conceptScene);
    const ex = lesson.examples[Number(lab.dataset.variant || 0)];
    const start = audioContext.currentTime + .025;
    run.master = audioContext.createGain();
    run.master.gain.value = .95 / Math.sqrt(ex.rows.length);
    run.master.connect(audioContext.destination);
    let length = 0;
    for (const track of ex.rows) {
      for (const mark of track.notes) {
        run.nodes.push(scheduleNote(audioContext, run.master, track, mark, start));
        length = Math.max(length, mark.at + mark.length);
      }
    }
    // Every comparison keeps the same horizontal time scale.
    lab.style.setProperty('--concept-time', limits(lesson).duration + 's');
    lab.classList.add('concept-playing');
    setPlayText(lab, true);
    run.timer = setTimeout(() => { if (run === current) stopDemo(); }, (length + .06) * 1000);
  } catch {
    if (current !== run) return;
    stopDemo();
    feedback.textContent = '합성음을 재생할 수 없습니다. 위 도식에서 예시를 바꾸어 비교하세요.';
  }
}
export function initConceptLabs() {
  if (installed) return;
  installed = true;
  document.addEventListener('click', e => {
    const control = e.target.closest('[data-concept-example], [data-concept-play]');
    if (!control) return;
    const lab = control.closest('[data-concept-scene]');
    if (control.hasAttribute('data-concept-play')) { playDemo(lab); return; }
    const keepPlaying = current?.lab === lab;
    stopDemo();
    lab.dataset.variant = control.dataset.conceptExample;
    const lesson = lessonForScene(lab.dataset.conceptScene);
    const ex = lesson.examples[Number(lab.dataset.variant)];
    lab.querySelectorAll('[data-concept-example]').forEach(b => b.setAttribute('aria-pressed', String(b === control)));
    lab.querySelector('[data-concept-graph]').innerHTML = renderTrace(lesson, ex);
    lab.querySelector('[data-concept-detail]').textContent = ex.detail;
    lab.querySelector('[data-concept-feedback]').textContent = '';
    setPlayText(lab, false);
    if (keepPlaying) playDemo(lab);
  });
  document.addEventListener('atlas:music-play', stopDemo);
  document.addEventListener('toggle', e => {
    if (current && e.target === current.lab && !e.target.open) stopDemo();
  }, true);
  document.addEventListener('click', e => {
    if (e.target.closest('[data-filter]') && current) stopDemo();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopDemo(); });
  window.addEventListener('pagehide', stopDemo);
}
