let currentScenarioIndex = 0;
let anxiety = 100;
let gameData = {};
let timer;
let suggestionTimer;
let stats = {};
let currentTouristNumber = 1;
let currentRandomTarget = "";
let currentAudio = null;
let isMuted = false;
let currentMode = "medium";
let currentTab = "terminal";
let shiftReportPending = false;
let currentTouristTrait = null;
let currentScenarioFlow = null;
let currentHearingScore = 0;
let replaysThisCustomer = 0;

let isAnalysisUnlocked = false;
let isHearingConfirmed = false;
let isQuizPassed = false;
let currentQuiz = null;
let currentConfirmationText = "";
let saleInProgress = false;

let lives = 3;
let failedScenarioIds = [];
let unlockedItems = [];
let learnedWords = {};
let wordStats = {};
let discoveredCases = {};
let earnedAchievementIds = [];
let sessionAchievements = [];

const STORAGE_KEYS = {
    learnedWords: "kiosk_learned_words_v3",
    wordStats: "kiosk_word_stats_v3",
    discoveredCases: "kiosk_discovered_cases_v3",
    achievements: "kiosk_achievements_v3",
    notes: "kiosk_notes_v3"
};

const defaultAchievementData = [
    {
        id: "first_sale",
        title: "İlk Satış",
        description: "İlk doğru satışı tamamla."
    },
    {
        id: "terminal_user",
        title: "Terminal Çırağı",
        description: "Terminal çözümlemesini birkaç kez başarıyla kullan."
    },
    {
        id: "beyoglu_esnaf",
        title: "Beyoğlu Esnafı",
        description: "10 doğru satış yap."
    },
    {
        id: "case_hunter",
        title: "Padej Avcısı",
        description: "İlk padej keşfini yap."
    },
    {
        id: "case_master_3",
        title: "Padej Takipçisi",
        description: "3 farklı padej keşfet."
    },
    {
        id: "learned_5",
        title: "Sözlük Açılıyor",
        description: "5 kelimeyi öğrenilmiş seviyeye getir."
    },
    {
        id: "voda_reflex",
        title: "Voda Refleksi",
        description: "Su kelimesini refleks hâline getir."
    },
    {
        id: "tea_time",
        title: "Çay Saati",
        description: "Çay siparişini başarıyla çöz."
    },
    {
        id: "no_panic",
        title: "Panik Yok",
        description: "Süre azken doğru satış yap."
    },
    {
        id: "shift_survivor",
        title: "Vardiya Bitti",
        description: "Bir vardiya karnesi gör."
    },
    {
        id: "fluent_seller",
        title: "Akıcı Satıcı",
        description: "3 hızlı akıcı satış kontrolünü başarıyla geç."
    }
];

const tierThresholds = [
    { score: 0, items: ["voda", "cay", "kofe", "energetik", "shokolad"] },
    { score: 3, items: ["voda", "cay", "kofe", "energetik", "shokolad", "chipsi", "semecki", "sandwich", "morojenoe"] },
    { score: 7, items: ["voda", "cay", "kofe", "energetik", "shokolad", "chipsi", "semecki", "sandwich", "morojenoe", "jvacka", "sigareti", "zajigalka", "spicki"] },
    { score: 12, items: ["voda", "cay", "kofe", "energetik", "shokolad", "chipsi", "semecki", "sandwich", "morojenoe", "jvacka", "sigareti", "zajigalka", "spicki", "zaryadka", "batareyka", "karta", "plastir"] },
    { score: 18, items: ["voda", "cay", "kofe", "energetik", "shokolad", "chipsi", "semecki", "sandwich", "morojenoe", "jvacka", "sigareti", "zajigalka", "spicki", "zaryadka", "batareyka", "karta", "plastir", "gazeta", "maska", "salfetki"] }
];

const imageMap = {
    "voda": "water",
    "shokolad": "chocolate",
    "semecki": "seeds",
    "cay": "tea",
    "zaryadka": "charger",
    "zajigalka": "lighter",
    "salfetki": "tissues",
    "sigareti": "cigarettes",
    "morojenoe": "ice-cream",
    "jvacka": "gum",
    "kofe": "coffee",
    "energetik": "energy-drink",
    "chipsi": "chips",
    "batareyka": "batteries",
    "karta": "map",
    "plastir": "plaster",
    "gazeta": "newspaper",
    "maska": "mask",
    "sandwich": "sandwich",
    "spicki": "matches"
};

const itemNamesTR = {
    "voda": "Su",
    "shokolad": "Çikolata",
    "semecki": "Çekirdek",
    "cay": "Çay",
    "zaryadka": "Şarj Aleti",
    "zajigalka": "Çakmak",
    "salfetki": "Mendil",
    "sigareti": "Sigara",
    "morojenoe": "Dondurma",
    "jvacka": "Sakız",
    "kofe": "Kahve",
    "energetik": "Enerji İçeceği",
    "chipsi": "Cips",
    "batareyka": "Pil",
    "karta": "Harita",
    "plastir": "Yara Bandı",
    "gazeta": "Gazete",
    "maska": "Maske",
    "sandwich": "Sandviç",
    "spicki": "Kibrit"
};

const targetKeywords = {
    "voda": ["voda", "vodu", "vodi", "vodı", "vod", "vada", "vadu", "su", "water"],
    "shokolad": ["shokolad", "şokolad", "sokolad", "şokol", "shokol", "cikolata", "çikolata", "chocolate"],
    "semecki": ["semecki", "semechki", "semeçki", "semeç", "semec", "cekirdek", "çekirdek"],
    "cay": ["chay", "çay", "cay", "chai", "tea"],
    "zaryadka": ["zaryadka", "zaryadki", "zaryad", "zaryatka", "sarj", "şarj", "charger"],
    "zajigalka": ["zajigalka", "zajigalki", "zajigal", "zajıgalka", "cakmak", "çakmak", "lighter"],
    "salfetki": ["salfetki", "salfet", "salfetka", "mendil", "tissue"],
    "sigareti": ["sigareti", "sigaret", "sigarety", "sigara", "cigarette"],
    "morojenoe": ["morojenoe", "morojen", "marojen", "marojenoe", "dondurma", "icecream"],
    "jvacka": ["jvacka", "jvachka", "jvaçka", "jvaçku", "jvachku", "jvac", "sakiz", "sakız", "gum"],
    "kofe": ["kofe", "kafe", "kafi", "coffee", "kahve"],
    "energetik": ["energetik", "energeticheskiy", "energetiçeskiy", "energeticeskiy", "enargetik", "energatik", "napitok", "energet", "energy", "enerji"],
    "chipsi": ["chipsi", "çipsi", "cipsi", "çips", "cips", "chips", "çipsov", "chipsov"],
    "batareyka": ["batareyka", "batareyki", "batarey", "batare", "pil", "battery"],
    "karta": ["karta", "karti", "kartı", "kart", "harita", "map"],
    "plastir": ["plastir", "plastyr", "plastır", "yara", "bandi", "bandı", "plaster"],
    "gazeta": ["gazeta", "gazetu", "gazet", "newspaper"],
    "maska": ["maska", "mask", "maske"],
    "sandwich": ["sendvich", "sendviç", "sandvich", "sandviç", "sandvic", "sandwich"],
    "spicki": ["spichki", "spiçki", "spiç", "spic", "kibrit", "match"],
    "drink": ["popit", "pit", "chto", "sto", "şto", "nibud", "nıbud", "icecek", "içecek", "drink", "voda", "chay", "çay", "kofe", "energetik"],
    "random": ["eto", "eta", "etu", "vot", "von", "tu", "odnu", "sundan", "şundan", "bu"]
};

const commonHearingVariants = {
    "dayte": ["dayti", "dajte", "daiti", "dayte"],
    "mne": ["mne", "mine", "mnye", "mıne", "minye"],
    "mojno": ["mojna", "mojno", "mojnu"],
    "hoçu": ["hochu", "hoçu", "hoçü"],
    "kupit": ["kupit", "kupıt"],
    "vodu": ["voda", "vodu", "vadu", "vada"],
    "kofe": ["kofe", "kafe", "kafi"],
    "energeticheskiy": ["energetiçeskiy", "energeticeskiy", "energeticheskiy", "enargetiçeskiy", "energatiçeskiy"],
    "napitok": ["napitok", "napıtok", "napitak"]
};

const drinkTargets = ["voda", "cay", "kofe", "energetik"];

const touristTraits = [
    {
        id: "polite",
        label: "Kibar turist",
        hint: "Kibar müşteri: пожалуйста, можно gibi yumuşak kalıpları yakala.",
        timerFactor: 1.08,
        thresholdDelta: -0.01,
        replayDelta: 1,
        audioVolume: 1,
        speechRate: 0.86,
        quizBias: "culture"
    },
    {
        id: "hurried",
        label: "Aceleci turist",
        hint: "Aceleci müşteri: süre daha hızlı akar. Ana ürün sesini kaçırma.",
        timerFactor: 0.86,
        thresholdDelta: 0.04,
        replayDelta: -1,
        audioVolume: 1,
        speechRate: 1.04,
        quizBias: "role"
    },
    {
        id: "quiet",
        label: "Sessiz konuşan turist",
        hint: "Sessiz konuşuyor: tekrar dinlemeyi kullan, ürün tahminiyle acele etme.",
        timerFactor: 1,
        thresholdDelta: -0.03,
        replayDelta: 2,
        audioVolume: 0.72,
        speechRate: 0.82,
        quizBias: "reading"
    },
    {
        id: "direct",
        label: "Doğrudan turist",
        hint: "Doğrudan sipariş: fiil ve ürün seslerini ayır.",
        timerFactor: 1,
        thresholdDelta: 0,
        replayDelta: 0,
        audioVolume: 1,
        speechRate: 0.9,
        quizBias: "case"
    }
];

const itemPositions = {
    "gazeta": { x: 68, y: 20, w: 120 },
    "zaryadka": { x: 1, y: 42, w: 90 },
    "spicki": { x: 46, y: 78, w: 45 },
    "salfetki": { x: 90, y: 61, w: 110 },
    "maska": { x: 72, y: 81, w: 75 },
    "batareyka": { x: 86, y: 32, w: 42 },
    "sandwich": { x: 5, y: 56, w: 85 },
    "cay": { x: 28, y: 20, w: 50 },
    "jvacka": { x: 10, y: 80, w: 35 },
    "shokolad": { x: 70, y: 43, w: 72 },
    "chipsi": { x: -1, y: 56, w: 80 },
    "semecki": { x: 92, y: 32, w: 80 },
    "zajigalka": { x: 40, y: 78, w: 40 },
    "sigareti": { x: 33, y: 77, w: 66 },
    "morojenoe": { x: 76, y: 69, w: 60 },
    "plastir": { x: 9, y: 29, w: 50 },
    "energetik": { x: 6, y: 11, w: 35 },
    "karta": { x: 90, y: 14, w: 90 },
    "voda": { x: 1, y: 2, w: 45 },
    "kofe": { x: 28, y: 42, w: 50 }
};

const cyrillicMap = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo",
    "ж": "j", "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m",
    "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
    "ф": "f", "х": "h", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "sch",
    "ъ": "", "ы": "i", "ь": "", "э": "e", "ю": "yu", "я": "ya"
};

function ensureRuntimeDomPatches() {
    ensureCashSoundElement();
    ensureReportStoryElement();
}

function ensureCashSoundElement() {
    if (document.getElementById("cash-sound")) return;

    const audio = document.createElement("audio");
    audio.id = "cash-sound";
    audio.src = "assets/audio/cash-register-sound.mp3";
    audio.preload = "auto";

    document.body.appendChild(audio);
}

function ensureReportStoryElement() {
    if (document.getElementById("report-story")) return;

    const reportBox = document.querySelector(".shift-report-box");
    if (!reportBox) return;

    const reportSection = document.createElement("div");
    reportSection.className = "report-section";
    reportSection.innerHTML = `
        <h4>Vardiya Yorumu</h4>
        <div id="report-story" class="report-note"></div>
    `;

    const actions = reportBox.querySelector(".report-actions");

    if (actions) {
        reportBox.insertBefore(reportSection, actions);
    } else {
        reportBox.appendChild(reportSection);
    }
}

function getAllAchievements() {
    const existing = Array.isArray(gameData.achievements) ? gameData.achievements : [];
    const ids = new Set(existing.map(a => a.id));

    return [
        ...existing,
        ...defaultAchievementData.filter(a => !ids.has(a.id))
    ];
}

function getAchievementById(id) {
    return getAllAchievements().find(a => a.id === id) || {
        id,
        title: id,
        description: ""
    };
}

function startIntro() {
    const playBtn = document.getElementById("play-intro-btn");
    const video = document.getElementById("intro-video");
    const skipBtn = document.getElementById("skip-btn");

    if (playBtn) playBtn.style.display = "none";
    if (video) video.style.display = "block";
    if (skipBtn) skipBtn.style.display = "block";

    if (!video) {
        skipIntro();
        return;
    }

    video.play().catch(() => skipIntro());
    video.onended = skipIntro;
}

function skipIntro() {
    const video = document.getElementById("intro-video");

    if (video) {
        video.pause();
        video.currentTime = 0;
    }

    const intro = document.getElementById("intro-screen");
    const start = document.getElementById("start-screen");

    if (intro) intro.classList.add("hidden");
    if (start) start.classList.remove("hidden");
}

function startGame(mode) {
    currentMode = ["easy", "medium", "hard"].includes(mode) ? mode : "medium";

    ensureRuntimeDomPatches();

    const start = document.getElementById("start-screen");
    if (start) start.classList.add("hidden");

    if (currentMode === "hard") {
        document.body.classList.add("night-mode");

        const nightOverlay = document.getElementById("night-overlay");
        if (nightOverlay) nightOverlay.classList.remove("hidden");
    } else {
        document.body.classList.remove("night-mode");

        const nightOverlay = document.getElementById("night-overlay");
        if (nightOverlay) nightOverlay.classList.add("hidden");
    }

    const bgm = document.getElementById("bg-music");

    if (bgm) {
        bgm.volume = 0.01;
        bgm.muted = isMuted;

        if (!isMuted) {
            bgm.play().catch(() => {});
        }
    }

    lives = 3;
    stats = createFreshStats();
    failedScenarioIds = [];
    unlockedItems = tierThresholds[0].items.slice();
    resetScenarioState();
    shiftReportPending = false;
    saleInProgress = false;

    loadPersistentProgress();
    updateLivesUI();
    updateHUD();
    init();
}

function createFreshStats() {
    return {
        analyses: 0,
        correct: 0,
        customers: 0,
        xp: 0,
        replays: 0,
        terminalUses: 0,
        fastSales: 0,
        panicSales: 0,
        wrongCleared: 0,
        fluentPasses: 0,
        shiftCorrect: 0,
        shiftWrong: 0,
        shiftXpStart: 0,
        shiftLearnedStart: 0,
        shiftCaseStart: 0,
        lastCaseId: null
    };
}

function resetScenarioState() {
    isAnalysisUnlocked = false;
    isHearingConfirmed = false;
    isQuizPassed = false;
    currentQuiz = null;
    currentConfirmationText = "";
    currentRandomTarget = "";
    currentTouristTrait = null;
    currentScenarioFlow = null;
    currentHearingScore = 0;
    replaysThisCustomer = 0;
    saleInProgress = false;
}

async function init() {
    try {
        ensureRuntimeDomPatches();

        const response = await fetch("data.json");
        gameData = await response.json();

        if (!gameData.settings) gameData.settings = {};
        if (!gameData.lexicon) gameData.lexicon = {};
        if (!gameData.cases) gameData.cases = {};
        if (!gameData.achievements) gameData.achievements = [];

        unlockedItems = tierThresholds[0].items.slice();

        renderItems();
        renderAllPhoneTabs();
        loadSavedNotes();
        switchTab("terminal");
        loadLevel();
    } catch (error) {
        console.error("Veri yüklenemedi:", error);
        showActionHint("data.json yüklenemedi. Dosya adını ve konumunu kontrol et.", true);
    }
}

function getModeConfig() {
    return gameData.settings?.modes?.[currentMode] || {
        label: "Orta Mod",
        time: 100,
        timer_step: 0.3,
        min_words_to_detect: 2,
        target_match_required: 0.45,
        show_latin_hint: false,
        show_product_hint: false,
        show_case_hint: false,
        max_replays: 8
    };
}

function getAdjustedModeTime() {
    const baseTime = getModeConfig().time || 100;
    const traitFactor = currentTouristTrait?.timerFactor || 1;

    return Math.round(baseTime * traitFactor);
}

function getAdjustedMaxReplays() {
    const base = getModeConfig().max_replays ?? 8;
    const delta = currentTouristTrait?.replayDelta || 0;

    return Math.max(1, base + delta);
}

function getAdjustedModeThreshold() {
    let threshold = 0.5;

    if (currentMode === "easy") threshold = 0.38;
    if (currentMode === "medium") threshold = 0.5;
    if (currentMode === "hard") threshold = 0.64;

    threshold += currentTouristTrait?.thresholdDelta || 0;

    if (currentScenarioFlow?.level === "fluent") threshold -= 0.04;
    if (currentScenarioFlow?.level === "new") threshold += 0.01;

    return Math.max(0.30, Math.min(0.78, threshold));
}

function renderItems() {
    const container = document.getElementById("items-container");

    if (!container || !gameData.items) return;

    container.innerHTML = "";

    gameData.items.forEach(item => {
        if (!unlockedItems.includes(item.id)) return;

        const fileName = imageMap[item.id];
        const pos = itemPositions[item.id];

        if (fileName && pos) {
            const img = document.createElement("img");

            img.src = `assets/${fileName}.png`;
            img.className = "item-png";
            img.id = `item-${item.id}`;
            img.alt = itemNamesTR[item.id] || item.id;
            img.style.left = `${pos.x}%`;
            img.style.top = `${pos.y}%`;

            if (pos.w) {
                const widthPct = (pos.w / 960) * 100;
                img.style.width = `${widthPct}%`;
            }

            img.onclick = () => handleItemSelect(item.id);

            if (!isQuizPassed && isTerminalRequired()) {
                img.classList.add("item-locked");
            }

            container.appendChild(img);
        }
    });
}

function loadLevel() {
    if (!gameData.scenarios || gameData.scenarios.length === 0) return;

    stopCurrentTouristAudio();
    resetScenarioState();

    currentTouristTrait = touristTraits[Math.floor(Math.random() * touristTraits.length)];
    anxiety = getAdjustedModeTime();

    updateBarUI();
    updateShelfLockState(false);

    const playerBubble = document.getElementById("player-speech-bubble");
    if (playerBubble) playerBubble.classList.add("hidden");

    const failOverlay = document.getElementById("fail-overlay");
    const successOverlay = document.getElementById("success-overlay");
    const feedbackModal = document.getElementById("feedback-modal");
    const gameOver = document.getElementById("game-over-screen");
    const shiftReport = document.getElementById("shift-report-screen");

    if (failOverlay) failOverlay.classList.add("hidden");
    if (successOverlay) successOverlay.classList.add("hidden");
    if (feedbackModal) feedbackModal.classList.add("hidden");
    if (gameOver) gameOver.classList.add("hidden");
    if (shiftReport) shiftReport.classList.add("hidden");

    document.querySelectorAll(".item-png").forEach(el => {
        el.classList.remove("item-glow");

        if (isTerminalRequired()) {
            el.classList.add("item-locked");
        }
    });

    const availableScenarios = getAvailableScenarios();

    if (availableScenarios.length === 0) {
        showActionHint("Bu ürün kademesinde oynanabilir senaryo yok.", true);
        return;
    }

    const pickedScenario = pickScenarioWithWrongRepeat(availableScenarios);
    currentScenarioIndex = gameData.scenarios.findIndex(s => s.id === pickedScenario.id);
    const scenario = gameData.scenarios[currentScenarioIndex];

    currentScenarioFlow = evaluateScenarioFlow(scenario);

    const maleTourists = [1, 3, 5, 7, 9];
    const femaleTourists = [2, 4, 6, 8, 10];

    if (scenario.gender === "male") {
        currentTouristNumber = maleTourists[Math.floor(Math.random() * maleTourists.length)];
    } else if (scenario.gender === "female") {
        currentTouristNumber = femaleTourists[Math.floor(Math.random() * femaleTourists.length)];
    } else {
        currentTouristNumber = Math.floor(Math.random() * 10) + 1;
    }

    const touristLayer = document.getElementById("tourist-layer");

    if (touristLayer) {
        touristLayer.src = `assets/tourist-${currentTouristNumber}-idle.png`;
        touristLayer.classList.remove("hidden");
    }

    const speechBubble = document.getElementById("speech-bubble");

    if (speechBubble) {
        speechBubble.innerText = scenario.phrase;
        speechBubble.classList.remove("hidden");
    }

    setTimeout(() => {
        playTouristAudioForScenario(scenario);
    }, 250);

    resetTerminalForScenario();
    renderMiniDictionary();
    renderCaseHuntPreview(false);
    renderCultureNote(false);

    showActionHint(`${currentTouristTrait.label}: ${currentTouristTrait.hint}`, false, 3600);

    updateHUD();
    startTimer();
}

function getAvailableScenarios() {
    return gameData.scenarios.filter(s => {
        if (s.target_id === "drink" || s.target_id === "random") return true;
        return unlockedItems.includes(s.target_id);
    });
}

function pickScenarioWithWrongRepeat(availableScenarios) {
    const repeatPriority = gameData.settings?.wrong_repeat_priority ?? 0.6;
    const failedAvailable = availableScenarios.filter(s => failedScenarioIds.includes(s.id));

    if (failedAvailable.length > 0 && Math.random() < repeatPriority) {
        return failedAvailable[Math.floor(Math.random() * failedAvailable.length)];
    }

    return availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
}

function evaluateScenarioFlow(scenario) {
    const keys = getLexiconKeysFromScenario(scenario);
    const statsList = keys.map(key => wordStats[key]).filter(Boolean);

    const knownCount = keys.filter(key => learnedWords[key]).length;
    const seenCount = statsList.reduce((sum, item) => sum + (item.seen || 0), 0);
    const correctCount = statsList.reduce((sum, item) => sum + (item.correct || 0), 0);
    const streakSum = statsList.reduce((sum, item) => sum + (item.streak || 0), 0);

    const wordCount = Math.max(1, keys.length);
    const learnedRatio = knownCount / wordCount;
    const averageStreak = statsList.length ? streakSum / statsList.length : 0;
    const accuracy = seenCount > 0 ? correctCount / seenCount : 0;

    const caseId = scenario?.case_focus?.case_id || null;
    const caseKnown = caseId ? Boolean(discoveredCases[caseId]) : false;

    let level = "new";
    let label = "Yeni duyum";
    let compact = false;
    let fluentPassAllowed = false;

    if (learnedRatio >= 0.45 || caseKnown || averageStreak >= 2) {
        level = "familiar";
        label = "Tanıdık sipariş";
        compact = true;
    }

    if ((learnedRatio >= 0.75 && averageStreak >= 4 && accuracy >= 0.75) || (caseKnown && learnedRatio >= 0.7 && averageStreak >= 3)) {
        level = "fluent";
        label = "Akıcı satış kontrolü";
        compact = true;
        fluentPassAllowed = true;
    }

    if (currentMode === "hard") {
        fluentPassAllowed = fluentPassAllowed && averageStreak >= 5;
    }

    return {
        level,
        label,
        compact,
        fluentPassAllowed,
        keys,
        knownCount,
        totalKnownTokens: keys.length,
        learnedRatio,
        averageStreak,
        accuracy,
        caseId,
        caseKnown
    };
}

function resetTerminalForScenario() {
    const phoneOutput = document.getElementById("phone-output");

    if (phoneOutput) {
        phoneOutput.classList.remove("terminal-unlocked", "terminal-error");
        phoneOutput.innerHTML = getTerminalIdleHTML();
    }

    const phoneInput = document.getElementById("phone-input");
    if (phoneInput) phoneInput.value = "";

    const replyContainer = document.getElementById("reply-container");
    if (replyContainer) replyContainer.innerHTML = "";

    const casePanel = document.getElementById("case-hunt-panel");
    const culturePanel = document.getElementById("culture-note-panel");

    if (casePanel) casePanel.classList.add("hidden");
    if (culturePanel) culturePanel.classList.add("hidden");
}

function getTerminalIdleHTML() {
    const flow = currentScenarioFlow || { label: "Yeni duyum", level: "new" };
    const trait = currentTouristTrait || { label: "Turist", hint: "Sesi yakala." };

    const flowLine = flow.level === "fluent"
        ? "Bu sipariş tanıdık. Duyumu iyi yakalarsan kısa akıcı satış kontrolü açılır."
        : flow.level === "familiar"
            ? "Bu sipariş tanıdık. Çözümleme kısa tutulacak."
            : "Bu sipariş yeni olabilir. Kısa ipucu + mini quiz ile ilerleyeceksin.";

    return `
        <div class="terminal-title">Terminal dinlemede...</div>
        <div class="focus-card">
            <b>${escapeHtml(trait.label)}:</b> ${escapeHtml(trait.hint)}
        </div>
        <div class="mastery-card">
            <b>Akış:</b> ${escapeHtml(flow.label)}<br>
            ${escapeHtml(flowLine)}
        </div>
        <div class="terminal-help">
            Kiril yazma. Duyduğun okunuşu yaz. Tek kelimeyle çözümleme açılmaz; ya cümlenin yaklaşık tamamını yaz ya da istenen ürünü yakala.
        </div>
        <div class="terminal-help">
            Yakın duyumlar kabul edilir: <b>dayte/dayti</b>, <b>kofe/kafe</b>, <b>energetik/enargetik</b> gibi.
        </div>
    `;
}

function isTerminalRequired() {
    if (!gameData.settings) return true;
    return gameData.settings.terminal_required !== false;
}

function setupTerminalInput() {
    const input = document.getElementById("phone-input");

    if (!input) return;

    input.addEventListener("input", e => {
        handleTerminalTyping(e.target.value);
    });

    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            attemptTerminalUnlock(e.target.value, true);
        }
    });
}

function handleTerminalTyping(rawValue) {
    const phoneOutput = document.getElementById("phone-output");
    const scenario = gameData.scenarios?.[currentScenarioIndex];

    if (!phoneOutput || !scenario) return;

    clearTimeout(suggestionTimer);

    const value = rawValue.trim();

    if (!value) {
        phoneOutput.classList.remove("terminal-unlocked", "terminal-error");
        phoneOutput.innerHTML = getTerminalIdleHTML();
        return;
    }

    if (isHearingConfirmed) return;

    phoneOutput.classList.remove("terminal-unlocked", "terminal-error");
    phoneOutput.innerHTML = `
        <div class="terminal-title">Ses dinleniyor...</div>
        <div class="terminal-help">
            Yazdığını kontrol ediyorum. Ürün veya çeviri ipucu yok; önce sen duyacaksın.
        </div>
    `;

    suggestionTimer = setTimeout(() => {
        attemptTerminalUnlock(value, false);
    }, 520);
}

function attemptTerminalUnlock(rawValue, forcedByEnter) {
    const phoneOutput = document.getElementById("phone-output");
    const scenario = gameData.scenarios?.[currentScenarioIndex];

    if (!phoneOutput || !scenario) return;
    if (isHearingConfirmed) return;

    const value = rawValue.trim();

    if (!value) {
        phoneOutput.innerHTML = getTerminalIdleHTML();
        return;
    }

    const gate = getHearingGateStatus(value, scenario);

    if (!gate.allowed) {
        renderHearingGateWarning(value, scenario, forcedByEnter, gate);
        return;
    }

    const score = getPhraseMatchScore(value, scenario);
    const threshold = getAdjustedModeThreshold();
    const finalScore = gate.hasTargetProduct ? Math.max(score, threshold) : score;

    currentHearingScore = finalScore;

    if (finalScore >= threshold) {
        currentConfirmationText = scenario.latin_hint || scenario.phonetics?.[0] || transliterateCyrillic(scenario.phrase);
        renderHearingConfirmation(value, currentConfirmationText, finalScore);
        return;
    }

    phoneOutput.classList.add("terminal-error");

    const inputWordCount = value.split(/\s+/).filter(Boolean).length;
    const expectedWordCount = getExpectedLatinWords(scenario).length;

    if (forcedByEnter) {
        phoneOutput.innerHTML = `
            <div class="terminal-warning">
                Kelime sayısı yeterli ama ses benzerliği düşük. Tekrar dinle ve cümleyi daha yakın yaz.
            </div>
            <div class="terminal-help">
                Yazdığın kelime sayısı: ${inputWordCount}. Beklenen yaklaşık kelime sayısı: ${expectedWordCount}.
            </div>
            <button class="retry-hearing-btn" onclick="replayAudio()">🔊 Tekrar Dinle</button>
        `;
    } else {
        phoneOutput.innerHTML = `
            <div class="terminal-title">Henüz emin değilim...</div>
            <div class="terminal-help">
                Kelime sayısı veya ürün yakalama şartı tamam ama duyum hâlâ uzak. Biraz daha düzelt.
            </div>
        `;
    }
}

function getHearingGateStatus(rawInput, scenario) {
    const inputWords = normalizeSearchText(rawInput).split(/\s+/).filter(Boolean);
    const expectedWords = getExpectedLatinWords(scenario);
    const hasEnoughWords = inputWords.length >= expectedWords.length;
    const hasTargetProduct = currentTargetMatchesInput(rawInput, scenario);

    return {
        allowed: hasEnoughWords || hasTargetProduct,
        hasEnoughWords,
        hasTargetProduct,
        inputWordCount: inputWords.length,
        expectedWordCount: expectedWords.length
    };
}

function renderHearingGateWarning(rawInput, scenario, forcedByEnter, gate) {
    const phoneOutput = document.getElementById("phone-output");

    if (!phoneOutput) return;

    phoneOutput.classList.add("terminal-error");

    const message = forcedByEnter
        ? "Henüz çözümleme açılmaz. Ya cümlenin yaklaşık tamamını yazmalısın ya da yazdığın metinde istenen ürün geçmeli."
        : "Devam et. Tek kelimeyle öneri açılmaz.";

    phoneOutput.innerHTML = `
        <div class="terminal-warning">
            ${message}
        </div>
        <div class="terminal-help">
            Yazdığın kelime sayısı: <b>${gate.inputWordCount}</b><br>
            Bu cümlede beklenen yaklaşık kelime sayısı: <b>${gate.expectedWordCount}</b><br>
            Ürün yakalandı mı? <b>${gate.hasTargetProduct ? "Evet" : "Hayır"}</b>
        </div>
        <button class="retry-hearing-btn" onclick="replayAudio()">🔊 Tekrar Dinle</button>
    `;
}

function renderHearingConfirmation(playerInput, suggestedLatin, score) {
    const phoneOutput = document.getElementById("phone-output");

    if (!phoneOutput) return;

    const scorePct = Math.round(score * 100);
    const flow = currentScenarioFlow || { level: "new" };

    let flowMessage = "Onaylarsan kısa çözümleme açılır. Raflar için mini quiz şart.";

    if (flow.level === "familiar") {
        flowMessage = "Bu tanıdık sipariş. Onaylarsan çözümleme kısa tutulacak.";
    }

    if (flow.level === "fluent") {
        flowMessage = "Bu akıcı satış adayı. Onaylarsan hızlı kontrol açılır.";
    }

    phoneOutput.classList.remove("terminal-error");
    phoneOutput.innerHTML = `
        <div class="confirmation-box">
            <div class="terminal-title">Bunu mu demek istiyorsun?</div>
            <div class="terminal-help">
                Senin yazdığın:
                <div class="heard-line">${escapeHtml(playerInput)}</div>
                Terminalin duyduğu tam okunuş:
                <div class="heard-line">${escapeHtml(suggestedLatin)}</div>
                Yakınlık: ${scorePct}%
            </div>
            <div class="small-warning">
                ${escapeHtml(flowMessage)}
            </div>
            <button class="confirm-btn" onclick="confirmHeardPhrase()">Evet, bunu demek istiyorum</button>
            <button class="retry-hearing-btn" onclick="rejectHeardPhrase()">Hayır, tekrar yazacağım</button>
        </div>
    `;
}

function confirmHeardPhrase() {
    const scenario = gameData.scenarios?.[currentScenarioIndex];

    if (!scenario) return;

    if (!isHearingConfirmed) {
        isHearingConfirmed = true;
        isAnalysisUnlocked = true;
        stats.analyses++;
        stats.terminalUses++;
        addXP(2);
    }

    const phoneOutput = document.getElementById("phone-output");

    if (phoneOutput) {
        phoneOutput.classList.remove("terminal-error");
        phoneOutput.classList.add("terminal-unlocked");
    }

    discoverCaseFromScenario(scenario);
    renderInteractiveAnalysis();
    renderMiniDictionary();
    renderCaseHuntPreview(true);
    renderCultureNote(true);
    updateShelfLockState(false);
    updateHUD();
    checkAchievements();

    if (currentScenarioFlow?.level === "fluent") {
        showActionHint("Akıcı satış kontrolü açıldı. Hızlı kontrolü geçersen raflar açılır.", false, 3000);
    } else {
        showActionHint("Kısa çözümleme açıldı. Rafları açmak için mini quiz'i doğru cevapla.", false, 3000);
    }
}

function rejectHeardPhrase() {
    const input = document.getElementById("phone-input");
    const phoneOutput = document.getElementById("phone-output");

    if (input) {
        input.value = "";
        setTimeout(() => input.focus(), 50);
    }

    if (phoneOutput) {
        phoneOutput.classList.remove("terminal-error", "terminal-unlocked");
        phoneOutput.innerHTML = getTerminalIdleHTML();
    }

    showActionHint("Tekrar dinle ve kulağına gelen okunuşu yeniden yaz.", false, 2000);
}

function renderInteractiveAnalysis() {
    const phoneOutput = document.getElementById("phone-output");
    const scenario = gameData.scenarios[currentScenarioIndex];

    if (!phoneOutput || !scenario) return;

    currentScenarioFlow = currentScenarioFlow || evaluateScenarioFlow(scenario);
    currentQuiz = createMiniQuiz(scenario);

    if (currentScenarioFlow.level === "fluent" && currentScenarioFlow.fluentPassAllowed) {
        phoneOutput.innerHTML = buildFluentSalePanel(scenario, currentScenarioFlow);
        return;
    }

    const showFullLanguageCards = currentScenarioFlow.level === "new";
    const translationLine = showFullLanguageCards
        ? `<br><b>TR:</b> ${escapeHtml(scenario.translation || "Çeviri yok.")}`
        : "";

    phoneOutput.innerHTML = `
        <div class="terminal-success">
            Duyum onaylandı. ${showFullLanguageCards ? "Kısa ipucunu kullanıp mini quiz'i çöz." : "Bu tanıdık sipariş; açıklama kısa tutuldu."}
        </div>

        <div class="literal-line">
            <b>Kiril:</b> ${escapeHtml(scenario.phrase)}<br>
            <b>Okunuş:</b> ${escapeHtml(scenario.latin_hint || scenario.phonetics?.[0] || "")}
            ${translationLine}
        </div>

        ${buildMasteryStrip(currentScenarioFlow)}
        ${buildCompactAnalysis(scenario, currentScenarioFlow)}

        ${showFullLanguageCards ? buildLanguageCardBlock(scenario) : ""}

        ${!showFullLanguageCards ? `
            <div class="terminal-help">
                Detaylı kelime açıklamaları Mini Sözlük sekmesinde. Burada sadece hızlı kontrol var.
            </div>
        ` : ""}

        ${buildMiniQuizHTML(currentQuiz)}
    `;
}

function buildLanguageCardBlock(scenario) {
    return `
        <div class="terminal-title">Kısa kelime kartları</div>
        <div class="word-blocks">
            ${buildWordBlocks(scenario.phrase)}
        </div>

        <div id="word-info-panel" class="word-info-panel">
            Kelimeye gelince kısa bilgi burada görünür. Detay için Mini Sözlük sekmesini kullan.
        </div>
    `;
}

function buildFluentSalePanel(scenario, flow) {
    currentQuiz = createFluentCheckQuiz(scenario, flow);

    return `
        <div class="fluent-card">
            <b>Akıcı satış kontrolü</b><br>
            Bu sipariş artık tanıdık. Uzun çözümleme yok. Kısa kontrolü geçersen raflar açılır.
        </div>

        <div class="literal-line">
            <b>Kiril:</b> ${escapeHtml(scenario.phrase)}<br>
            <b>Okunuş:</b> ${escapeHtml(scenario.latin_hint || scenario.phonetics?.[0] || "")}
        </div>

        ${buildMasteryStrip(flow)}
        ${buildMiniQuizHTML(currentQuiz)}
    `;
}

function createFluentCheckQuiz(scenario, flow) {
    const knownTokens = getKnownTokensFromScenario(scenario);
    const productToken = knownTokens.find(item => item.entry.role === "object");
    const verbToken = knownTokens.find(item => item.entry.role === "verb");

    if (productToken && verbToken && Math.random() < 0.5) {
        return {
            type: "fluent-role",
            question: "Hızlı kontrol: ürün/sipariş nesnesi hangi kelime?",
            correct: productToken.token,
            options: buildTokenOptions(productToken.token, knownTokens),
            explanation: `${productToken.token} [${productToken.entry.latin || transliterateCyrillic(productToken.token)}] = ${productToken.entry.tr || "ürün"}.`
        };
    }

    if (scenario.case_focus?.case_id) {
        return createCaseWhyQuiz(scenario, flow);
    }

    return createReadingMatchQuiz(scenario);
}

function buildMasteryStrip(flow) {
    if (!flow) return "";

    const wordLine = flow.totalKnownTokens > 0
        ? `${flow.knownCount}/${flow.totalKnownTokens} kelime tanıdık`
        : "Bu cümlede kayıtlı kelime az";

    const caseLine = flow.caseKnown
        ? "Bu padeji daha önce keşfettin"
        : "Bu padej henüz yeni olabilir";

    const levelLine = flow.level === "fluent"
        ? "Akıcı kontrol: uzun çözümleme kısaltıldı"
        : flow.level === "familiar"
            ? "Tanıdık sipariş: açıklama kısaltıldı"
            : "Yeni sipariş: temel ipucu gösteriliyor";

    return `
        <div class="mastery-card">
            <b>Öğrenme durumu:</b> ${escapeHtml(levelLine)}<br>
            <b>Kelime hafızası:</b> ${escapeHtml(wordLine)}<br>
            <b>Padej hafızası:</b> ${escapeHtml(caseLine)}
        </div>
    `;
}

function buildCompactAnalysis(scenario, flow = null) {
    const focus = scenario.case_focus;
    const caseData = focus?.case_id ? gameData.cases?.[focus.case_id] : null;

    if (flow?.level === "fluent") {
        return `
            <div class="compact-analysis">
                <b>Odak:</b> Bu artık hızlı hatırlama turu.<br>
                <b>Görev:</b> Sesi doğrula, mini kontrolü geç, ürünü ver.
            </div>
        `;
    }

    if (flow?.level === "familiar") {
        if (focus && caseData) {
            return `
                <div class="compact-analysis">
                    <b>Hatırlatma:</b> ${escapeHtml(focus.before || "")} → ${escapeHtml(focus.after || "")}<br>
                    <b>Padej:</b> ${escapeHtml(caseData.phonetic)} = ${escapeHtml(caseData.tr)}
                </div>
            `;
        }

        return `
            <div class="compact-analysis">
                <b>Hatırlatma:</b> Bu tanıdık sipariş. Ana ürün sesini ve kalıbı kontrol et.
            </div>
        `;
    }

    if (!focus || !caseData) {
        return `
            <div class="compact-analysis">
                <b>Odak:</b> Ana kalıbı ve ürün sesini yakala.<br>
                <b>Mini hedef:</b> Quiz ürün tahmini değil; ses, kelime görevi veya kibar kalıp farkındalığı soracak.
            </div>
        `;
    }

    return `
        <div class="compact-analysis">
            <b>Odak:</b> ${escapeHtml(focus.before || "")} → ${escapeHtml(focus.after || "")}<br>
            <b>Neden?</b> ${escapeHtml(focus.why_changed || "")}<br>
            <b>Padej:</b> ${escapeHtml(caseData.name_ru)} [${escapeHtml(caseData.phonetic)}] = ${escapeHtml(caseData.tr)}
        </div>
    `;
}

function createMiniQuiz(scenario) {
    const flow = currentScenarioFlow || evaluateScenarioFlow(scenario);
    const traitBias = currentTouristTrait?.quizBias || "";

    if (flow.level === "fluent" && flow.fluentPassAllowed) {
        return createFluentCheckQuiz(scenario, flow);
    }

    if (traitBias === "culture") {
        const cultureQuiz = createCultureQuiz(scenario);
        if (cultureQuiz) return cultureQuiz;
    }

    if (traitBias === "role") {
        const roleQuiz = createWordRoleQuiz(scenario);
        if (roleQuiz) return roleQuiz;
    }

    if (traitBias === "reading") {
        return createReadingMatchQuiz(scenario);
    }

    if (scenario.case_focus?.case_id) {
        return createCaseWhyQuiz(scenario, flow);
    }

    const cultureQuiz = createCultureQuiz(scenario);
    if (cultureQuiz) return cultureQuiz;

    const roleQuiz = createWordRoleQuiz(scenario);
    if (roleQuiz) return roleQuiz;

    return createReadingMatchQuiz(scenario);
}

function createCaseWhyQuiz(scenario, flow = null) {
    const focus = scenario.case_focus;
    const caseData = gameData.cases?.[focus.case_id];

    const correct = focus.why_changed || "Bu kelime sahnedeki görevi değiştiği için biçim değiştirdi.";

    const distractors = [
        "Çünkü kelime geçmiş zaman oldu.",
        "Çünkü cümlede soru işareti var.",
        "Çünkü kelime çoğul yapılmak zorunda.",
        "Çünkü пожалуйста kelimesi her kelimeyi değiştirir.",
        "Çünkü Rusçada her ürün adı rastgele ek alır."
    ].filter(x => x !== correct);

    const familiarPrefix = flow?.caseKnown ? "Hatırlama: " : "";

    return {
        type: "case-why",
        question: `${familiarPrefix}${focus.before || "Kelime"} neden ${focus.after || "bu biçime"} dönüştü?`,
        correct,
        options: shuffleArray([correct, ...distractors.slice(0, 3)]),
        explanation: `${caseData ? `${caseData.phonetic} = ${caseData.tr}. ` : ""}${focus.scene_link || ""}`
    };
}

function createCultureQuiz(scenario) {
    const phrase = scenario.phrase || "";

    if (phrase.includes("пожалуйста")) {
        return {
            type: "culture",
            question: "пожалуйста cümleye ne katar?",
            correct: "İsteği kibarlaştırır.",
            options: shuffleArray([
                "İsteği kibarlaştırır.",
                "Ürünü çoğul yapar.",
                "Geçmiş zaman anlamı verir.",
                "Ürünün stokta olmadığını söyler."
            ]),
            explanation: "пожалуйста, alışverişte doğrudan isteği daha nazik hale getirir."
        };
    }

    if (phrase.includes("У вас есть") || phrase.includes("у вас есть")) {
        return {
            type: "culture",
            question: "У вас есть...? alışverişte ne işe yarar?",
            correct: "Sizde ... var mı? diye sormaya yarar.",
            options: shuffleArray([
                "Sizde ... var mı? diye sormaya yarar.",
                "Ben satın aldım demektir.",
                "Fiyat pazarlığı başlatır.",
                "Ürünün bozuk olduğunu söyler."
            ]),
            explanation: "Bu kalıp kiosklarda ürün var mı diye sormanın güvenli ve kibar yoludur."
        };
    }

    if (phrase.includes("можно") || phrase.includes("Можно")) {
        return {
            type: "culture",
            question: "можно alışveriş cümlesinde nasıl bir iş görür?",
            correct: "Kibarca isteme veya rica başlatır.",
            options: shuffleArray([
                "Kibarca isteme veya rica başlatır.",
                "Ürünün rengini söyler.",
                "Geçmiş zamanda ödeme yapıldığını anlatır.",
                "Ürünün yasak olduğunu belirtir."
            ]),
            explanation: "можно, günlük alışverişte 'alabilir miyim / mümkün mü' hissi verir."
        };
    }

    return null;
}

function createWordRoleQuiz(scenario) {
    const known = getKnownTokensFromScenario(scenario);

    const verb = known.find(item => item.entry.role === "verb");
    if (verb) {
        const options = buildTokenOptions(verb.token, known);

        if (options.length >= 3) {
            return {
                type: "word-role",
                question: "Bu cümlede eylem/istek bildiren kelime hangisi?",
                correct: verb.token,
                options,
                explanation: `${verb.token} [${verb.entry.latin || transliterateCyrillic(verb.token)}] = ${verb.entry.tr || "eylem/istek bildirir"}.`
            };
        }
    }

    const objectWord = known.find(item => item.entry.role === "object");
    if (objectWord) {
        const options = buildTokenOptions(objectWord.token, known);

        if (options.length >= 3) {
            return {
                type: "word-role",
                question: "Bu cümlede istenen nesne/ürün hangi kelimeyle geçiyor?",
                correct: objectWord.token,
                options,
                explanation: `${objectWord.token} [${objectWord.entry.latin || transliterateCyrillic(objectWord.token)}] = ${objectWord.entry.tr || "istenen nesne"}.`
            };
        }
    }

    const caseWord = known.find(item => item.entry.role === "case");
    if (caseWord) {
        const options = buildTokenOptions(caseWord.token, known);

        if (options.length >= 3) {
            return {
                type: "word-role",
                question: "Bu cümlede hâl/ilişki kuran kelime hangisi?",
                correct: caseWord.token,
                options,
                explanation: `${caseWord.token} [${caseWord.entry.latin || transliterateCyrillic(caseWord.token)}] cümlede ilişki/hâl kurar.`
            };
        }
    }

    return null;
}

function createReadingMatchQuiz(scenario) {
    const known = getKnownTokensFromScenario(scenario).filter(item => item.entry.latin);

    if (known.length === 0) {
        return {
            type: "listening",
            question: "Bu cümledeki en önemli beceri ne?",
            correct: "Kiril yazmadan duyduğun sesi anlamak.",
            options: shuffleArray([
                "Kiril yazmadan duyduğun sesi anlamak.",
                "Her kelimeyi ezbere Kiril yazmak.",
                "Ürünü tahmin ederek geçmek.",
                "Sadece Türkçe çeviriye bakmak."
            ]),
            explanation: "Bu oyunda amaç yazı ezberi değil, ses-anlam bağlantısı kurmaktır."
        };
    }

    const picked = known[Math.floor(Math.random() * known.length)];
    const correct = picked.entry.latin || transliterateCyrillic(picked.token);

    const distractors = Object.values(gameData.lexicon)
        .map(e => e.latin)
        .filter(Boolean)
        .filter(x => x !== correct)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    return {
        type: "reading-match",
        question: `"${picked.token}" hangi okunuşa karşılık gelir?`,
        correct,
        options: shuffleArray([correct, ...distractors]),
        explanation: `${picked.token} = ${correct} = ${picked.entry.tr || ""}`
    };
}

function getKnownTokensFromScenario(scenario) {
    return tokenizePhrase(scenario.phrase)
        .map(token => {
            const key = normalizeLexiconKey(token);
            const entry = gameData.lexicon?.[key];

            return entry ? { token, key, entry } : null;
        })
        .filter(Boolean);
}

function buildTokenOptions(correctToken, knownTokens) {
    const otherTokens = knownTokens
        .map(item => item.token)
        .filter(token => token !== correctToken);

    const fallback = [
        "можно",
        "мне",
        "дайте",
        "воду",
        "чай",
        "кофе",
        "пожалуйста",
        "один",
        "есть"
    ].filter(token => token !== correctToken && !otherTokens.includes(token));

    return shuffleArray([correctToken, ...otherTokens, ...fallback].slice(0, 4));
}

function buildMiniQuizHTML(quiz) {
    if (!quiz) return "";

    const title = currentScenarioFlow?.level === "fluent"
        ? "⚡ Hızlı Kontrol"
        : "🧩 Mini Quiz";

    return `
        <div class="quiz-box" id="mini-quiz-box">
            <h4>${title}</h4>
            <div class="quiz-question">${escapeHtml(quiz.question)}</div>
            ${quiz.options.map((option, index) => `
                <button class="quiz-option" onclick="handleQuizAnswerByIndex(${index})">
                    ${escapeHtml(option)}
                </button>
            `).join("")}
            <div id="quiz-feedback" class="quiz-feedback"></div>
        </div>
    `;
}

function handleQuizAnswerByIndex(index) {
    if (!currentQuiz || !currentQuiz.options[index]) return;

    handleQuizAnswer(currentQuiz.options[index]);
}

function handleQuizAnswer(selected) {
    if (!currentQuiz) return;

    const feedback = document.getElementById("quiz-feedback");
    const options = document.querySelectorAll(".quiz-option");

    options.forEach(btn => {
        const text = btn.innerText.trim();

        btn.disabled = true;

        if (text === currentQuiz.correct) {
            btn.classList.add("correct");
        }

        if (text === selected && selected !== currentQuiz.correct) {
            btn.classList.add("wrong");
        }
    });

    if (selected === currentQuiz.correct) {
        isQuizPassed = true;
        updateShelfLockState(true);

        const xpGain = currentScenarioFlow?.level === "fluent" ? 2 : 4;
        addXP(xpGain);

        if (currentScenarioFlow?.level === "fluent") {
            stats.fluentPasses++;
        }

        if (feedback) {
            feedback.className = "quiz-feedback good";
            feedback.innerHTML = `
                Doğru. Raflar açıldı.<br>
                ${escapeHtml(currentQuiz.explanation || "")}
            `;
        }

        renderReplies();
        showFinalHintAndGlow();

        const message = currentScenarioFlow?.level === "fluent"
            ? "Hızlı kontrol doğru. Raflar açıldı; ürünü ver."
            : "Mini quiz doğru. Şimdi doğru ürünü seçebilirsin.";

        showActionHint(message, false, 2600);
    } else {
        isQuizPassed = false;

        if (currentScenarioFlow?.level === "fluent") {
            currentScenarioFlow.level = "familiar";
            currentScenarioFlow.fluentPassAllowed = false;
        }

        if (feedback) {
            feedback.className = "quiz-feedback bad";
            feedback.innerHTML = `
                Yanlış. Raflar açılmadı.<br>
                ${escapeHtml(currentQuiz.explanation || "")}<br>
                <button class="retry-hearing-btn" onclick="renderInteractiveAnalysis()">Quiz'i tekrar dene</button>
            `;
        }

        showActionHint("Kontrol yanlış. Kısa ipucunu oku ve tekrar dene.", true, 2200);

        setTimeout(() => {
            renderInteractiveAnalysis();
        }, 1800);
    }
}

function buildWordBlocks(phrase) {
    return tokenizePhrase(phrase).map(token => {
        const key = normalizeLexiconKey(token);
        const entry = gameData.lexicon?.[key];

        if (!entry) {
            return `<span class="word-block passive">${escapeHtml(token)}</span>`;
        }

        const role = entry.role || "neutral";
        const latin = entry.latin || transliterateCyrillic(token);
        const level = getWordLearningLevel(key);
        const levelMark = level.id === "reflex" ? "★" : level.id === "learned" ? "✓" : "";

        return `
            <span
                class="word-block ${escapeHtml(role)}"
                data-word-key="${escapeAttribute(key)}"
                onmouseenter="showWordInfoFromElement(this)"
            >
                ${escapeHtml(token)}
                <span style="opacity:.7;">[${escapeHtml(latin)}]</span>
                ${levelMark ? `<span style="opacity:.9;color:#f1c40f;">${levelMark}</span>` : ""}
            </span>
        `;
    }).join("");
}

function showWordInfoFromElement(el) {
    if (!el) return;

    const key = el.dataset.wordKey;
    const entry = gameData.lexicon?.[key];
    const panel = document.getElementById("word-info-panel");

    if (!panel || !entry) return;

    const level = getWordLearningLevel(key);
    const stat = wordStats[key] || {};
    const caseInfo = entry.case && gameData.cases?.[entry.case]
        ? `<br><span class="muted">Padej: ${escapeHtml(gameData.cases[entry.case].phonetic)} = ${escapeHtml(gameData.cases[entry.case].tr)}</span>`
        : "";

    panel.innerHTML = `
        <b>${escapeHtml(key)}</b>
        [${escapeHtml(entry.latin || transliterateCyrillic(key))}]
        = ${escapeHtml(entry.tr || "")}<br>
        <span class="muted">${escapeHtml(entry.grammar || "")}</span>
        ${caseInfo}<br>
        <span class="muted">
            Seviye: ${escapeHtml(level.label)} |
            Görülme: ${stat.seen || 0} |
            Doğru: ${stat.correct || 0} |
            Seri: ${stat.streak || 0}
        </span><br>
        ${escapeHtml(entry.note || "")}
    `;
}

function renderReplies() {
    const container = document.getElementById("reply-container");

    if (!container || !gameData.replies) return;

    if (!isQuizPassed) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = "";

    const title = document.createElement("div");
    title.className = "terminal-title";
    title.innerText = "Cevap ver";
    container.appendChild(title);

    const positiveList = gameData.replies.positive || [];
    const negativeList = gameData.replies.negative || [];

    const posStr = positiveList[Math.floor(Math.random() * positiveList.length)] || "Да, конечно. - Evet, tabii ki.";
    const negStr = negativeList[Math.floor(Math.random() * negativeList.length)] || "К сожалению, нет. - Maalesef, hayır.";

    const replies = [
        { text: posStr, type: "positive" },
        { text: negStr, type: "negative" }
    ].sort(() => Math.random() - 0.5);

    replies.forEach(reply => {
        const btn = document.createElement("button");

        btn.className = "resp-btn";
        btn.innerHTML = reply.text;
        btn.onclick = () => handleReply(reply.type, reply.text);

        container.appendChild(btn);
    });
}

function handleReply(type, text) {
    const scenario = gameData.scenarios[currentScenarioIndex];
    const playerBubble = document.getElementById("player-speech-bubble");

    if (!isQuizPassed) {
        showActionHint("Önce mini quiz'i geçmelisin.", true, 1800);
        return;
    }

    if (playerBubble) {
        playerBubble.innerText = text.split(" - ")[0];
        playerBubble.classList.remove("hidden");
    }

    if (type !== scenario.correct_type) {
        markScenarioWrong(scenario);
        showMeaningfulFailure("yanlis_cevap");
        return;
    }

    if (scenario.correct_type === "negative") {
        success(null);
        return;
    }

    showActionHint("Cevap doğru. Şimdi doğru ürünü ver.", false, 2200);
}

function handleItemSelect(clickedId) {
    const scenario = gameData.scenarios[currentScenarioIndex];

    if (!scenario || saleInProgress) return;

    if (isTerminalRequired() && !isHearingConfirmed) {
        showActionHint("Önce terminale duyduğun okunuşu yazıp onaylamalısın.", true, 2200);
        openPhoneAndFocus();
        return;
    }

    if (isTerminalRequired() && !isQuizPassed) {
        showActionHint("Çözümlemeyi gördün ama raflar hâlâ kilitli. Mini quiz'i geç.", true, 2200);
        openPhoneAndFocus();
        return;
    }

    if (isCorrectItem(clickedId, scenario)) {
        success(clickedId);
        return;
    }

    markScenarioWrong(scenario);
    showMeaningfulFailure(clickedId);
}

function isCorrectItem(clickedId, scenario) {
    if (scenario.target_id === "drink") {
        return drinkTargets.includes(clickedId);
    }

    if (scenario.target_id === "random") {
        return clickedId === currentRandomTarget;
    }

    return clickedId === scenario.target_id;
}

function success(itemId) {
    if (saleInProgress) return;

    saleInProgress = true;

    clearInterval(timer);
    stopCurrentTouristAudio();

    const scenario = gameData.scenarios[currentScenarioIndex];
    const wasWrongRepeat = failedScenarioIds.includes(scenario.id);

    if (wasWrongRepeat) {
        failedScenarioIds = failedScenarioIds.filter(id => id !== scenario.id);
        stats.wrongCleared++;
        addXP(gameData.settings?.xp?.wrong_repeat_cleared || 10);
        showActionHint("Daha önce yanlış yaptığın siparişi bu kez çözdün. Güzel toparladın.", false, 2500);
    }

    const speechBubble = document.getElementById("speech-bubble");
    const phoneModal = document.getElementById("phone-modal");
    const actionHint = document.getElementById("action-hint");

    if (speechBubble) speechBubble.classList.add("hidden");
    if (phoneModal) phoneModal.classList.add("hidden");
    if (actionHint) actionHint.classList.add("hidden");

    stats.correct++;
    stats.shiftCorrect++;

    const baseXp = gameData.settings?.xp?.sale || 10;
    addXP(baseXp);

    const modeTime = getAdjustedModeTime();

    if (anxiety > modeTime * 0.65) {
        stats.fastSales++;
        addXP(gameData.settings?.xp?.fast_sale || 5);
    }

    if (anxiety < modeTime * 0.25) {
        stats.panicSales++;
    }

    updateWordLearningFromScenario(scenario, true);
    checkUnlocks();
    checkAchievements(scenario);

    if (itemId) {
        animateProductToCustomer(itemId, () => {
            finishSuccessfulSale(scenario, itemId);
        });
    } else {
        finishSuccessfulSale(scenario, null);
    }
}

function finishSuccessfulSale(scenario, itemId) {
    const playerBubble = document.getElementById("player-speech-bubble");
    const successOverlay = document.getElementById("success-overlay");
    const touristLayer = document.getElementById("tourist-layer");

    if (touristLayer) {
        touristLayer.src = `assets/tourist-${currentTouristNumber}-happy.png`;
    }

    if (playerBubble && scenario?.thanks) {
        playerBubble.innerText = scenario.thanks;
        playerBubble.classList.remove("hidden");
    }

    if (itemId) {
        playSaleAnimation();
    }

    if (successOverlay) {
        successOverlay.classList.remove("hidden");
    }

    completeCustomer();

    setTimeout(() => {
        if (successOverlay) successOverlay.classList.add("hidden");
        if (playerBubble) playerBubble.classList.add("hidden");

        saleInProgress = false;
        goNextOrReport();
    }, 2000);
}

function animateProductToCustomer(itemId, onDone) {
    const source = document.getElementById(`item-${itemId}`);
    const tourist = document.getElementById("tourist-layer");

    if (!source || !tourist) {
        if (typeof onDone === "function") onDone();
        return;
    }

    const sourceRect = source.getBoundingClientRect();
    const touristRect = tourist.getBoundingClientRect();

    const clone = source.cloneNode(true);
    clone.id = `flying-${itemId}-${Date.now()}`;
    clone.className = "flying-product";
    clone.style.left = `${sourceRect.left}px`;
    clone.style.top = `${sourceRect.top}px`;
    clone.style.width = `${sourceRect.width}px`;
    clone.style.height = "auto";
    clone.style.opacity = "1";
    clone.style.transform = "scale(1) rotate(0deg)";

    document.body.appendChild(clone);

    const targetX = touristRect.left + touristRect.width * 0.48 - sourceRect.width * 0.35;
    const targetY = touristRect.top + touristRect.height * 0.54 - sourceRect.height * 0.35;

    requestAnimationFrame(() => {
        clone.style.left = `${targetX}px`;
        clone.style.top = `${targetY}px`;
        clone.style.transform = "scale(0.55) rotate(-7deg)";
        clone.style.opacity = "0.92";
    });

    setTimeout(() => {
        clone.style.opacity = "0";
        clone.style.transform = "scale(0.25) rotate(-12deg)";
    }, 520);

    setTimeout(() => {
        clone.remove();

        if (typeof onDone === "function") {
            onDone();
        }
    }, 720);
}

function showMeaningfulFailure(clickedId) {
    clearInterval(timer);
    stopCurrentTouristAudio();

    const scenario = gameData.scenarios[currentScenarioIndex];

    updateWordLearningFromScenario(scenario, false);

    const speechBubble = document.getElementById("speech-bubble");
    const playerBubble = document.getElementById("player-speech-bubble");
    const phoneModal = document.getElementById("phone-modal");
    const actionHint = document.getElementById("action-hint");

    if (speechBubble) speechBubble.classList.add("hidden");
    if (playerBubble) playerBubble.classList.add("hidden");
    if (phoneModal) phoneModal.classList.add("hidden");
    if (actionHint) actionHint.classList.add("hidden");

    const targetName = getTargetDisplayName(scenario);
    const textEl = document.getElementById("feedback-text");

    if (!textEl) return;

    const caseFocus = scenario.case_focus;
    const caseData = caseFocus?.case_id ? gameData.cases?.[caseFocus.case_id] : null;
    const caseLine = caseData
        ? `<br><br><b>Padej Notu:</b> ${escapeHtml(caseData.name_ru)} [${escapeHtml(caseData.phonetic)}] = ${escapeHtml(caseData.tr)}<br>${escapeHtml(caseFocus.why_changed || "")}`
        : "";

    if (clickedId === "zaman_doldu") {
        textEl.innerHTML = `
            Turist beklemekten sıkıldı ve gitti.<br><br>
            <b>İstediği şey:</b> ${escapeHtml(targetName)}<br>
            <b>Kiril:</b> <i>${escapeHtml(scenario.phrase)}</i><br>
            <b>Okunuş:</b> <i>${escapeHtml(scenario.latin_hint || scenario.phonetics?.[0] || "")}</i><br>
            <b>Türkçesi:</b> ${escapeHtml(scenario.translation || "")}
            ${caseLine}
        `;
    } else if (clickedId === "yanlis_cevap") {
        textEl.innerHTML = `
            Yanlış cevap verdin.<br><br>
            <b>Doğrusu:</b> "${escapeHtml(scenario.translation || "")}" olmalıydı.
            ${caseLine}
        `;
    } else {
        const clickedName = itemNamesTR[clickedId] || clickedId;

        textEl.innerHTML = `
            Turist şunu söyledi:<br>
            <i>${escapeHtml(scenario.phrase)}</i><br>
            <b>Okunuş:</b> ${escapeHtml(scenario.latin_hint || scenario.phonetics?.[0] || "")}<br><br>
            Sen <b>${escapeHtml(clickedName)}</b> verdin.<br>
            Ancak <b>${escapeHtml(targetName)}</b> istiyordu.
            ${caseLine}
        `;
    }

    const feedbackModal = document.getElementById("feedback-modal");

    if (feedbackModal) feedbackModal.classList.remove("hidden");
}

function closeFeedbackAndFail() {
    const feedbackModal = document.getElementById("feedback-modal");
    const touristLayer = document.getElementById("tourist-layer");
    const failOverlay = document.getElementById("fail-overlay");

    if (feedbackModal) feedbackModal.classList.add("hidden");

    if (touristLayer) {
        touristLayer.src = `assets/tourist-${currentTouristNumber}-angry.png`;
    }

    if (failOverlay) failOverlay.classList.remove("hidden");

    lives--;
    stats.shiftWrong++;
    updateLivesUI();
    completeCustomer();

    setTimeout(() => {
        if (failOverlay) failOverlay.classList.add("hidden");

        if (lives <= 0) {
            const gameOver = document.getElementById("game-over-screen");

            if (gameOver) gameOver.classList.remove("hidden");
            return;
        }

        goNextOrReport();
    }, 2000);
}

function completeCustomer() {
    stats.customers++;

    const shiftLength = gameData.settings?.shift_length || 5;

    if (stats.customers > 0 && stats.customers % shiftLength === 0) {
        shiftReportPending = true;
    }

    updateHUD();
    persistProgress();
}

function goNextOrReport() {
    if (shiftReportPending) {
        shiftReportPending = false;
        showShiftReport();
    } else {
        loadLevel();
    }
}

function showShiftReport() {
    clearInterval(timer);
    stopCurrentTouristAudio();
    ensureReportStoryElement();

    const screen = document.getElementById("shift-report-screen");

    if (!screen) return;

    const customersEl = document.getElementById("report-customers");
    const correctEl = document.getElementById("report-correct");
    const xpEl = document.getElementById("report-xp");
    const caseCountEl = document.getElementById("report-case-count");
    const learnedEl = document.getElementById("report-learned-words");
    const weakEl = document.getElementById("report-weak-words");
    const caseNoteEl = document.getElementById("report-case-note");
    const storyEl = document.getElementById("report-story");

    const learnedList = Object.values(learnedWords);
    const weakScenarios = failedScenarioIds
        .map(id => gameData.scenarios.find(s => s.id === id))
        .filter(Boolean)
        .slice(0, 8);

    if (customersEl) customersEl.innerText = String(stats.customers);
    if (correctEl) correctEl.innerText = String(stats.correct);
    if (xpEl) xpEl.innerText = String(stats.xp);
    if (caseCountEl) caseCountEl.innerText = String(Object.keys(discoveredCases).length);

    if (learnedEl) {
        if (learnedList.length === 0) {
            learnedEl.innerHTML = "Henüz Sözlüğüm'e giren kelime yok.";
        } else {
            learnedEl.innerHTML = learnedList
                .slice(-10)
                .map(w => {
                    const level = getWordLearningLevel(w.key);
                    return `<span class="report-chip">${escapeHtml(w.latin)} = ${escapeHtml(w.tr)} · ${escapeHtml(level.label)}</span>`;
                })
                .join("");
        }
    }

    if (weakEl) {
        if (weakScenarios.length === 0) {
            weakEl.innerHTML = "Şu an tekrar bekleyen yanlış yok.";
        } else {
            weakEl.innerHTML = weakScenarios
                .map(s => `<span class="report-chip weak">${escapeHtml(s.latin_hint || s.translation || s.phrase)}</span>`)
                .join("");
        }
    }

    if (caseNoteEl) {
        const lastCase = stats.lastCaseId ? gameData.cases?.[stats.lastCaseId] : null;

        if (!lastCase) {
            caseNoteEl.innerHTML = "Henüz padej keşfi yok.";
        } else {
            caseNoteEl.innerHTML = `
                <b>${escapeHtml(lastCase.name_ru)}</b>
                [${escapeHtml(lastCase.phonetic)}] =
                ${escapeHtml(lastCase.tr)}<br>
                ${escapeHtml(lastCase.micro_situation || "")}
            `;
        }
    }

    if (storyEl) {
        storyEl.innerHTML = buildShiftNarrative();
    }

    showAchievement("Vardiya Karnesi Hazır");
    unlockAchievement("shift_survivor");

    screen.classList.remove("hidden");

    stats.shiftCorrect = 0;
    stats.shiftWrong = 0;
    stats.shiftXpStart = stats.xp;
    stats.shiftLearnedStart = Object.keys(learnedWords).length;
    stats.shiftCaseStart = Object.keys(discoveredCases).length;

    renderAllPhoneTabs();
    persistProgress();
}

function buildShiftNarrative() {
    const accuracy = stats.customers === 0 ? 0 : Math.round((stats.correct / stats.customers) * 100);
    const learnedCount = Object.keys(learnedWords).length;
    const caseCount = Object.keys(discoveredCases).length;
    const weakCount = failedScenarioIds.length;
    const fluentCount = stats.fluentPasses || 0;

    let tone = "Vardiya tamamlandı. Bugün kulağın biraz daha Rusçaya alıştı.";

    if (accuracy >= 80) {
        tone = "Çok iyi vardiya. Turistleri panikle değil, sesleri yakalayarak yönettin.";
    } else if (accuracy >= 50) {
        tone = "Orta karar bir vardiya. Temel akış oturuyor ama bazı sesler hâlâ tekrar istiyor.";
    } else {
        tone = "Zorlu vardiya. Bu kötü değil; yanlışların tekrar sistemine düştü ve öğrenme malzemesine dönüştü.";
    }

    return `
        <b>Vardiya yorumu:</b> ${escapeHtml(tone)}<br>
        <b>Öğrenme izi:</b> ${learnedCount} kelime Sözlüğüm'de, ${caseCount} padej keşfedildi.<br>
        <b>Akıcı satış:</b> ${fluentCount} hızlı kontrol başarıyla geçildi.<br>
        <b>Tekrar kuyruğu:</b> ${weakCount > 0 ? `${weakCount} sipariş tekrar gelecek.` : "Şimdilik bekleyen yanlış yok."}
    `;
}

function continueAfterShiftReport() {
    const screen = document.getElementById("shift-report-screen");

    if (screen) screen.classList.add("hidden");

    loadLevel();
}

function markScenarioWrong(scenario) {
    if (!scenario) return;

    if (!failedScenarioIds.includes(scenario.id)) {
        failedScenarioIds.push(scenario.id);
    }
}

function updateWordLearningFromScenario(scenario, wasCorrect) {
    if (!scenario) return;

    const keys = getLexiconKeysFromScenario(scenario);

    keys.forEach(key => {
        const entry = gameData.lexicon?.[key];

        if (!entry) return;

        if (!wordStats[key]) {
            wordStats[key] = {
                key,
                tr: entry.tr || "",
                latin: entry.latin || transliterateCyrillic(key),
                grammar: entry.grammar || "",
                note: entry.note || "",
                seen: 0,
                correct: 0,
                wrong: 0,
                streak: 0,
                bestStreak: 0,
                firstSeenAt: Date.now(),
                lastSeenAt: Date.now(),
                lastPhrase: "",
                lastTranslation: "",
                targetId: "",
                caseId: ""
            };
        }

        wordStats[key].seen++;
        wordStats[key].lastSeenAt = Date.now();
        wordStats[key].lastPhrase = scenario.phrase || "";
        wordStats[key].lastTranslation = scenario.translation || "";
        wordStats[key].targetId = scenario.target_id || "";
        wordStats[key].caseId = scenario.case_focus?.case_id || "";

        if (wasCorrect) {
            wordStats[key].correct++;
            wordStats[key].streak++;
            wordStats[key].bestStreak = Math.max(wordStats[key].bestStreak || 0, wordStats[key].streak || 0);
        } else {
            wordStats[key].wrong++;
            wordStats[key].streak = 0;
        }

        const level = getWordLearningLevel(key);
        const threshold = gameData.settings?.learned_word_streak || 3;

        if ((wordStats[key].streak >= threshold || level.id === "learned" || level.id === "reflex") && !learnedWords[key]) {
            learnedWords[key] = {
                key,
                tr: entry.tr || "",
                latin: entry.latin || transliterateCyrillic(key),
                grammar: entry.grammar || "",
                note: entry.note || "",
                learnedAt: Date.now()
            };

            addXP(gameData.settings?.xp?.learned_word || 12);
            showAchievement(`Tanıdık kelime: ${learnedWords[key].latin} = ${learnedWords[key].tr}`);
        }

        if (level.id === "reflex" && !wordStats[key].reflexNotified) {
            wordStats[key].reflexNotified = true;
            addXP(8);
            showAchievement(`Refleks kelime: ${wordStats[key].latin}`);
        }
    });

    renderAllPhoneTabs();
    persistProgress();
}

function getLexiconKeysFromScenario(scenario) {
    return tokenizePhrase(scenario.phrase)
        .map(normalizeLexiconKey)
        .filter(key => Boolean(gameData.lexicon?.[key]));
}

function discoverCaseFromScenario(scenario) {
    if (!scenario?.case_focus?.case_id) return;

    const caseId = scenario.case_focus.case_id;
    const caseData = gameData.cases?.[caseId];

    if (!caseData) return;

    stats.lastCaseId = caseId;

    if (!discoveredCases[caseId]) {
        discoveredCases[caseId] = {
            id: caseId,
            name_ru: caseData.name_ru,
            phonetic: caseData.phonetic,
            tr: caseData.tr,
            micro_situation: caseData.micro_situation,
            seen: 1,
            correct: 0,
            discoveredAt: Date.now(),
            lastSeenAt: Date.now()
        };

        const xp = scenario.case_focus.xp || gameData.settings?.xp?.case_discovery || 8;
        addXP(xp);
        showCasePopup(`${caseData.name_ru} [${caseData.phonetic}] = ${caseData.tr}`);
        unlockAchievement("case_hunter");
    } else {
        discoveredCases[caseId].seen = (discoveredCases[caseId].seen || 0) + 1;
        discoveredCases[caseId].lastSeenAt = Date.now();
    }

    renderAllPhoneTabs();
    persistProgress();
}

function renderCaseHuntPreview(showFull = false) {
    const panel = document.getElementById("case-hunt-panel");
    const content = document.getElementById("case-hunt-content");
    const scenario = gameData.scenarios?.[currentScenarioIndex];

    if (!panel || !content || !scenario?.case_focus) return;

    if (!isHearingConfirmed && !showFull) {
        panel.classList.add("hidden");
        return;
    }

    const focus = scenario.case_focus;
    const caseData = gameData.cases?.[focus.case_id];

    if (!caseData) {
        panel.classList.add("hidden");
        return;
    }

    panel.classList.remove("hidden");

    content.innerHTML = `
        <div class="case-card">
            <div class="case-name">${escapeHtml(caseData.name_ru)} [${escapeHtml(caseData.phonetic)}]</div>
            <b>Türkçe:</b> ${escapeHtml(caseData.tr)}<br>
            <b>Sahnede:</b> ${escapeHtml(focus.scene_link || "")}
            <div class="why-line">
                <b>Neden değişti?</b> ${escapeHtml(focus.before || "")} → ${escapeHtml(focus.after || "")}<br>
                ${escapeHtml(focus.why_changed || "")}
            </div>
        </div>
    `;
}

function renderCultureNote(showFull = false) {
    const panel = document.getElementById("culture-note-panel");
    const content = document.getElementById("culture-note-content");
    const scenario = gameData.scenarios?.[currentScenarioIndex];

    if (!panel || !content || !scenario?.culture_note) return;

    if (!isHearingConfirmed && !showFull) {
        panel.classList.add("hidden");
        return;
    }

    panel.classList.remove("hidden");
    content.innerHTML = `
        <div class="culture-card">
            ${escapeHtml(scenario.culture_note)}
        </div>
    `;
}

function renderMiniDictionary() {
    const output = document.getElementById("mini-dictionary-output");
    const scenario = gameData.scenarios?.[currentScenarioIndex];

    if (!output || !scenario) return;

    if (!isHearingConfirmed) {
        output.innerHTML = `
            <div class="phone-list-item">
                Mini sözlük, duyduğun okunuşu yeterince yazıp “Bunu mu demek istiyorsun?” ekranını onayladıktan sonra açılır.
                Başta ipucu vermez.
            </div>
        `;
        return;
    }

    const keys = getLexiconKeysFromScenario(scenario);

    if (keys.length === 0) {
        output.innerHTML = "Bu sipariş için mini sözlük daha sonra açılacak.";
        return;
    }

    output.innerHTML = keys.map(key => {
        const e = gameData.lexicon[key];
        const level = getWordLearningLevel(key);
        const stat = wordStats[key] || {};
        const caseLabel = e.case && gameData.cases?.[e.case]
            ? `<br><span class="muted">Padej: ${escapeHtml(gameData.cases[e.case].phonetic)} = ${escapeHtml(gameData.cases[e.case].tr)}</span>`
            : "";

        return `
            <div class="phone-list-item">
                <b>${escapeHtml(e.latin || transliterateCyrillic(key))}</b>
                <span class="muted">(${escapeHtml(key)})</span>
                = ${escapeHtml(e.tr || "")}<br>
                <span class="muted">${escapeHtml(e.grammar || "")}</span>
                ${caseLabel}<br>
                <span class="muted">
                    Durum: ${escapeHtml(level.label)} · Görülme: ${stat.seen || 0} · Seri: ${stat.streak || 0}
                </span>
            </div>
        `;
    }).join("");
}

function getWordLearningLevel(key) {
    const stat = wordStats[key] || {};
    const seen = stat.seen || 0;
    const correct = stat.correct || 0;
    const streak = stat.streak || 0;
    const bestStreak = stat.bestStreak || 0;
    const accuracy = seen > 0 ? correct / seen : 0;

    if (seen >= 6 && correct >= 5 && bestStreak >= 5 && accuracy >= 0.72) {
        return {
            id: "reflex",
            label: "Refleks",
            shortLabel: "Refleks",
            progress: 100
        };
    }

    if (learnedWords[key] || streak >= 3 || bestStreak >= 3) {
        return {
            id: "learned",
            label: "Öğrenildi",
            shortLabel: "Öğrenildi",
            progress: Math.max(72, getWordProgressPercent(key))
        };
    }

    if (seen >= 1) {
        return {
            id: "familiar",
            label: "Tanıdık",
            shortLabel: "Tanıdık",
            progress: getWordProgressPercent(key)
        };
    }

    return {
        id: "new",
        label: "Yeni",
        shortLabel: "Yeni",
        progress: 0
    };
}

function getWordProgressPercent(key) {
    const stat = wordStats[key] || {};
    const seen = stat.seen || 0;
    const correct = stat.correct || 0;
    const streak = stat.streak || 0;
    const bestStreak = stat.bestStreak || 0;

    const seenScore = Math.min(30, seen * 6);
    const correctScore = Math.min(35, correct * 7);
    const streakScore = Math.min(35, Math.max(streak, bestStreak) * 9);

    return Math.max(0, Math.min(100, seenScore + correctScore + streakScore));
}

function renderLearnedWords() {
    const learnedOutput = document.getElementById("learned-words-output");
    const caseOutput = document.getElementById("case-discovery-output");

    if (learnedOutput) {
        const cards = Object.keys(wordStats)
            .map(key => {
                const stat = wordStats[key];
                const entry = gameData.lexicon?.[key] || {};
                const level = getWordLearningLevel(key);

                return {
                    key,
                    stat,
                    entry,
                    level,
                    progress: getWordProgressPercent(key)
                };
            })
            .filter(card => card.stat.seen > 0)
            .sort((a, b) => {
                const order = { reflex: 0, learned: 1, familiar: 2, new: 3 };

                if (order[a.level.id] !== order[b.level.id]) {
                    return order[a.level.id] - order[b.level.id];
                }

                return (b.stat.lastSeenAt || 0) - (a.stat.lastSeenAt || 0);
            });

        if (cards.length === 0) {
            learnedOutput.innerHTML = "Henüz kelime kaydı yok. Kelimeler doğru tekrarlarla burada kart olarak birikecek.";
        } else {
            learnedOutput.innerHTML = cards.map(card => buildLearnedWordCard(card)).join("");
        }
    }

    if (caseOutput) {
        const cases = Object.values(discoveredCases)
            .sort((a, b) => (b.lastSeenAt || b.discoveredAt || 0) - (a.lastSeenAt || a.discoveredAt || 0));

        if (cases.length === 0) {
            caseOutput.innerHTML = "Henüz padej keşfi yok.";
        } else {
            caseOutput.innerHTML = cases.map(c => `
                <div class="case-learned-card">
                    <b>${escapeHtml(c.name_ru)}</b><br>
                    <span class="muted">Okunuş: ${escapeHtml(c.phonetic)}</span><br>
                    Türkçe: ${escapeHtml(c.tr)}<br>
                    ${escapeHtml(c.micro_situation || "")}<br>
                    <span class="muted">Görülme: ${c.seen || 1}</span>
                </div>
            `).join("");
        }
    }
}

function buildLearnedWordCard(card) {
    const stat = card.stat || {};
    const entry = card.entry || {};
    const level = card.level || getWordLearningLevel(card.key);
    const progress = Math.max(level.progress || 0, card.progress || 0);
    const badgeClass = level.id === "reflex" ? "reflex" : level.id === "learned" ? "learned" : "";
    const cardClass = level.id === "reflex" ? "reflex" : level.id === "learned" ? "learned" : "";

    const seen = stat.seen || 0;
    const correct = stat.correct || 0;
    const wrong = stat.wrong || 0;
    const streak = stat.streak || 0;
    const accuracy = seen > 0 ? Math.round((correct / seen) * 100) : 0;

    const caseText = stat.caseId && gameData.cases?.[stat.caseId]
        ? `Padej: ${gameData.cases[stat.caseId].phonetic} = ${gameData.cases[stat.caseId].tr}`
        : "";

    const lastPhrase = stat.lastPhrase
        ? `<div class="learned-example"><b>Son cümle:</b> ${escapeHtml(stat.lastPhrase)}<br>${escapeHtml(stat.lastTranslation || "")}</div>`
        : "";

    return `
        <div class="learned-card ${cardClass}">
            <div class="learned-head">
                <div>
                    <div class="learned-title">
                        ${escapeHtml(stat.latin || entry.latin || transliterateCyrillic(card.key))}
                        <span class="muted">(${escapeHtml(card.key)})</span>
                    </div>
                    <div class="learned-subtitle">
                        ${escapeHtml(stat.tr || entry.tr || "")}
                    </div>
                </div>
                <div class="learned-badge ${badgeClass}">
                    ${escapeHtml(level.shortLabel)}
                </div>
            </div>

            <div class="progress-track">
                <div class="progress-fill" style="width:${progress}%"></div>
            </div>

            <div class="learned-stats">
                <span class="learned-stat">Görülme: ${seen}</span>
                <span class="learned-stat">Doğru: ${correct}</span>
                <span class="learned-stat">Yanlış: ${wrong}</span>
                <span class="learned-stat">Seri: ${streak}</span>
                <span class="learned-stat">Başarı: ${accuracy}%</span>
            </div>

            ${caseText ? `<div class="learned-example">${escapeHtml(caseText)}</div>` : ""}
            ${lastPhrase}
        </div>
    `;
}

function renderAchievementsList() {
    const output = document.getElementById("achievement-list");

    if (!output) return;

    const all = getAllAchievements();

    if (all.length === 0) {
        output.innerHTML = "Başarım verisi yok.";
        return;
    }

    output.innerHTML = all.map(a => {
        const unlocked = earnedAchievementIds.includes(a.id);

        return `
            <div class="phone-list-item">
                <b>${unlocked ? "🏆" : "🔒"} ${escapeHtml(a.title)}</b><br>
                <span class="muted">${escapeHtml(a.description || "")}</span>
            </div>
        `;
    }).join("");
}

function renderAllPhoneTabs() {
    renderMiniDictionary();
    renderLearnedWords();
    renderAchievementsList();
}

function switchTab(tab) {
    currentTab = tab;

    const tabs = document.querySelectorAll(".phone-tab");
    tabs.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === tab);
    });

    const screens = {
        "terminal": document.getElementById("screen-terminal"),
        "mini-dictionary": document.getElementById("screen-mini-dictionary"),
        "notes": document.getElementById("screen-notes"),
        "learned": document.getElementById("screen-learned"),
        "achievements": document.getElementById("screen-achievements")
    };

    Object.entries(screens).forEach(([key, el]) => {
        if (el) el.classList.toggle("hidden", key !== tab);
    });

    renderAllPhoneTabs();

    if (tab === "notes") {
        loadSavedNotes();
    }
}

function togglePhone() {
    const modal = document.getElementById("phone-modal");

    if (!modal) return;

    modal.classList.toggle("hidden");

    if (!modal.classList.contains("hidden")) {
        switchTab(currentTab || "terminal");

        if (currentTab === "terminal") {
            const input = document.getElementById("phone-input");

            if (input) {
                setTimeout(() => input.focus(), 50);
            }
        }
    }
}

function openPhoneAndFocus() {
    const modal = document.getElementById("phone-modal");

    if (modal) modal.classList.remove("hidden");

    switchTab("terminal");

    const input = document.getElementById("phone-input");

    if (input) {
        setTimeout(() => input.focus(), 60);
    }
}

function saveNotes() {
    const input = document.getElementById("notes-input");
    const status = document.getElementById("notes-status");

    if (!input) return;

    localStorage.setItem(STORAGE_KEYS.notes, input.value);

    if (status) {
        status.innerText = "Notlar kaydedildi.";

        setTimeout(() => {
            status.innerText = "Notlar tarayıcıda saklanır.";
        }, 1600);
    }
}

function loadSavedNotes() {
    const input = document.getElementById("notes-input");

    if (!input) return;

    input.value = localStorage.getItem(STORAGE_KEYS.notes) || "";
}

function playTouristAudioForScenario(scenario) {
    if (!scenario || !scenario.id) return;

    stopCurrentTouristAudio();

    const audioPath = `assets/audio/${scenario.id}.mp3`;

    currentAudio = new Audio(audioPath);
    currentAudio.preload = "auto";
    currentAudio.volume = currentTouristTrait?.audioVolume ?? 1;
    currentAudio.muted = isMuted;

    currentAudio.onerror = () => {
        console.warn(`Ses dosyası bulunamadı veya çalınamadı: ${audioPath}`);

        if (!isMuted) {
            speakWithBrowserVoice(scenario.phrase);
        }
    };

    if (isMuted) return;

    currentAudio.play().catch(error => {
        console.warn("Turist sesi otomatik çalınamadı:", error);
        showActionHint("Tarayıcı otomatik sesi engelledi. Tekrar Dinle'ye basınca ses gelir.", true, 2400);
    });
}

function stopCurrentTouristAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }

    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

function speakWithBrowserVoice(text) {
    if (!text || isMuted) return;

    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ru-RU";
    utterance.rate = currentTouristTrait?.speechRate ?? 0.85;
    utterance.pitch = 1;
    utterance.volume = currentTouristTrait?.audioVolume ?? 1;

    window.speechSynthesis.speak(utterance);
}

function replayAudio() {
    const scenario = gameData.scenarios?.[currentScenarioIndex];

    if (!scenario) return;

    const maxReplays = getAdjustedMaxReplays();

    if (replaysThisCustomer >= maxReplays) {
        showActionHint("Bu müşteri için tekrar dinleme hakkın doldu.", true, 1800);
        return;
    }

    replaysThisCustomer++;
    stats.replays++;

    playTouristAudioForScenario(scenario);
    updateHUD();
}

function startTimer() {
    clearInterval(timer);

    const barContainer = document.getElementById("anxiety-bar-container");
    if (barContainer) barContainer.style.display = "block";

    timer = setInterval(() => {
        anxiety -= getModeConfig().timer_step || 0.3;

        updateBarUI();

        if (anxiety <= 0) {
            clearInterval(timer);

            const scenario = gameData.scenarios[currentScenarioIndex];

            markScenarioWrong(scenario);
            showMeaningfulFailure("zaman_doldu");
        }
    }, 100);
}

function updateBarUI() {
    const bar = document.getElementById("anxiety-bar");

    if (!bar) return;

    const modeTime = getAdjustedModeTime();
    const safeAnxiety = Math.max(0, Math.min(modeTime, anxiety));
    const pct = (safeAnxiety / modeTime) * 100;

    bar.style.width = `${pct}%`;
}

function updateShelfLockState(unlocked) {
    document.querySelectorAll(".item-png").forEach(el => {
        if (unlocked || !isTerminalRequired()) {
            el.classList.remove("item-locked");
        } else {
            el.classList.add("item-locked");
        }
    });
}

function showFinalHintAndGlow() {
    const scenario = gameData.scenarios[currentScenarioIndex];

    if (!scenario) return;

    document.querySelectorAll(".item-png").forEach(el => el.classList.remove("item-glow"));

    if (scenario.target_id === "random") {
        const possibleItems = unlockedItems.length > 0 ? unlockedItems : gameData.items.map(i => i.id);

        currentRandomTarget = possibleItems[Math.floor(Math.random() * possibleItems.length)];

        const itemName = itemNamesTR[currentRandomTarget] || currentRandomTarget;

        showActionHint(`Quiz doğru. Turist parmağıyla [ ${itemName} ] işaret ediyor.`, false, 4200);

        const el = document.getElementById(`item-${currentRandomTarget}`);

        if (el) el.classList.add("item-glow");

        return;
    }

    if (scenario.target_id === "drink") {
        showActionHint("Quiz doğru. İçecek istiyor: Su, Çay, Kahve veya Enerji İçeceği verebilirsin.", false, 4200);

        drinkTargets.forEach(id => {
            const el = document.getElementById(`item-${id}`);

            if (el && unlockedItems.includes(id)) {
                el.classList.add("item-glow");
            }
        });

        return;
    }

    showActionHint("Quiz doğru. Raflar açıldı; doğru ürünü seç.", false, 3200);
}

function getPhraseMatchScore(rawInput, scenario) {
    const inputWords = normalizeSearchText(rawInput).split(/\s+/).filter(Boolean);
    const expectedWords = getExpectedLatinWords(scenario);

    if (inputWords.length === 0 || expectedWords.length === 0) return 0;

    let matchedExpected = 0;
    let matchedInput = 0;
    const usedExpected = new Set();

    inputWords.forEach(inputWord => {
        let bestIndex = -1;
        let bestScore = 0;

        expectedWords.forEach((expectedWord, index) => {
            if (usedExpected.has(index)) return;

            const similarity = getWordSimilarity(inputWord, expectedWord);

            if (similarity > bestScore) {
                bestScore = similarity;
                bestIndex = index;
            }
        });

        if (bestScore >= 0.58 && bestIndex !== -1) {
            usedExpected.add(bestIndex);
            matchedExpected++;
            matchedInput++;
        }
    });

    const expectedCoverage = matchedExpected / expectedWords.length;
    const inputCoverage = matchedInput / inputWords.length;

    let productBonus = 0;

    if (currentTargetMatchesInput(rawInput, scenario)) {
        productBonus = 0.12;
    }

    return Math.min(1, (expectedCoverage * 0.58) + (inputCoverage * 0.35) + productBonus);
}

function getExpectedLatinWords(scenario) {
    const source = scenario.latin_hint || scenario.phonetics?.[0] || transliterateCyrillic(scenario.phrase);
    return normalizeSearchText(source).split(/\s+/).filter(Boolean);
}

function getWordSimilarity(a, b) {
    if (!a || !b) return 0;

    if (a === b) return 1;

    if (a.includes(b) || b.includes(a)) {
        return Math.min(a.length, b.length) / Math.max(a.length, b.length);
    }

    const variants = commonHearingVariants[b] || [];
    if (variants.map(normalizeSearchText).includes(a)) return 0.92;

    const distance = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);

    return 1 - (distance / maxLen);
}

function levenshtein(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => []);

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;

            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    return matrix[a.length][b.length];
}

function currentTargetMatchesInput(rawInput, scenario) {
    const normalizedInput = normalizeSearchText(rawInput);
    const targetId = scenario.target_id;

    const keywords = targetKeywords[targetId] || [];

    if (keywords.some(k => normalizedInput.includes(normalizeSearchText(k)))) {
        return true;
    }

    if (targetId === "drink") {
        return drinkTargets.some(id => {
            const drinkWords = targetKeywords[id] || [];
            return drinkWords.some(k => normalizedInput.includes(normalizeSearchText(k)));
        });
    }

    if (targetId === "random") {
        return (targetKeywords.random || []).some(k => normalizedInput.includes(normalizeSearchText(k)));
    }

    return false;
}

function normalizeSearchText(text) {
    if (!text) return "";

    let lowered = String(text).toLowerCase();
    let transliterated = "";

    for (const char of lowered) {
        transliterated += cyrillicMap[char] !== undefined ? cyrillicMap[char] : char;
    }

    return transliterated
        .replace(/ç/g, "c")
        .replace(/ğ/g, "g")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ş/g, "s")
        .replace(/ü/g, "u")
        .replace(/ё/g, "yo")
        .replace(/[^a-z0-9\s-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function transliterateCyrillic(text) {
    if (!text) return "";

    let out = "";

    for (const char of String(text).toLowerCase()) {
        out += cyrillicMap[char] !== undefined ? cyrillicMap[char] : char;
    }

    return out;
}

function tokenizePhrase(phrase) {
    return phrase
        .replace(/[.,!?;:]/g, " ")
        .split(/\s+/)
        .map(w => w.trim())
        .filter(Boolean);
}

function normalizeLexiconKey(word) {
    return word
        .toLowerCase()
        .replace(/[.,!?;:]/g, "")
        .trim();
}

function getTargetDisplayName(scenario) {
    if (!scenario) return "";

    if (scenario.target_id === "drink") {
        return "İçecek: Su / Çay / Kahve / Enerji İçeceği";
    }

    if (scenario.target_id === "random") {
        return currentRandomTarget
            ? `${itemNamesTR[currentRandomTarget] || currentRandomTarget} (işaret edilen ürün)`
            : "İşaret edilen ürün";
    }

    return itemNamesTR[scenario.target_id] || scenario.target_id;
}

function playSaleAnimation() {
    const money = document.getElementById("money-layer");
    const openRegister = document.getElementById("open-register-layer");

    if (openRegister) openRegister.classList.remove("hidden");

    playCashSound();

    if (money) {
        money.classList.remove("hidden");

        void money.offsetWidth;

        money.classList.add("money-active");

        setTimeout(() => {
            money.classList.remove("money-active");

            if (openRegister) openRegister.classList.add("hidden");

            setTimeout(() => {
                money.classList.add("hidden");
            }, 300);
        }, 600);
    }
}

function playCashSound() {
    if (isMuted) return;

    ensureCashSoundElement();

    const cashSound = document.getElementById("cash-sound");

    if (cashSound) {
        cashSound.volume = 0.35;
        cashSound.muted = false;
        cashSound.currentTime = 0;

        cashSound.play().catch(() => {
            const fallback = new Audio("assets/audio/cash-register-sound.mp3");
            fallback.volume = 0.35;
            fallback.play().catch(() => {});
        });

        return;
    }

    const fallback = new Audio("assets/audio/cash-register-sound.mp3");
    fallback.volume = 0.35;
    fallback.play().catch(() => {});
}

function checkUnlocks() {
    let currentTierItems = tierThresholds[0].items;

    for (const tier of tierThresholds) {
        if (stats.correct >= tier.score) {
            currentTierItems = tier.items;
        }
    }

    if (unlockedItems.length !== currentTierItems.length) {
        unlockedItems = currentTierItems.slice();
        renderItems();

        if (stats.correct > 0) {
            showAchievement("Dükkan Büyüyor! Yeni Ürünler Geldi.");
        }
    }
}

function checkAchievements(scenario = null) {
    if (stats.correct >= 1) unlockAchievement("first_sale");
    if (stats.analyses >= 5) unlockAchievement("terminal_user");
    if (stats.correct >= 10) unlockAchievement("beyoglu_esnaf");
    if (Object.keys(discoveredCases).length >= 1) unlockAchievement("case_hunter");
    if (Object.keys(discoveredCases).length >= 3) unlockAchievement("case_master_3");
    if (Object.keys(learnedWords).length >= 5) unlockAchievement("learned_5");
    if ((stats.fluentPasses || 0) >= 3) unlockAchievement("fluent_seller");

    const hasVoda = Object.values(learnedWords).some(w => {
        return ["voda", "vodu", "vodi", "vodı"].includes(normalizeSearchText(w.latin));
    });

    if (hasVoda) unlockAchievement("voda_reflex");

    if (scenario?.target_id === "cay") unlockAchievement("tea_time");

    const modeTime = getAdjustedModeTime();

    if (anxiety < modeTime * 0.25 && scenario) {
        unlockAchievement("no_panic");
    }

    renderAchievementsList();
}

function unlockAchievement(id) {
    if (!id || earnedAchievementIds.includes(id)) return;

    earnedAchievementIds.push(id);

    const ach = getAchievementById(id);
    const title = ach?.title || id;

    sessionAchievements.push(title);
    showAchievement(title);
    persistProgress();
}

function showAchievement(text) {
    const popup = document.getElementById("achievement-popup");
    const achievementText = document.getElementById("achievement-text");

    if (!popup || !achievementText) return;

    achievementText.innerText = text;
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 4000);
}

function showCasePopup(text) {
    const popup = document.getElementById("case-popup");
    const caseText = document.getElementById("case-popup-text");

    if (!popup || !caseText) return;

    caseText.innerText = text;
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 4300);
}

function addXP(amount) {
    stats.xp += Number(amount) || 0;
    updateHUD();
}

function updateHUD() {
    const modeBadge = document.getElementById("mode-badge");
    const xpContainer = document.getElementById("xp-container");
    const caseHud = document.getElementById("case-hunt-hud");

    const modeLabel = getModeConfig().label || currentMode;
    const traitLabel = currentTouristTrait?.label ? ` | ${currentTouristTrait.label}` : "";
    const replayInfo = currentTouristTrait ? ` | Tekrar ${replaysThisCustomer}/${getAdjustedMaxReplays()}` : "";

    if (modeBadge) modeBadge.innerText = `MOD: ${modeLabel}${traitLabel}${replayInfo}`;
    if (xpContainer) xpContainer.innerText = `XP: ${stats.xp || 0}`;
    if (caseHud) caseHud.innerText = `Padej Avı: ${Object.keys(discoveredCases).length}`;
}

function updateLivesUI() {
    const livesContainer = document.getElementById("lives-container");

    if (!livesContainer) return;

    let heartsHTML = "";

    for (let i = 0; i < lives; i++) heartsHTML += "❤️";
    for (let i = 0; i < (3 - lives); i++) heartsHTML += "🖤";

    livesContainer.innerHTML = heartsHTML;
}

function restartGame() {
    stopCurrentTouristAudio();

    lives = 3;
    stats = createFreshStats();
    failedScenarioIds = [];
    unlockedItems = tierThresholds[0].items.slice();
    resetScenarioState();
    shiftReportPending = false;

    updateLivesUI();
    updateHUD();

    const gameOver = document.getElementById("game-over-screen");

    if (gameOver) gameOver.classList.add("hidden");

    renderItems();
    loadLevel();
}

function returnToMenu() {
    clearInterval(timer);
    stopCurrentTouristAudio();

    const bgm = document.getElementById("bg-music");

    if (bgm) {
        bgm.pause();
        bgm.currentTime = 0;
    }

    const phoneModal = document.getElementById("phone-modal");
    const actionHint = document.getElementById("action-hint");
    const speechBubble = document.getElementById("speech-bubble");
    const playerBubble = document.getElementById("player-speech-bubble");
    const startScreen = document.getElementById("start-screen");
    const nightOverlay = document.getElementById("night-overlay");
    const shiftReport = document.getElementById("shift-report-screen");

    if (phoneModal) phoneModal.classList.add("hidden");
    if (actionHint) actionHint.classList.add("hidden");
    if (speechBubble) speechBubble.classList.add("hidden");
    if (playerBubble) playerBubble.classList.add("hidden");
    if (startScreen) startScreen.classList.remove("hidden");
    if (nightOverlay) nightOverlay.classList.add("hidden");
    if (shiftReport) shiftReport.classList.add("hidden");

    document.body.classList.remove("night-mode");

    document.querySelectorAll(".item-png").forEach(el => {
        el.classList.remove("item-glow");
        el.classList.add("item-locked");
    });
}

function toggleMute() {
    isMuted = !isMuted;

    const bgm = document.getElementById("bg-music");
    const cashSound = document.getElementById("cash-sound");
    const iconOn = document.getElementById("icon-sound-on");
    const iconOff = document.getElementById("icon-sound-off");

    if (bgm) bgm.muted = isMuted;
    if (cashSound) cashSound.muted = isMuted;
    if (currentAudio) currentAudio.muted = isMuted;

    if (iconOn) iconOn.classList.toggle("hidden", isMuted);
    if (iconOff) iconOff.classList.toggle("hidden", !isMuted);

    if (isMuted && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

function showActionHint(text, isWarning = false, duration = 2200) {
    const hint = document.getElementById("action-hint");

    if (!hint) return;

    hint.innerText = text;
    hint.classList.remove("hidden");

    if (isWarning) {
        hint.classList.add("lock-warning");
    } else {
        hint.classList.remove("lock-warning");
    }

    if (duration > 0) {
        clearTimeout(hint._hideTimer);

        hint._hideTimer = setTimeout(() => {
            hint.classList.add("hidden");
            hint.classList.remove("lock-warning");
        }, duration);
    }
}

function persistProgress() {
    localStorage.setItem(STORAGE_KEYS.learnedWords, JSON.stringify(learnedWords));
    localStorage.setItem(STORAGE_KEYS.wordStats, JSON.stringify(wordStats));
    localStorage.setItem(STORAGE_KEYS.discoveredCases, JSON.stringify(discoveredCases));
    localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(earnedAchievementIds));
}

function loadPersistentProgress() {
    learnedWords = readJSONFromStorage(STORAGE_KEYS.learnedWords, {});
    wordStats = readJSONFromStorage(STORAGE_KEYS.wordStats, {});
    discoveredCases = readJSONFromStorage(STORAGE_KEYS.discoveredCases, {});
    earnedAchievementIds = readJSONFromStorage(STORAGE_KEYS.achievements, []);
}

function readJSONFromStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function shuffleArray(array) {
    return array
        .filter(Boolean)
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(item => item.value);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function escapeAttribute(value) {
    return escapeHtml(value)
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

setupTerminalInput();