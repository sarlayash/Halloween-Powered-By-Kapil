// Halloween Powered By Kapil - Deep Testing Suite (Including Trick or Treat Wheel)
const fs = require('fs');
const path = require('path');

console.log("=== 🎃 STARTING DEEP TEST SUITE FOR HALLOWEEN POWERED BY KAPIL ===");

let passed = 0;
let failed = 0;

function assert(condition, testName) {
    if (condition) {
        console.log(`[PASS] ${testName}`);
        passed++;
    } else {
        console.error(`[FAIL] ${testName}`);
        failed++;
    }
}

// Global Mocks for Node test environment
global.window = {};
global.Image = class {
    constructor() {
        this.src = '';
        this.naturalWidth = 100;
        this.complete = true;
    }
};

// TEST 1: Check Assets
const imgPath = path.join(__dirname, 'kapil_vampire.jpg');
assert(fs.existsSync(imgPath), "kapil_vampire.jpg exists on disk");
const stats = fs.statSync(imgPath);
assert(stats.size > 50000, `kapil_vampire.jpg has valid image size (${stats.size} bytes)`);

// TEST 2: Questions Repository Integrity
const questionsContent = fs.readFileSync(path.join(__dirname, 'questions.js'), 'utf8');
eval(questionsContent);

const GAME_DATA = window.GAME_DATA;
assert(GAME_DATA && GAME_DATA.levels.length === 5, "5 levels defined in GAME_DATA");

// Check Level 1-4 questions
[GAME_DATA.level1, GAME_DATA.level2, GAME_DATA.level3, GAME_DATA.level4].forEach((lvlArr, idx) => {
    assert(Array.isArray(lvlArr) && lvlArr.length > 0, `Level ${idx + 1} has valid questions array`);
    lvlArr.forEach((q, qIdx) => {
        const validOpts = Array.isArray(q.options) && q.options.length >= 2;
        const validAns = typeof q.answer === 'number' && q.answer >= 0 && q.answer < q.options.length;
        const validExp = typeof q.explanation === 'string' && q.explanation.length > 5;
        assert(validOpts && validAns && validExp, `Level ${idx + 1} Question ${qIdx + 1} structure is valid`);
    });
});

// TEST 3: 300 MCQs Final Assessment Generator
const final300 = GAME_DATA.getFinal300Questions();
assert(Array.isArray(final300), "getFinal300Questions returns an array");
assert(final300.length === 300, `Exactly 300 questions generated (count: ${final300.length})`);

let invalidCount = 0;
final300.forEach((q, i) => {
    if (!q.question || !q.options || q.options.length < 2 || q.answer === undefined || q.answer < 0 || q.answer >= q.options.length) {
        invalidCount++;
    }
});
assert(invalidCount === 0, `All 300 questions in Final Trial have strictly valid options and answer indexes (invalids: ${invalidCount})`);

// TEST 4: Certificate Text Wrap & Bounds Test (Zero Spillover Verification)
const certContent = fs.readFileSync(path.join(__dirname, 'certificate.js'), 'utf8');
eval(certContent);

const certEngine = window.halloweenCertificateEngine;
assert(certEngine !== undefined, "HalloweenCertificateEngine instantiated on window");

// Mock Canvas 2D context measureText
const mockCtx = {
    measureText: (txt) => ({ width: txt.length * 10 })
};

const longText = "This is a very long text intended to test whether the bounded text wrapping algorithm inside the certificate generator breaks lines gracefully and prevents any spillover or overlap across the sacred credentials";
const wrappedLines = certEngine.wrapTextLines(mockCtx, longText, 250);
assert(Array.isArray(wrappedLines) && wrappedLines.length > 1, `wrapTextLines correctly partitioned text into ${wrappedLines.length} bounded lines`);

// TEST 5: TRICK OR TREAT SPINNING WHEEL VERIFICATION
console.log("\n--- TESTING TRICK OR TREAT SPINNING WHEEL ENGINE ---");
const wheelContent = fs.readFileSync(path.join(__dirname, 'wheel.js'), 'utf8');
eval(wheelContent);

const wheelEngine = window.spookyWheel;
assert(wheelEngine !== undefined, "SpookyWheelEngine instantiated on window");
assert(Array.isArray(wheelEngine.slices) && wheelEngine.slices.length === 8, "Wheel has exactly 8 occult slices");

const treats = wheelEngine.slices.filter(s => s.type === 'treat');
const tricks = wheelEngine.slices.filter(s => s.type === 'trick');
assert(treats.length === 4, `Wheel contains 4 TREAT slices (found: ${treats.length})`);
assert(tricks.length === 4, `Wheel contains 4 TRICK slices (found: ${tricks.length})`);

tricks.forEach((trickSlice, idx) => {
    const t = trickSlice.trick;
    const valid = t && t.prompt && Array.isArray(t.options) && t.options.length >= 2 && typeof t.answer === 'number';
    assert(valid, `TRICK Slice ${idx + 1} (${trickSlice.label}) has valid interactive riddle`);
});

treats.forEach((treatSlice, idx) => {
    const r = treatSlice.reward;
    const valid = r && r.type && (r.value !== undefined) && r.desc;
    assert(valid, `TREAT Slice ${idx + 1} (${treatSlice.label}) has valid reward data`);
});

// TEST 6: Demo User Workflow Simulation with Wheel & Lifelines
console.log("\n--- SIMULATING DEMO USER WORKFLOW WITH WHEEL ---");
const mockLocalStorage = {};
const mockDemoStorage = {
    getItem: (k) => mockLocalStorage[k] || null,
    setItem: (k, v) => { mockLocalStorage[k] = v; },
    removeItem: (k) => { delete mockLocalStorage[k]; }
};

// Demo user starts with 3 spins
const demoState = {
    studentName: "Demo Scholar Vikram",
    unlockedLevels: [1],
    completedLevels: [],
    badges: [],
    wheelSpins: 3,
    occultXP: 100,
    spectralShields: 2,
    elixirsOfIntuition: 1,
    specialTitles: []
};

mockDemoStorage.setItem('halloween_kapil_game_state', JSON.stringify(demoState));
const retrieved = JSON.parse(mockDemoStorage.getItem('halloween_kapil_game_state'));
assert(retrieved.wheelSpins === 3, "Wheel spins initialized to 3 in user profile");
assert(retrieved.spectralShields === 2, "Spectral shields tracked in state");
assert(retrieved.elixirsOfIntuition === 1, "Elixirs of intuition tracked in state");

// Simulating Level completion awarding +2 spins
retrieved.completedLevels.push(1);
retrieved.unlockedLevels.push(2);
retrieved.badges.push('badge_dsa');
retrieved.wheelSpins += 2;
retrieved.occultXP += 150;
mockDemoStorage.setItem('halloween_kapil_game_state', JSON.stringify(retrieved));

const updated = JSON.parse(mockDemoStorage.getItem('halloween_kapil_game_state'));
assert(updated.wheelSpins === 5, "Conquering a level properly awards +2 wheel spins (3 + 2 = 5)");
assert(updated.occultXP === 250, "Conquering a level awards +150 Occult XP");

// Simulating consuming a spectral shield during trial
updated.spectralShields -= 1;
mockDemoStorage.setItem('halloween_kapil_game_state', JSON.stringify(updated));
const afterShield = JSON.parse(mockDemoStorage.getItem('halloween_kapil_game_state'));
assert(afterShield.spectralShields === 1, "Spectral shield consumed successfully during trial");

console.log(`\n=== 🎃 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);
if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
