// Todo List Functionality
const todoButton = document.querySelector('.todo-button:not(.side-menu-btn)');
const todoPanel = document.querySelector('.todo-panel');
const closeBtn = document.querySelector('.close-btn');
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodo');
const todoList = document.getElementById('todoList');

// Toggle Todo Panel
function showTodoPanel() {
    todoPanel.style.opacity = '1';
    todoPanel.style.pointerEvents = 'all';
    todoPanel.style.transform = 'translateY(0)';
}

function hideTodoPanel() {
    todoPanel.style.opacity = '0';
    todoPanel.style.pointerEvents = 'none';
    todoPanel.style.transform = 'translateY(30px)';
}

todoButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (todoPanel.style.opacity === '1') {
        hideTodoPanel();
    } else {
        showTodoPanel();
        // 타이머 패널 닫기
        if (timerPanel) {
            timerPanel.style.opacity = '0';
            timerPanel.style.pointerEvents = 'none';
            timerPanel.style.transform = 'translateY(30px)';
        }
    }
});

closeBtn.addEventListener('click', () => {
    hideTodoPanel();
});

document.addEventListener('click', (e) => {
    if (todoPanel.contains(e.target) || e.target === todoButton) {
        return;
    }
    hideTodoPanel();
});

// Add Todo Item
function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${todoText}</span>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;
        
        // Add delete functionality
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            li.remove();
        });

        todoList.appendChild(li);
        todoInput.value = '';
    }
}

addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Music Player Functionality
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progress = document.querySelector('.progress');
const songTitle = document.getElementById('songTitle');

let isPlaying = false;
let currentSong = 0;

// Playlist with actual songs from assets folder
const playlist = [
    { title: "In Dream Land", url: "./assets/musics/1-indreamland.mp3" },
    { title: "2:00 AM", url: "./assets/musics/2-2am.mp3" },
    { title: "City Lights", url: "./assets/musics/3-city lights.mp3" },
    { title: "Retro City", url: "./assets/musics/4-retro city.mp3" },
    { title: "And So It Begins", url: "./assets/musics/5-and so it begins.mp3" },
    { title: "Purple", url: "./assets/musics/6-purple.mp3" },
    { title: "Taiyaki", url: "./assets/musics/7-taiyaki.mp3" },
    { title: "Gameplay", url: "./assets/musics/8-gameplay.mp3" },
    { title: "Loading", url: "./assets/musics/9-loading.mp3" },
    { title: "On The Top", url: "./assets/musics/10-on the top.mp3" },
    { title: "Tomato Farm", url: "./assets/musics/11-tomato farm.mp3" },
    { title: "Wonder", url: "./assets/musics/12-wonder.mp3" }
];

// Create audio element
const audio = new Audio();

// Update progress bar
audio.addEventListener('timeupdate', () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercent}%`;
});

// When song ends, play next song
audio.addEventListener('ended', () => {
    currentSong = (currentSong + 1) % playlist.length;
    loadSong(currentSong);
    if (isPlaying) {
        audio.play();
    }
});

// Play/Pause functionality
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
});

// Previous song
prevBtn.addEventListener('click', () => {
    currentSong = (currentSong - 1 + playlist.length) % playlist.length;
    loadSong(currentSong);
    if (isPlaying) {
        audio.play();
    }
});

// Next song
nextBtn.addEventListener('click', () => {
    currentSong = (currentSong + 1) % playlist.length;
    loadSong(currentSong);
    if (isPlaying) {
        audio.play();
    }
});

// Load song
function loadSong(index) {
    audio.src = playlist[index].url;
    songTitle.textContent = playlist[index].title;
    if (isPlaying) {
        audio.play();
    }
}

// Initialize with first song
loadSong(currentSong);

// --- Pomodoro Timer FAB & Panel (독립 동작) ---
const openTimerBtn = document.getElementById('open-timer-btn');
const timerPanel = document.getElementById('timer-panel');
const timerMainDisplay = document.getElementById('timerMainDisplay');
const timerControls = document.getElementById('timerControls');

function showTimerPanel() {
    timerPanel.style.opacity = '1';
    timerPanel.style.pointerEvents = 'all';
    timerPanel.style.transform = 'translateY(0)';
}

function hideTimerPanel() {
    timerPanel.style.opacity = '0';
    timerPanel.style.pointerEvents = 'none';
    timerPanel.style.transform = 'translateY(30px)';
}

if (openTimerBtn && timerPanel) {
    openTimerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (timerPanel.style.opacity === '1') {
            hideTimerPanel();
        } else {
            showTimerPanel();
            // todo 패널 닫기
            if (todoPanel) {
                todoPanel.style.opacity = '0';
                todoPanel.style.pointerEvents = 'none';
                todoPanel.style.transform = 'translateY(30px)';
            }
        }
    });

    document.addEventListener('click', (e) => {
        // 패널 내부 클릭은 무시 (버튼 등 포함)
        if (timerPanel.contains(e.target) || e.target === openTimerBtn) {
            return;
        }
        hideTimerPanel();
    });
}

// Prevent timer panel from closing when clicking any button inside it
if (timerPanel) {
    timerPanel.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
        });
    });
}

// --- Pomodoro Timer Logic ---
const startTimerBtn = document.getElementById('startTimer');
const resetTimerBtn = document.getElementById('resetTimer');
const settingsBtn = document.getElementById('timer-settings-btn');
const timerSettings = document.querySelector('.timer-settings');
const saveSettingsBtn = document.getElementById('saveSettings');
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');
const repeatCountInput = document.getElementById('repeatCount');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const currentRoundSpan = document.getElementById('currentRound');
const totalRoundsSpan = document.getElementById('totalRounds');
const timerProgress = document.getElementById('timerProgress');

let timeLeft = 25 * 60;
let timerId = null;
let isWorkTime = true;
let workTime = 25;
let breakTime = 5;
let repeatCount = 4;
let currentRound = 1;
const CIRCLE_LENGTH = 2 * Math.PI * 74;

if (settingsBtn && timerSettings) {
    settingsBtn.addEventListener('click', () => {
        timerSettings.classList.toggle('active');
        if (timerSettings.classList.contains('active')) {
            if (timerMainDisplay) timerMainDisplay.style.display = 'none';
            if (timerControls) timerControls.style.display = 'none';
        } else {
            if (timerMainDisplay) timerMainDisplay.style.display = '';
            if (timerControls) timerControls.style.display = '';
        }
    });
}

if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
        workTime = parseInt(workTimeInput.value);
        breakTime = parseInt(breakTimeInput.value);
        repeatCount = parseInt(repeatCountInput.value);
        totalRoundsSpan.textContent = repeatCount;
        resetTimer();
        timerSettings.classList.remove('active');
    });
}

if (startTimerBtn) {
    startTimerBtn.addEventListener('click', () => {
        if (timerId === null) {
            startTimer();
            startTimerBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            pauseTimer();
            startTimerBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
}

if (resetTimerBtn) {
    resetTimerBtn.addEventListener('click', () => {
        resetTimer();
        startTimerBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
}

function startTimer() {
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        updateCircle();
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            if (!isWorkTime) {
                currentRound++;
                currentRoundSpan.textContent = currentRound;
            }
            if (currentRound > repeatCount) {
                startTimerBtn.innerHTML = '<i class="fas fa-play"></i>';
                // Play notification sound
                const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
                audio.play();
                return;
            }
            isWorkTime = !isWorkTime;
            timeLeft = (isWorkTime ? workTime : breakTime) * 60;
            updateDisplay();
            updateCircle();
            startTimerBtn.innerHTML = '<i class="fas fa-play"></i>';
            // Play notification sound
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
            audio.play();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = workTime * 60;
    currentRound = 1;
    currentRoundSpan.textContent = currentRound;
    totalRoundsSpan.textContent = repeatCount;
    updateDisplay();
    updateCircle();
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    updateCircle();
}

function updateCircle() {
    let total = (isWorkTime ? workTime : breakTime) * 60;
    let percent = timeLeft / total;
    if (timerProgress) {
        timerProgress.setAttribute('stroke-dasharray', CIRCLE_LENGTH);
        timerProgress.setAttribute('stroke-dashoffset', CIRCLE_LENGTH * (1 - percent));
    } else {
        console.warn('timerProgress SVG element not found!');
    }
}

// 초기화
resetTimer();

// Item Selection Panel Logic
const itemImages = {
  hair: Array.from({length: 12}, (_, i) => `./assets/images/hair/Hair${i+1}.png`),
  eyes: Array.from({length: 12}, (_, i) => `./assets/images/eye/eye${i+1}.gif`),
  skin: Array.from({length: 5}, (_, i) => `./assets/images/body/Skin${i+1}.png`),
  clothes: Array.from({length: 12}, (_, i) => `./assets/images/clothing/Clothing${i+1}.png`)
};
const itemTitles = {
  hair: '헤어 선택',
  eyes: '눈 선택',
  skin: '피부 선택',
  clothes: '의상 선택'
};
const itemBgClass = {
  hair: '.bg-hair',
  eyes: '.bg-eye',
  skin: '.bg-body',
  clothes: '.bg-clothes'
};

const itemPanel = document.getElementById('itemPanel');
const itemTabs = itemPanel.querySelectorAll('.item-tab');
const itemPanelTitle = document.getElementById('itemPanelTitle');
const itemGrid = itemPanel.querySelector('.hair-grid');

// 탭 클릭 시
itemTabs.forEach(tab => {
  tab.onclick = function() {
    itemTabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    const type = this.dataset.type;
    renderPalette(type);
    colorPalette.querySelectorAll('.color-circle').forEach(c => c.classList.remove('selected'));
    selectedColorIdx = null;
    renderItemGrid(type);
  };
});

// 아이템 그리드 렌더링
function renderItemGrid(type) {
  itemGrid.innerHTML = itemImages[type].map((src, idx) => `
    <div class="hair-item" data-type="${type}" data-img="${src}">
      <img src="${src}" alt="${type}${idx+1}">
    </div>
  `).join('');
  // 클릭 이벤트
  itemGrid.querySelectorAll('.hair-item').forEach(item => {
    item.onclick = function() {
      itemGrid.querySelectorAll('.hair-item').forEach(i => i.classList.remove('selected'));
      this.classList.add('selected');
      const target = document.querySelector(itemBgClass[type]);
      if(target) target.style.backgroundImage = `url('${this.dataset.img}')`;
    };
  });
}

// 사이드 메뉴 패널 닫기 함수
function closeAllSidePanels() {
  // 아이템(드레스업) 패널
  if (itemPanel) itemPanel.style.display = 'none';
  // object/desk 패널
  if (objectDeskPanel) objectDeskPanel.style.display = 'none';
  // weather 패널
  if (weatherPanel) weatherPanel.style.display = 'none';
  // gallery 패널
  if (galleryPanel) galleryPanel.style.display = 'none';
}

// 드레스업(첫번째) 아이콘
const openItemPanelBtn = document.querySelector('.todo-button.side-menu-btn');
openItemPanelBtn.onclick = () => {
  closeAllSidePanels();
  itemPanel.style.display = 'flex';
  itemTabs.forEach(t => t.classList.remove('active'));
  itemTabs[0].classList.add('active');
  renderPalette('hair');
  selectedColorIdx = null;
  renderItemGrid('hair');
};
document.querySelector('.close-hair-panel').onclick = () => {
  itemPanel.style.display = 'none';
};

// 팔레트(아이콘)용 색상
const colorOptions = [
  {name: 'red',    h: 0,   s: 100, l: 50},
  {name: 'orange', h: 30,  s: 100, l: 50}, // 보기 좋은 주황
  {name: 'yellow', h: 50,  s: 100, l: 50},
  {name: 'green',  h: 100, s: 100, l: 45},
  {name: 'blue',   h: 190, s: 100, l: 55},
  {name: 'purple', h: 290, s: 80,  l: 60},
  {name: 'pink',   h: 320, s: 100, l: 65},
  {name: 'gray',   h: 0,   s: 0,   l: 60},
  {name: 'black',  h: 0,   s: 0,   l: 10}
];
// 실제 필터 적용용 색상
const colorFilterOptions = [
  {h: 0,   s: 100, l: 50},    // 빨강
  {h: 18,  s: 180, l: 50},   // 주황
  {h: 40,  s: 100, l: 50},   // 노랑
  {h: 100, s: 100, l: 45},
  {h: 190, s: 100, l: 55},
  {h: 275, s: 160, l: 38},    // 진한 보라
  {h: 320, s: 100, l: 65},
  {h: 50,  s: 0,   l: 65},    // 밝은 회색
  {h: 50,   s: 0,   l: 20}
];

// 팔레트 렌더링 (카테고리별로 검정색 버튼 제외)
function renderPalette(type = 'hair') {
  if (type === 'skin') {
    colorPalette.style.display = 'none';
    return;
  } else {
    colorPalette.style.display = 'flex';
  }
  let palette = colorOptions;
  if (type === 'eyes') {
    palette = colorOptions.slice(0, colorOptions.length - 1); // 마지막(검정) 제외
  }
  colorPalette.innerHTML = palette.map((c, i) =>
    `<div class="color-circle" data-idx="${i}" style="background:hsl(${c.h},${c.s}%,${c.l}%);"></div>`
  ).join('');
}

// 현재 선택된 색상 인덱스
let selectedColorIdx = null;

// 팔레트 클릭 이벤트
colorPalette.onclick = function(e) {
  const circle = e.target.closest('.color-circle');
  if (!circle) return;
  colorPalette.querySelectorAll('.color-circle').forEach(c => c.classList.remove('selected'));
  circle.classList.add('selected');
  selectedColorIdx = +circle.dataset.idx;
  applyColorToCurrentItem();
};

const baseHue = 50; // 노랑

function applyColorToCurrentItem() {
  if (selectedColorIdx === null) return;
  const activeTab = document.querySelector('.item-tab.active');
  if (!activeTab) return;
  const type = activeTab.dataset.type;
  const target = document.querySelector(itemBgClass[type]);
  if (!target) return;
  const {h, s, l} = colorFilterOptions[selectedColorIdx];
  let hueRotate = h - baseHue;
  let saturate = s / 100;
  if (h === 0) { // 빨강
    hueRotate -= 15;
    saturate = 2.5;
  }
  target.style.filter = `hue-rotate(${hueRotate}deg) saturate(${saturate}) brightness(${l/50})`;
}

// 탭 전환 시 팔레트 초기화
itemTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    colorPalette.querySelectorAll('.color-circle').forEach(c => c.classList.remove('selected'));
    selectedColorIdx = null;
    // 필터 초기화
    const type = tab.dataset.type;
    const target = document.querySelector(itemBgClass[type]);
    if (target) target.style.filter = '';
  });
});

// Weather Panel Logic
const weatherPanel = document.getElementById('weatherPanel');
const weatherPanelTabs = weatherPanel.querySelectorAll('.weather-tab');
const weatherPanelContent = weatherPanel.querySelector('.weather-panel-content');
const closeWeatherPanel = weatherPanel.querySelector('.close-weather-panel');
const weatherBtn = document.querySelectorAll('.side-menu-btn')[2]; // ☁️ 아이콘

const timeOptions = ['morning', 'noon', 'afternoon', 'evening', 'night', 'dawn'];
const weatherOptions = ['sunny', 'rainy', 'snowy', 'windy'];

const overlayIds = {
  morning: 'time-overlay-morning',
  noon: 'time-overlay-noon',
  afternoon: 'time-overlay-afternoon',
  evening: 'time-overlay-evening',
  night: 'time-overlay-night',
  dawn: 'time-overlay-dawn'
};

const rainEffect = document.getElementById('rain-effect');
let rainAudio = null;

function showRainEffect() {
  rainEffect.innerHTML = '';
  for (let i = 0; i < 60; i++) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    drop.style.left = Math.random() * 100 + 'vw';
    drop.style.animationDelay = (Math.random() * 1.2) + 's';
    drop.style.height = (40 + Math.random() * 40) + 'px';
    rainEffect.appendChild(drop);
  }
  rainEffect.classList.add('active');
  // rain sound
  if (!rainAudio) {
    rainAudio = new Audio('./assets/musics/rain.mp3');
    rainAudio.loop = true;
    rainAudio.volume = 0.6;
  }
  rainAudio.volume = 0.6;
  rainAudio.currentTime = 0;
  rainAudio.play();
}
function hideRainEffect() {
  rainEffect.classList.remove('active');
  rainEffect.innerHTML = '';
  if (rainAudio) {
    rainAudio.pause();
    rainAudio.currentTime = 0;
  }
}

const snowEffect = document.getElementById('snow-effect');
let snowAudio = null;

function showSnowEffect() {
  snowEffect.innerHTML = '';
  for (let i = 0; i < 50; i++) {
    const flake = document.createElement('div');
    flake.className = 'snow-flake';
    flake.style.left = Math.random() * 100 + 'vw';
    flake.style.animationDelay = (Math.random() * 4) + 's';
    flake.style.width = flake.style.height = (6 + Math.random() * 8) + 'px';
    snowEffect.appendChild(flake);
  }
  snowEffect.classList.add('active');
  // snow sound
  if (!snowAudio) {
    snowAudio = new Audio('./assets/musics/snow.mp3');
    snowAudio.loop = true;
    snowAudio.volume = 0.6;
  }
  snowAudio.volume = 0.6;
  snowAudio.currentTime = 0;
  snowAudio.play();
}
function hideSnowEffect() {
  snowEffect.classList.remove('active');
  snowEffect.innerHTML = '';
  if (snowAudio) {
    snowAudio.pause();
    snowAudio.currentTime = 0;
  }
}

const leafEffect = document.getElementById('leaf-effect');
let leafInterval = null;

function showLeafEffect() {
  leafEffect.innerHTML = '';
  const leafImgs = [
    './assets/images/others/leaf1.png',
    './assets/images/others/leaf2.png',
    './assets/images/others/leaf3.png'
  ];
  for (let i = 0; i < 12; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.style.left = Math.random() * 100 + 'vw';
    const dir = Math.random() > 0.5 ? 'left' : 'right';
    leaf.style.animation = `leaf-fall-${dir} ${6 + Math.random() * 6}s linear infinite`;
    leaf.style.opacity = 0.5 + Math.random() * 0.5;
    leaf.style.transform = `rotate(${Math.random()*360}deg) scale(${0.7+Math.random()*0.6})`;
    const img = document.createElement('img');
    img.src = leafImgs[Math.floor(Math.random()*leafImgs.length)];
    img.style.width = '22px';
    img.style.height = '22px';
    img.style.opacity = '0.85';
    img.style.pointerEvents = 'none';
    leaf.appendChild(img);
    leafEffect.appendChild(leaf);
  }
  leafEffect.classList.add('active');
}
function hideLeafEffect() {
  leafEffect.classList.remove('active');
  leafEffect.innerHTML = '';
}

let windAudio = null;

function setTimeOverlay(type, value) {
  if (type === 'time') {
    // 시간 오버레이만 제어
    Object.values(overlayIds).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });
    if (overlayIds[value]) {
      const el = document.getElementById(overlayIds[value]);
      if (el) el.classList.add('active');
    }
  } else if (type === 'weather') {
    // 날씨 효과만 제어
    if (value === 'sunny') {
      hideRainEffect();
      hideSnowEffect();
      hideLeafEffect();
      if (windAudio) { windAudio.pause(); windAudio.currentTime = 0; }
    } else if (value === 'rainy') {
      showRainEffect();
      hideSnowEffect();
      hideLeafEffect();
      if (windAudio) { windAudio.pause(); windAudio.currentTime = 0; }
    } else if (value === 'snowy') {
      hideRainEffect();
      showSnowEffect();
      hideLeafEffect();
      if (windAudio) { windAudio.pause(); windAudio.currentTime = 0; }
    } else if (value === 'windy') {
      hideRainEffect();
      hideSnowEffect();
      showLeafEffect();
      if (!windAudio) {
        windAudio = new Audio('./assets/musics/wind.mp3');
        windAudio.loop = true;
        windAudio.volume = 0.5;
      }
      windAudio.currentTime = 0;
      windAudio.play();
    }
  }
}

function hideAllTimeOverlays() {
  Object.values(overlayIds).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
}

function renderWeatherPanel(type = 'time') {
  let options = type === 'time' ? timeOptions : weatherOptions;
  weatherPanelContent.innerHTML = options.map(opt =>
    `<button class="weather-btn" data-value="${opt}">${opt}</button>`
  ).join('');

  // 선택 효과
  weatherPanelContent.querySelectorAll('.weather-btn').forEach(btn => {
    btn.onclick = function() {
      // 같은 탭 내의 버튼들만 선택 해제
      const currentTab = this.closest('.weather-panel-content').querySelectorAll('.weather-btn');
      currentTab.forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      
      // 오버레이 제어
      const tabType = document.querySelector('.weather-tab.active').dataset.type;
      setTimeOverlay(tabType, this.dataset.value);
    };
  });
}

// 탭 클릭 시 해당 탭의 선택 상태 유지
weatherPanelTabs.forEach(tab => {
  tab.onclick = function() {
    weatherPanelTabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    renderWeatherPanel(this.dataset.type);
    
    // 이전에 선택된 버튼들의 상태 복원
    const type = this.dataset.type;
    const selectedButtons = weatherPanel.querySelectorAll('.weather-btn.selected');
    selectedButtons.forEach(btn => {
      if (btn.parentElement === weatherPanelContent) {
        setTimeOverlay(type, btn.dataset.value);
      }
    });
  };
});

// 패널 열기/닫기
weatherBtn.onclick = () => {
  closeAllSidePanels();
  weatherPanel.style.display = 'flex';
  weatherPanelTabs.forEach(t => t.classList.remove('active'));
  weatherPanelTabs[0].classList.add('active');
  renderWeatherPanel('time');
};
closeWeatherPanel.onclick = () => {
  weatherPanel.style.display = 'none';
};

// Gallery Panel Logic
const galleryPanel = document.getElementById('galleryPanel');
const galleryPanelHeader = galleryPanel.querySelector('.gallery-panel-header');
const closeGalleryPanel = galleryPanel.querySelector('.close-gallery-panel');
const galleryGrid = galleryPanel.querySelector('.gallery-grid');
const treeBtn = document.querySelectorAll('.side-menu-btn')[3]; // 🌳 아이콘

// 24개 아이템 
const galleryItems = [
  "https://wallpapershome.com/images/pages/pic_h/27008.jpg",
  "https://wallpapershome.com/images/pages/pic_h/16241.jpg",
  "https://wallpapershome.com/images/pages/pic_h/387.jpg",
  "https://wallpapershome.com/images/pages/pic_h/181.jpg",
  "https://wallpapershome.com/images/pages/pic_h/179.jpg",
  "https://wallpapershome.com/images/pages/pic_h/26309.jpg",
  "https://wallpapershome.com/images/pages/pic_h/658.jpg",
  "https://wallpapershome.com/images/pages/pic_h/5278.jpg",
  "https://wallpapershome.com/images/pages/pic_h/156.jpg",
  "https://images.pexels.com/photos/15522610/pexels-photo-15522610.jpeg",
  "https://wallpapershome.com/images/pages/pic_h/26734.jpg",
  "https://images.pexels.com/photos/547125/pexels-photo-547125.jpeg",
  "https://images.pexels.com/photos/9899126/pexels-photo-9899126.jpeg",
  "https://images.pexels.com/photos/383640/pexels-photo-383640.jpeg",
  "https://wallpapershome.com/images/pages/pic_h/26338.jpg",
  "https://wallpapershome.com/images/pages/pic_h/26916.jpg",
  "https://wallpapershome.com/images/pages/pic_h/5514.jpg",
  "https://wallpapershome.com/images/pages/pic_h/25987.jpg",
  "https://wallpapershome.com/images/pages/pic_h/8972.jpg",
  "https://wallpapershome.com/images/pages/pic_h/5520.jpg",
  "https://wallpapershome.com/images/pages/pic_h/5333.jpg",
  "https://wallpapershome.com/images/pages/pic_h/5540.jpg",
  "https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg",
  "https://wallpapershome.com/images/pages/pic_h/5401.jpg"
];

function renderGalleryGrid() {
  galleryGrid.innerHTML = galleryItems.map((src, idx) =>
    `<div class="gallery-item" data-idx="${idx}">
       <img src="${src}" alt="item${idx+1}" style="max-width:70px;max-height:70px;object-fit:contain;">
     </div>`
  ).join('');
  galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
    item.onclick = function() {
      galleryGrid.querySelectorAll('.gallery-item').forEach(i => i.classList.remove('selected'));
      this.classList.add('selected');
      // 실제 이미지 선택 시 .bg-window의 src를 교체
      const idx = this.dataset.idx;
      const bgWindow = document.querySelector('.bg-window');
      if (bgWindow) {
        bgWindow.src = galleryItems[idx];
      }
    };
  });
}

treeBtn.onclick = () => {
  closeAllSidePanels();
  galleryPanel.style.display = 'flex';
  renderGalleryGrid();
};
closeGalleryPanel.onclick = () => {
  galleryPanel.style.display = 'none';
};

// --- Object/Desk Item Selection Panel ---
const objectDeskPanel = document.getElementById('objectDeskPanel');
const objectDeskTabs = objectDeskPanel.querySelectorAll('.object-desk-tab');
const objectDeskPanelTitle = document.getElementById('objectDeskPanelTitle');
const objectDeskGrid = objectDeskPanel.querySelector('.object-desk-grid');
const closeObjectDeskPanel = objectDeskPanel.querySelector('.close-object-desk-panel');
const objectBtn = document.querySelectorAll('.side-menu-btn')[1]; // 두번째(책) 아이콘

const objectImages = Array.from({length: 7}, (_, i) => `./assets/images/object/object${i+1}.png`);
const deskImages = [1,2,3].map(i => `./assets/images/others/table${i}.png`);
const objectDeskTitles = { object: '오브젝트 선택', desk: '책상 선택' };
const objectDeskBgClass = { object: '.bg-object', desk: '.bg-desk' };

const objectDeskColorPalette = document.getElementById('objectDeskColorPalette');
const objectDeskColors = [
  {name: 'red',    h: 0,   s: 100, l: 50},
  {name: 'yellow', h: 50,  s: 100, l: 50},
  {name: 'blue',   h: 210, s: 100, l: 50},
  {name: 'pink',   h: 320, s: 100, l: 75},
  {name: 'white',  h: 0,   s: 0,   l: 100},
  {name: 'black',  h: 0,   s: 0,   l: 10}
];
let objectDeskSelectedColorIdx = null;
let objectDeskCurrentType = 'object';

function renderObjectDeskColorPalette(type = objectDeskCurrentType) {
  if (type === 'object') {
    objectDeskColorPalette.style.display = 'none';
  } else {
    objectDeskColorPalette.style.display = 'flex';
    objectDeskColorPalette.innerHTML = objectDeskColors.map((c, i) =>
      `<div class="color-circle" data-idx="${i}" style="background:hsl(${c.h},${c.s}%,${c.l}%);"></div>`
    ).join('');
  }
}

objectDeskColorPalette.onclick = function(e) {
  if (objectDeskCurrentType !== 'desk') return;
  const circle = e.target.closest('.color-circle');
  if (!circle) return;
  objectDeskColorPalette.querySelectorAll('.color-circle').forEach(c => c.classList.remove('selected'));
  circle.classList.add('selected');
  objectDeskSelectedColorIdx = +circle.dataset.idx;
  applyObjectDeskColorToCurrent();
};

function applyObjectDeskColorToCurrent() {
  if (objectDeskCurrentType !== 'desk' || objectDeskSelectedColorIdx === null) return;
  const type = objectDeskCurrentType;
  const target = document.querySelector(objectDeskBgClass[type]);
  if (!target) return;
  const {h, s, l} = objectDeskColors[objectDeskSelectedColorIdx];
  let filter = '';
  if (objectDeskColors[objectDeskSelectedColorIdx].name === 'white') {
    filter = 'brightness(2) grayscale(0.1)';
  } else if (objectDeskColors[objectDeskSelectedColorIdx].name === 'black') {
    filter = 'brightness(0.4) grayscale(1)';
  } else {
    filter = `hue-rotate(${h}deg) saturate(${s/100}) brightness(${l/50})`;
  }
  target.style.filter = filter;
}

function renderObjectDeskGrid(type) {
  objectDeskCurrentType = type;
  renderObjectDeskColorPalette(type);
  const images = type === 'object' ? objectImages : deskImages;
  objectDeskGrid.innerHTML = images.map((src, idx) => `
    <div class="object-desk-item" data-type="${type}" data-img="${src}">
      <img src="${src}" alt="${type}${idx+1}">
    </div>
  `).join('');
  objectDeskGrid.querySelectorAll('.object-desk-item').forEach(item => {
    item.onclick = function() {
      objectDeskGrid.querySelectorAll('.object-desk-item').forEach(i => i.classList.remove('selected'));
      this.classList.add('selected');
      const target = document.querySelector(objectDeskBgClass[type]);
      if(target) target.style.backgroundImage = `url('${this.dataset.img}')`;
      if(type === 'desk') applyObjectDeskColorToCurrent();
      else if(target) target.style.filter = '';
    };
  });
}

objectBtn.onclick = () => {
  closeAllSidePanels();
  objectDeskPanel.style.display = 'flex';
  objectDeskTabs.forEach(t => t.classList.remove('active'));
  objectDeskTabs[0].classList.add('active');
  renderObjectDeskColorPalette();
  objectDeskSelectedColorIdx = null;
  renderObjectDeskGrid('object');
};
closeObjectDeskPanel.onclick = () => {
  objectDeskPanel.style.display = 'none';
};
objectDeskTabs.forEach(tab => {
  tab.onclick = function() {
    objectDeskTabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    const type = this.dataset.type;
    objectDeskSelectedColorIdx = null;
    renderObjectDeskGrid(type);
  };
});

document.addEventListener('DOMContentLoaded', function() {
  const cat = document.querySelector('.cat-interactive');
  const catBubble = document.getElementById('catBubble');
  const catMessages = [
    '무슨 일이든 지금 하고 있는 일에 몰두하도록 해.',
    '집중은 덜 중요한 다른 일을 순간적으로 잊어버리는 거야.',
    '유일한 행복은 목적을 위해 몰입할 때 와.',
    '지금 당장 할 수 있는 일에 집중하자.',
    '할 수 있는 것에 집중하고, 못 한 것을 후회하지 마.',
    '제대로 집중하면 6시간 걸릴 일을 30분만에 끝낼 수 있지만, 그 반대도 마찬가지야.',
    '하기 싫어도 일단 앉아서 5분만 해볼까?',
    '집중과 정신적 단단함이 승리의 격차를 만들지.',
    '모든 위대한 변화는 사소한 도미노부터 시작해.',
    '시작이 반이라는 말, 빈말이 아니야!'
  ];
  let catBubbleActive = false;
  if (cat) {
    cat.addEventListener('click', () => {
      if (catBubbleActive) return;
      catBubbleActive = true;
      // 말풍선
      const msg = catMessages[Math.floor(Math.random() * catMessages.length)];
      catBubble.textContent = msg;
      catBubble.classList.add('active');
      // 고양이 반응
      cat.style.setProperty('background-image', "url('./assets/images/others/cat-startled.gif')", 'important');
      cat.style.setProperty('background-position', 'center 60px', 'important');
      const meow = new Audio('./assets/musics/meow.mp3');
      meow.volume = 1.0;
      meow.currentTime = 0.9;
      meow.play();
      setTimeout(() => {
        cat.style.setProperty('background-image', "url('./assets/images/others/cat-default.gif')", 'important');
        cat.style.setProperty('background-position', 'center center', 'important');
        catBubble.classList.remove('active');
        catBubbleActive = false;
      }, 9500);
    });
  }
});

