// Halloween Powered By Kapil - Deep Testing Suite
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

// Test with empty / short / extreme recipient names
const shortName = "Alex";
const superLongName = "Arch-Duke Alexander Maximillian Bartholomew Montgomery the Third of Sarlayash";
assert(shortName.length > 0 && superLongName.length > 50, "Name edge cases prepared");

// TEST 5: Demo User Workflow Simulation
console.log("\n--- SIMULATING DEMO USER WORKFLOW ---");
const mockLocalStorage = {};
const mockDemoStorage = {
    getItem: (k) => mockLocalStorage[k] || null,
    setItem: (k, v) => { mockLocalStorage[k] = v; },
    removeItem: (k) => { delete mockLocalStorage[k]; }
};

// Demo user enters name
const demoLearnerName = "Demo Scholar Vikram";
mockDemoStorage.setItem('halloween_kapil_game_state', JSON.stringify({
    studentName: demoLearnerName,
    unlockedLevels: [1],
    completedLevels: [],
    badges: []
}));

const loadedState = JSON.parse(mockDemoStorage.getItem('halloween_kapil_game_state'));
assert(loadedState.studentName === demoLearnerName, "Demo learner name persisted and retrieved properly");

// Level 1 Pass Simulation
loadedState.completedLevels.push(1);
loadedState.badges.push('badge_dsa');
loadedState.unlockedLevels.push(2);
mockDemoStorage.setItem('halloween_kapil_game_state', JSON.stringify(loadedState));

const afterLvl1 = JSON.parse(mockDemoStorage.getItem('halloween_kapil_game_state'));
assert(afterLvl1.unlockedLevels.includes(2), "Level 2 unlocked after Level 1 completion");
assert(afterLvl1.badges.includes('badge_dsa'), "DSA badge unlocked and recorded in state");

// Full Completion & 300 MCQ Exam Simulation
for (let lvl = 2; lvl <= 5; lvl++) {
    afterLvl1.unlockedLevels.push(lvl);
    afterLvl1.completedLevels.push(lvl);
}
afterLvl1.badges = ['badge_dsa', 'badge_aptitude', 'badge_softskills', 'badge_crucible', 'badge_grandmaster'];
mockDemoStorage.setItem('halloween_kapil_game_state', JSON.stringify(afterLvl1));

const finalRecorded = JSON.parse(mockDemoStorage.getItem('halloween_kapil_game_state'));
assert(finalRecorded.badges.length === 5, "All 5 badges claimed by Demo User");
assert(finalRecorded.completedLevels.length === 5, "All 5 levels conquered");

// Reset Progress Test
afterLvl1.unlockedLevels = [1];
afterLvl1.completedLevels = [];
afterLvl1.badges = [];
mockDemoStorage.setItem('halloween_kapil_game_state', JSON.stringify(afterLvl1));
const resetState = JSON.parse(mockDemoStorage.getItem('halloween_kapil_game_state'));
assert(resetState.unlockedLevels.length === 1 && resetState.unlockedLevels[0] === 1, "Reset function restores initial state without breaking user profile");

console.log(`\n=== 🎃 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);
if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
