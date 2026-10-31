// Halloween Powered By Kapil - Main Game Logic Engine
// Sarlayash Productions
// Deep Tested & Hardened with Founder Integration, Badges, Trick or Treat Wheel, and Lifelines

class HalloweenGameController {
    constructor() {
        this.state = {
            currentLevelId: 1,
            unlockedLevels: [1],
            completedLevels: [],
            badges: [],
            studentName: "",
            wheelSpins: 3,
            occultXP: 0,
            spectralShields: 0,
            elixirsOfIntuition: 0,
            specialTitles: [],
            finalAssessment: {
                active: false,
                questions: [],
                currentIndex: 0,
                userAnswers: {},
                markedForReview: new Set(),
                timeRemainingSeconds: 3600, // 1 Hour for 300 MCQs
                timerInterval: null,
                score: 0,
                submitted: false
            },
            currentLevelTrial: {
                active: false,
                levelId: 1,
                questions: [],
                currentIndex: 0,
                score: 0,
                selectedOption: null,
                isAnswered: false
            }
        };

        this.initStorage();
        this.initCanvasAnimation();
        this.bindEvents();
        this.checkOnboarding();
        this.renderLevelsGrid();
        this.renderBadgesVault();
        this.updateCertificatePreview();
    }

    initStorage() {
        try {
            const saved = localStorage.getItem('halloween_kapil_game_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed.unlockedLevels) && parsed.unlockedLevels.length > 0) {
                    this.state.unlockedLevels = parsed.unlockedLevels;
                }
                if (Array.isArray(parsed.completedLevels)) {
                    this.state.completedLevels = parsed.completedLevels;
                }
                if (Array.isArray(parsed.badges)) {
                    this.state.badges = parsed.badges;
                }
                if (parsed.studentName && typeof parsed.studentName === 'string') {
                    this.state.studentName = parsed.studentName.trim();
                }
                if (typeof parsed.wheelSpins === 'number') this.state.wheelSpins = parsed.wheelSpins;
                if (typeof parsed.occultXP === 'number') this.state.occultXP = parsed.occultXP;
                if (typeof parsed.spectralShields === 'number') this.state.spectralShields = parsed.spectralShields;
                if (typeof parsed.elixirsOfIntuition === 'number') this.state.elixirsOfIntuition = parsed.elixirsOfIntuition;
                if (Array.isArray(parsed.specialTitles)) this.state.specialTitles = parsed.specialTitles;
            }
        } catch (e) {
            console.warn("Could not load saved state", e);
        }
    }

    saveState() {
        try {
            localStorage.setItem('halloween_kapil_game_state', JSON.stringify({
                unlockedLevels: this.state.unlockedLevels,
                completedLevels: this.state.completedLevels,
                badges: this.state.badges,
                studentName: this.state.studentName,
                wheelSpins: this.state.wheelSpins,
                occultXP: this.state.occultXP,
                spectralShields: this.state.spectralShields,
                elixirsOfIntuition: this.state.elixirsOfIntuition,
                specialTitles: this.state.specialTitles
            }));
        } catch (e) {
            console.warn("Could not persist state", e);
        }
    }

    checkOnboarding() {
        const modal = document.getElementById('onboarding-modal');
        const userDisplay = document.getElementById('current-user-name');
        const certInput = document.getElementById('cert-student-name');

        if (!this.state.studentName || this.state.studentName.trim() === '') {
            if (modal) modal.style.display = 'flex';
        } else {
            if (modal) modal.style.display = 'none';
            if (userDisplay) userDisplay.textContent = this.state.studentName;
            if (certInput) certInput.value = this.state.studentName;
        }
    }

    /* -------------------------------------------------------------
       Atmospheric Canvas Animation (Flying Bats & Spectral Wisps)
    -------------------------------------------------------------- */
    initCanvasAnimation() {
        const canvas = document.getElementById('spooky-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const bats = Array.from({ length: 12 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.6,
            speedX: 1.5 + Math.random() * 2.5,
            speedY: (Math.random() - 0.5) * 1.2,
            wingPhase: Math.random() * Math.PI,
            size: 14 + Math.random() * 12
        }));

        const orbs = Array.from({ length: 25 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 1 + Math.random() * 3,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -0.3 - Math.random() * 0.6,
            alpha: 0.2 + Math.random() * 0.5,
            color: Math.random() > 0.5 ? '#f97316' : '#9333ea'
        }));

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            orbs.forEach(orb => {
                orb.x += orb.vx;
                orb.y += orb.vy;
                if (orb.y < -10) orb.y = canvas.height + 10;
                if (orb.x < -10) orb.x = canvas.width + 10;
                if (orb.x > canvas.width + 10) orb.x = -10;

                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
                ctx.fillStyle = orb.color;
                ctx.globalAlpha = orb.alpha;
                ctx.fill();
            });

            bats.forEach(b => {
                b.x += b.speedX;
                b.speedY = Math.sin(b.x * 0.02) * 0.8;
                b.y += b.speedY;
                b.wingPhase += 0.2;

                if (b.x > canvas.width + 50) {
                    b.x = -50;
                    b.y = Math.random() * canvas.height * 0.6;
                }

                ctx.save();
                ctx.translate(b.x, b.y);
                ctx.fillStyle = '#0f051d';
                ctx.strokeStyle = '#38164f';
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.8;

                const flap = Math.sin(b.wingPhase) * (b.size * 0.6);
                ctx.beginPath();
                ctx.moveTo(-b.size, flap);
                ctx.quadraticCurveTo(-b.size * 0.4, -flap * 0.5, 0, 0);
                ctx.quadraticCurveTo(b.size * 0.4, -flap * 0.5, b.size, flap);
                ctx.quadraticCurveTo(b.size * 0.5, flap * 0.5, 0, b.size * 0.4);
                ctx.quadraticCurveTo(-b.size * 0.5, flap * 0.5, -b.size, flap);
                ctx.fill();
                ctx.stroke();

                ctx.restore();
            });

            ctx.globalAlpha = 1.0;
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    bindEvents() {
        // Onboarding Begin Button
        const onboardingBtn = document.getElementById('onboarding-begin-btn');
        const onboardingInput = document.getElementById('onboarding-name-input');
        if (onboardingBtn && onboardingInput) {
            onboardingBtn.addEventListener('click', () => {
                const name = onboardingInput.value.trim();
                if (!name) {
                    alert("⚠️ Enter your mortal name before entering the trial!");
                    onboardingInput.focus();
                    return;
                }
                this.state.studentName = name;
                this.saveState();
                this.checkOnboarding();
                this.updateCertificatePreview();
                window.spookyAudio.init();
                window.spookyAudio.playTollBell();
            });

            onboardingInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    onboardingBtn.click();
                }
            });
        }

        // Log Off / Switch Learner Button
        const switchLearnerBtn = document.getElementById('switch-learner-btn');
        if (switchLearnerBtn) {
            switchLearnerBtn.addEventListener('click', () => {
                const modal = document.getElementById('onboarding-modal');
                if (modal) {
                    if (onboardingInput) onboardingInput.value = this.state.studentName;
                    modal.style.display = 'flex';
                }
            });
        }

        // Reset Progress Button
        const resetBtn = document.getElementById('reset-game-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                const conf = confirm("⚠️ RESET ALL OCCULT PROGRESS?\n\nThis will re-lock all completed realms, wipe all claimed badges, reset Trick or Treat spins to 3, and clear scores.\nAre you sure you want to start fresh?");
                if (conf) {
                    this.state.unlockedLevels = [1];
                    this.state.completedLevels = [];
                    this.state.badges = [];
                    this.state.wheelSpins = 3;
                    this.state.occultXP = 0;
                    this.state.spectralShields = 0;
                    this.state.elixirsOfIntuition = 0;
                    this.state.specialTitles = [];
                    this.state.finalAssessment.score = 0;
                    this.state.finalAssessment.userAnswers = {};
                    this.state.finalAssessment.markedForReview.clear();
                    this.saveState();
                    this.renderLevelsGrid();
                    this.renderBadgesVault();
                    this.updateCertificatePreview();
                    if (window.spookyWheel) window.spookyWheel.updateWheelUI();
                    window.spookyAudio.playJumpScare();
                    alert("🔄 All realm progress has been reset. Level 1 awaits!");
                }
            });
        }

        // Sound toggle
        const soundBtn = document.getElementById('sound-toggle-btn');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                window.spookyAudio.init();
                const muted = window.spookyAudio.toggleMute();
                soundBtn.innerHTML = muted ? "🔇 Audio: Muted" : "🔊 Spooky Audio";
                soundBtn.classList.toggle('active', !muted);
                if (!muted) {
                    window.spookyAudio.startAmbientDrone();
                    window.spookyAudio.playTollBell();
                }
            });
        }

        // Ambient trigger on first user click anywhere
        const startAudioOnce = () => {
            window.spookyAudio.init();
            window.spookyAudio.startAmbientDrone();
            document.removeEventListener('click', startAudioOnce);
        };
        document.addEventListener('click', startAudioOnce, { once: true });

        // Navigation Tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetView = e.currentTarget.dataset.view;
                this.switchView(targetView);
            });
        });

        // Spin Wheel Button
        const spinBtn = document.getElementById('spin-wheel-btn');
        if (spinBtn) {
            spinBtn.addEventListener('click', () => {
                if (window.spookyWheel) window.spookyWheel.spin();
            });
        }

        // Lifeline Buttons (Single Level)
        document.getElementById('use-shield-single')?.addEventListener('click', () => this.useSpectralShield('single'));
        document.getElementById('use-elixir-single')?.addEventListener('click', () => this.useElixirOfIntuition('single'));

        // Lifeline Buttons (Final Assessment)
        document.getElementById('use-shield-final')?.addEventListener('click', () => this.useSpectralShield('final'));
        document.getElementById('use-elixir-final')?.addEventListener('click', () => this.useElixirOfIntuition('final'));

        // Certificate Name Input Listener
        const certNameInput = document.getElementById('cert-student-name');
        if (certNameInput) {
            certNameInput.value = this.state.studentName || "Apprentice";
            certNameInput.addEventListener('input', (e) => {
                this.state.studentName = e.target.value;
                const userDisplay = document.getElementById('current-user-name');
                if (userDisplay) userDisplay.textContent = this.state.studentName || "Apprentice";
                this.saveState();
                this.updateCertificatePreview();
            });
        }

        // Certificate Download Button
        const downloadBtn = document.getElementById('download-cert-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                const canvas = document.getElementById('certificate-canvas');
                window.halloweenCertificateEngine.downloadCertificatePNG(canvas, this.state.studentName || "Champion");
                window.spookyAudio.playLevelComplete();
            });
        }

        // Modal / Quiz action buttons
        document.getElementById('next-question-btn')?.addEventListener('click', () => this.handleNextQuestion());
        document.getElementById('exit-quiz-btn')?.addEventListener('click', () => this.exitQuizStage());

        // Final Assessment specific buttons
        document.getElementById('final-prev-btn')?.addEventListener('click', () => this.navigateFinalQuestion(-1));
        document.getElementById('final-next-btn')?.addEventListener('click', () => this.navigateFinalQuestion(1));
        document.getElementById('final-mark-btn')?.addEventListener('click', () => this.toggleFinalMarkForReview());
        document.getElementById('final-submit-btn')?.addEventListener('click', () => this.submitFinalAssessment());
    }

    switchView(viewName) {
        document.querySelectorAll('.nav-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.view === viewName);
        });

        document.getElementById('view-quest-map').style.display = viewName === 'quest' ? 'block' : 'none';
        document.getElementById('view-badges-vault').style.display = viewName === 'badges' ? 'block' : 'none';
        document.getElementById('view-certificate').style.display = viewName === 'cert' ? 'block' : 'none';
        
        const wheelView = document.getElementById('view-wheel');
        if (wheelView) {
            wheelView.style.display = viewName === 'wheel' ? 'block' : 'none';
            if (viewName === 'wheel' && window.spookyWheel) {
                window.spookyWheel.init('spooky-wheel-canvas');
                window.spookyWheel.updateWheelUI();
            }
        }

        if (viewName === 'cert') {
            this.updateCertificatePreview();
        }
    }

    /* -------------------------------------------------------------
       Quest Map & Levels Rendering (With Kapil's Portrait Medallions)
    -------------------------------------------------------------- */
    renderLevelsGrid() {
        const grid = document.getElementById('levels-grid');
        if (!grid) return;
        grid.innerHTML = '';

        window.GAME_DATA.levels.forEach(level => {
            const isUnlocked = this.state.unlockedLevels.includes(level.id);
            const isCompleted = this.state.completedLevels.includes(level.id);

            const card = document.createElement('div');
            card.className = `level-card ${isCompleted ? 'completed' : (isUnlocked ? 'unlocked' : 'locked')}`;
            card.innerHTML = `
                <div>
                    <div class="level-header">
                        <div class="level-badge-preview">
                            <img src="kapil_vampire.jpg" alt="Kapil Medallion">
                            <span class="badge-icon-overlay">${level.badge.icon}</span>
                        </div>
                        <span class="level-num-pill">LEVEL 0${level.id}</span>
                    </div>
                    <h3>${level.title}</h3>
                    <p>${level.subtitle}</p>
                </div>
                <div>
                    <div class="level-status-row">
                        <span class="level-status-tag ${isCompleted ? 'status-completed' : (isUnlocked ? 'status-unlocked' : 'status-locked')}">
                            ${isCompleted ? '✓ CLEARED' : (isUnlocked ? '⚡ READY' : '🔒 LOCKED')}
                        </span>
                        <span style="font-size: 0.75rem; color: #94a3b8;">Pass: ${level.passScore}%</span>
                    </div>
                    <button class="spooky-btn-primary" style="width: 100%;" 
                        ${!isUnlocked ? 'disabled' : ''} 
                        onclick="window.gameApp.startLevel(${level.id})">
                        ${isCompleted ? 'Replay Realm' : (level.id === 5 ? 'Enter 300 MCQ Trial (1 Hr)' : 'Enter Realm')}
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });

        // Update overall stats in Hero
        const unlockedStat = document.getElementById('stat-unlocked-count');
        const badgesStat = document.getElementById('stat-badges-count');
        if (unlockedStat) unlockedStat.textContent = `${this.state.unlockedLevels.length} / 5`;
        if (badgesStat) badgesStat.textContent = `${this.state.badges.length} / 5`;
    }

    /* -------------------------------------------------------------
       Starting a Level
    -------------------------------------------------------------- */
    startLevel(levelId) {
        window.spookyAudio.init();
        window.spookyAudio.playTollBell();

        if (levelId === 5) {
            this.startFinalAssessment();
            return;
        }

        let questions = [];
        if (levelId === 1) questions = window.GAME_DATA.level1;
        else if (levelId === 2) questions = window.GAME_DATA.level2;
        else if (levelId === 3) questions = window.GAME_DATA.level3;
        else if (levelId === 4) questions = window.GAME_DATA.level4;

        this.state.currentLevelTrial = {
            active: true,
            levelId: levelId,
            questions: [...questions],
            currentIndex: 0,
            score: 0,
            selectedOption: null,
            isAnswered: false
        };

        document.getElementById('view-quest-map').style.display = 'none';
        document.getElementById('quiz-stage-single').style.display = 'block';

        this.updateLifelinesDisplay('single');
        this.renderSingleQuestion();
    }

    updateLifelinesDisplay(mode) {
        const shieldCount = this.state.spectralShields || 0;
        const elixirCount = this.state.elixirsOfIntuition || 0;

        const shieldBtn = document.getElementById(`use-shield-${mode}`);
        const elixirBtn = document.getElementById(`use-elixir-${mode}`);

        if (shieldBtn) {
            shieldBtn.textContent = `🛡️ Use Shield (${shieldCount})`;
            shieldBtn.disabled = shieldCount <= 0;
        }
        if (elixirBtn) {
            elixirBtn.textContent = `🧪 Use Elixir 50:50 (${elixirCount})`;
            elixirBtn.disabled = elixirCount <= 0;
        }
    }

    useSpectralShield(mode) {
        if (!this.state.spectralShields || this.state.spectralShields <= 0) {
            alert("🔒 No Spectral Shields remaining! Spin the Trick or Treat Wheel to claim more!");
            return;
        }

        this.state.spectralShields--;
        this.saveState();
        this.updateLifelinesDisplay(mode);
        window.spookyAudio.playCorrect();

        if (mode === 'single') {
            const trial = this.state.currentLevelTrial;
            trial.score++;
            alert("🛡️ SPECTRAL SHIELD ACTIVATED!\nThe phantom barrier repels the trial and auto-solves this question with full credit!");
            this.handleNextQuestion();
        } else if (mode === 'final') {
            const finalState = this.state.finalAssessment;
            const q = finalState.questions[finalState.currentIndex];
            finalState.userAnswers[finalState.currentIndex] = q.answer;
            this.updatePaletteCell(finalState.currentIndex);
            alert("🛡️ SPECTRAL SHIELD ACTIVATED!\nQuestion automatically answered correctly!");
            this.navigateFinalQuestion(1);
        }
    }

    useElixirOfIntuition(mode) {
        if (!this.state.elixirsOfIntuition || this.state.elixirsOfIntuition <= 0) {
            alert("🔒 No Elixirs of Intuition remaining! Spin the Trick or Treat Wheel to win elixirs!");
            return;
        }

        this.state.elixirsOfIntuition--;
        this.saveState();
        this.updateLifelinesDisplay(mode);
        window.spookyAudio.playCorrect();

        const containerId = mode === 'single' ? 'quiz-options-container' : 'final-options-container';
        const container = document.getElementById(containerId);
        if (!container) return;

        let correctAnswer;
        if (mode === 'single') {
            correctAnswer = this.state.currentLevelTrial.questions[this.state.currentLevelTrial.currentIndex].answer;
        } else {
            correctAnswer = this.state.finalAssessment.questions[this.state.finalAssessment.currentIndex].answer;
        }

        const buttons = Array.from(container.querySelectorAll('.option-btn'));
        let eliminated = 0;
        buttons.forEach((btn, idx) => {
            if (idx !== correctAnswer && eliminated < 2) {
                btn.style.opacity = '0.2';
                btn.style.pointerEvents = 'none';
                btn.style.textDecoration = 'line-through';
                eliminated++;
            }
        });

        alert("🧪 ELIXIR OF INTUITION CONSUMED!\nTwo lethal falsehoods have dissolved into spectral mist!");
    }

    renderSingleQuestion() {
        const trial = this.state.currentLevelTrial;
        const q = trial.questions[trial.currentIndex];
        const levelConfig = window.GAME_DATA.levels.find(l => l.id === trial.levelId);

        document.getElementById('quiz-level-title').textContent = `${levelConfig.title} - Question ${trial.currentIndex + 1}/${trial.questions.length}`;
        document.getElementById('quiz-question-prompt').textContent = q.question;

        const optionsContainer = document.getElementById('quiz-options-container');
        optionsContainer.innerHTML = '';

        const prefixes = ['A', 'B', 'C', 'D'];
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="option-prefix">${prefixes[idx]}</span> <span>${opt}</span>`;
            btn.addEventListener('click', () => this.selectSingleOption(idx));
            optionsContainer.appendChild(btn);
        });

        const explanationBox = document.getElementById('quiz-explanation-box');
        explanationBox.style.display = 'none';

        const nextBtn = document.getElementById('next-question-btn');
        nextBtn.textContent = (trial.currentIndex === trial.questions.length - 1) ? "Finalize Realm" : "Next Question";
        nextBtn.style.display = 'none';

        trial.selectedOption = null;
        trial.isAnswered = false;
        this.updateLifelinesDisplay('single');
    }

    selectSingleOption(optIdx) {
        const trial = this.state.currentLevelTrial;
        if (trial.isAnswered) return;

        trial.isAnswered = true;
        trial.selectedOption = optIdx;

        const q = trial.questions[trial.currentIndex];
        const isCorrect = (optIdx === q.answer);

        const options = document.querySelectorAll('#quiz-options-container .option-btn');
        options.forEach((btn, idx) => {
            if (idx === q.answer) {
                btn.classList.add('correct');
            } else if (idx === optIdx && !isCorrect) {
                btn.classList.add('wrong');
            }
        });

        const explanationBox = document.getElementById('quiz-explanation-box');
        document.getElementById('quiz-explanation-text').textContent = q.explanation;
        explanationBox.style.display = 'block';

        if (isCorrect) {
            trial.score++;
            window.spookyAudio.playCorrect();
        } else {
            window.spookyAudio.playWrong();
            document.body.classList.add('horror-shake');
            setTimeout(() => document.body.classList.remove('horror-shake'), 450);
        }

        document.getElementById('next-question-btn').style.display = 'inline-block';
    }

    handleNextQuestion() {
        const trial = this.state.currentLevelTrial;
        trial.currentIndex++;

        if (trial.currentIndex < trial.questions.length) {
            this.renderSingleQuestion();
        } else {
            this.concludeSingleLevel();
        }
    }

    concludeSingleLevel() {
        const trial = this.state.currentLevelTrial;
        const total = trial.questions.length;
        const percentage = Math.round((trial.score / total) * 100);
        const levelConfig = window.GAME_DATA.levels.find(l => l.id === trial.levelId);

        const passed = percentage >= levelConfig.passScore;

        if (passed) {
            window.spookyAudio.playLevelComplete();
            if (!this.state.completedLevels.includes(trial.levelId)) {
                this.state.completedLevels.push(trial.levelId);
            }
            if (!this.state.badges.includes(levelConfig.badge.id)) {
                this.state.badges.push(levelConfig.badge.id);
            }
            const nextLvl = trial.levelId + 1;
            if (nextLvl <= 5 && !this.state.unlockedLevels.includes(nextLvl)) {
                this.state.unlockedLevels.push(nextLvl);
            }

            // Award +2 spins on Trick or Treat Wheel and +150 XP!
            this.state.wheelSpins = (this.state.wheelSpins || 0) + 2;
            this.state.occultXP = (this.state.occultXP || 0) + 150;
            this.saveState();

            alert(`🎉 SPOOKY TRIUMPH!\n\nYou conquered ${levelConfig.title} with a score of ${percentage}% (${trial.score}/${total})!\n\nYou earned Kapil's Badge: ${levelConfig.badge.name} ${levelConfig.badge.icon}!\n\n🎁 BONUS REWARD: +2 SPINS awarded for Kapil's Wheel of Trick or Treat, plus +150 Occult XP!`);
        } else {
            window.spookyAudio.playJumpScare();
            alert(`💀 THE SOULS CLAIMED YOU!\n\nYou scored ${percentage}%, but need ${levelConfig.passScore}% to pass this realm. Re-ignite your torches and try again!`);
        }

        this.exitQuizStage();
    }

    exitQuizStage() {
        document.getElementById('quiz-stage-single').style.display = 'none';
        document.getElementById('view-quest-map').style.display = 'block';
        this.renderLevelsGrid();
        this.renderBadgesVault();
        this.updateCertificatePreview();
        if (window.spookyWheel) window.spookyWheel.updateWheelUI();
    }

    /* -------------------------------------------------------------
       Level 5: Grand Final Assessment (300 MCQs, 1-Hour Timer)
    -------------------------------------------------------------- */
    startFinalAssessment() {
        const confirmed = confirm("⚠️ ENTERING THE 1-HOUR WITCHING TRIAL ⚠️\n\nYou are about to begin the 300-MCQ Final Assessment.\nTime Limit: Strictly 60 Minutes (1 Hour).\nAre you prepared, Apprentice?");
        if (!confirmed) return;

        window.spookyAudio.init();
        window.spookyAudio.playHeartbeat();

        const all300 = window.GAME_DATA.getFinal300Questions();

        this.state.finalAssessment = {
            active: true,
            questions: all300,
            currentIndex: 0,
            userAnswers: {},
            markedForReview: new Set(),
            timeRemainingSeconds: 3600,
            timerInterval: null,
            score: 0,
            submitted: false
        };

        document.getElementById('view-quest-map').style.display = 'none';
        document.getElementById('final-assessment-stage').style.display = 'block';

        this.buildFinalPalette();
        this.renderFinalQuestion();
        this.startFinalTimer();
    }

    startFinalTimer() {
        if (this.state.finalAssessment.timerInterval) {
            clearInterval(this.state.finalAssessment.timerInterval);
        }

        const timerBox = document.getElementById('final-timer-display');

        this.state.finalAssessment.timerInterval = setInterval(() => {
            const finalState = this.state.finalAssessment;
            finalState.timeRemainingSeconds--;

            const mins = Math.floor(finalState.timeRemainingSeconds / 60);
            const secs = finalState.timeRemainingSeconds % 60;
            const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            if (timerBox) timerBox.textContent = formatted;

            if (finalState.timeRemainingSeconds <= 300) {
                timerBox.parentElement.classList.add('urgent');
                if (finalState.timeRemainingSeconds % 10 === 0) {
                    window.spookyAudio.playHeartbeat();
                }
            }

            if (finalState.timeRemainingSeconds <= 0) {
                clearInterval(finalState.timerInterval);
                alert("⏳ TIME HAS EXPIRED! The Netherworld bell tolls. Submitting your examination now...");
                this.submitFinalAssessment();
            }
        }, 1000);
    }

    buildFinalPalette() {
        const palette = document.getElementById('final-palette-grid');
        if (!palette) return;
        palette.innerHTML = '';

        for (let i = 0; i < 300; i++) {
            const cell = document.createElement('div');
            cell.className = 'palette-cell';
            cell.id = `palette-cell-${i}`;
            cell.textContent = i + 1;
            cell.addEventListener('click', () => {
                this.state.finalAssessment.currentIndex = i;
                this.renderFinalQuestion();
            });
            palette.appendChild(cell);
        }
    }

    renderFinalQuestion() {
        const finalState = this.state.finalAssessment;
        const q = finalState.questions[finalState.currentIndex];

        document.getElementById('final-progress-indicator').textContent = `Question ${finalState.currentIndex + 1} of 300`;
        document.getElementById('final-category-tag').textContent = q.category || "DSA / Aptitude / Soft Skills";
        document.getElementById('final-question-text').textContent = q.question;

        const optionsContainer = document.getElementById('final-options-container');
        optionsContainer.innerHTML = '';

        const selectedIdx = finalState.userAnswers[finalState.currentIndex];
        const prefixes = ['A', 'B', 'C', 'D'];

        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = `option-btn ${selectedIdx === idx ? 'selected' : ''}`;
            btn.innerHTML = `<span class="option-prefix">${prefixes[idx]}</span> <span>${opt}</span>`;
            btn.addEventListener('click', () => {
                finalState.userAnswers[finalState.currentIndex] = idx;
                window.spookyAudio.playTick();
                this.renderFinalQuestion();
                this.updatePaletteCell(finalState.currentIndex);
            });
            optionsContainer.appendChild(btn);
        });

        const isMarked = finalState.markedForReview.has(finalState.currentIndex);
        const markBtn = document.getElementById('final-mark-btn');
        if (markBtn) {
            markBtn.textContent = isMarked ? "★ Marked for Review" : "☆ Mark for Review";
            markBtn.style.borderColor = isMarked ? "var(--witch-purple)" : "rgba(255, 255, 255, 0.2)";
        }

        this.updatePaletteCell(finalState.currentIndex);
        this.updateLifelinesDisplay('final');
    }

    updatePaletteCell(index) {
        const finalState = this.state.finalAssessment;
        const cell = document.getElementById(`palette-cell-${index}`);
        if (!cell) return;

        cell.className = 'palette-cell';
        if (finalState.currentIndex === index) {
            cell.classList.add('current');
        }
        if (finalState.userAnswers[index] !== undefined) {
            cell.classList.add('answered');
        }
        if (finalState.markedForReview.has(index)) {
            cell.classList.add('marked');
        }
    }

    navigateFinalQuestion(direction) {
        const finalState = this.state.finalAssessment;
        const target = finalState.currentIndex + direction;
        if (target >= 0 && target < finalState.questions.length) {
            finalState.currentIndex = target;
            this.renderFinalQuestion();
        }
    }

    toggleFinalMarkForReview() {
        const finalState = this.state.finalAssessment;
        const idx = finalState.currentIndex;
        if (finalState.markedForReview.has(idx)) {
            finalState.markedForReview.delete(idx);
        } else {
            finalState.markedForReview.add(idx);
        }
        this.renderFinalQuestion();
    }

    submitFinalAssessment() {
        const finalState = this.state.finalAssessment;
        if (finalState.submitted) return;

        clearInterval(finalState.timerInterval);
        finalState.submitted = true;

        let correctCount = 0;
        finalState.questions.forEach((q, idx) => {
            if (finalState.userAnswers[idx] === q.answer) {
                correctCount++;
            }
        });

        finalState.score = Math.round((correctCount / finalState.questions.length) * 100);

        const lvl5 = window.GAME_DATA.levels.find(l => l.id === 5);
        const passed = finalState.score >= lvl5.passScore;

        if (passed) {
            window.spookyAudio.playLevelComplete();
            if (!this.state.completedLevels.includes(5)) {
                this.state.completedLevels.push(5);
            }
            if (!this.state.badges.includes(lvl5.badge.id)) {
                this.state.badges.push(lvl5.badge.id);
            }
            this.state.wheelSpins = (this.state.wheelSpins || 0) + 5;
            this.state.occultXP = (this.state.occultXP || 0) + 500;
            this.saveState();

            alert(`🏆 GLORIOUS ASCENSION!\n\nYou passed the 300-MCQ 1-Hour Halloween Trial with ${finalState.score}% (${correctCount}/300 correct)!\n\nYou have earned the Supreme Badge: ${lvl5.badge.name} ${lvl5.badge.icon} with Kapil's Medallion!\n\n🎁 BONUS: +5 Spins on the Trick or Treat Wheel + 500 Occult XP! Your Official Certificate is now ready for download!`);
        } else {
            window.spookyAudio.playJumpScare();
            alert(`💀 THE TRIAL CONSUMED YOU!\n\nYou scored ${finalState.score}% (${correctCount}/300). Minimum required is ${lvl5.passScore}%. Refine your DSA, Aptitude, and Soft Skills, and challenge the Necromancer again!`);
        }

        document.getElementById('final-assessment-stage').style.display = 'none';
        this.switchView('cert');
        this.renderLevelsGrid();
        this.renderBadgesVault();
    }

    /* -------------------------------------------------------------
       Badges Vault (With Kapil's Large Vampire Medallion)
    -------------------------------------------------------------- */
    renderBadgesVault() {
        const container = document.getElementById('badges-grid');
        if (!container) return;
        container.innerHTML = '';

        window.GAME_DATA.levels.forEach(level => {
            const isUnlocked = this.state.badges.includes(level.badge.id);
            const badgeCard = document.createElement('div');
            badgeCard.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            badgeCard.innerHTML = `
                <div class="badge-medallion-large">
                    <img src="kapil_vampire.jpg" alt="Kapil Medallion">
                    <div class="badge-icon-overlay">${level.badge.icon}</div>
                </div>
                <div class="badge-title">${level.badge.name}</div>
                <div class="badge-lore">${level.badge.lore}</div>
                <div style="margin-top: 10px; font-size: 0.75rem; color: ${isUnlocked ? 'var(--gold)' : '#64748b'};">
                    ${isUnlocked ? '★ CLAIMED (Kapil Certified) ★' : '🔒 LOCKED'}
                </div>
            `;
            container.appendChild(badgeCard);
        });
    }

    /* -------------------------------------------------------------
       Certificate Preview & Rendering
    -------------------------------------------------------------- */
    updateCertificatePreview() {
        const canvas = document.getElementById('certificate-canvas');
        if (!canvas) return;

        const score = this.state.finalAssessment.score || (this.state.completedLevels.length >= 1 ? 88 : 0);

        window.halloweenCertificateEngine.renderCertificate(canvas, {
            name: this.state.studentName || "Apprentice",
            score: score,
            badges: this.state.badges,
            specialTitles: this.state.specialTitles,
            occultXP: this.state.occultXP,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        });
    }
}

// Global Launcher
window.addEventListener('DOMContentLoaded', () => {
    window.gameApp = new HalloweenGameController();
});
