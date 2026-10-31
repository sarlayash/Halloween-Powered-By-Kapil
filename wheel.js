// Halloween Powered By Kapil - Trick or Treat Spinning Wheel Engine
// Sarlayash Productions

class SpookyWheelEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isSpinning = false;
        this.currentAngle = 0; // In radians
        this.targetAngle = 0;
        this.founderImg = new Image();
        this.founderImg.src = 'kapil_vampire.jpg';
        this.isImgLoaded = false;
        this.founderImg.onload = () => { this.isImgLoaded = true; };

        // 8 Occult Slices: Alternating Treat & Trick
        this.slices = [
            {
                type: 'treat',
                label: 'TREAT: +250 XP',
                sublabel: 'Vampire Gold',
                color: '#7f1d1d', // Crimson
                icon: '🍬',
                reward: { type: 'xp', value: 250, desc: 'Gained +250 Occult XP from the Vampire Vault!' }
            },
            {
                type: 'trick',
                label: 'TRICK: DSA Curse',
                sublabel: 'Necromancer Riddle',
                color: '#1e1136', // Obsidian Purple
                icon: '💀',
                trick: {
                    title: '💀 Necromancer\'s DSA Curse!',
                    prompt: 'To break this curse, solve the algorithmic riddle: What is the worst-case space complexity of recursive Tree Inorder Traversal on a completely skewed binary tree of N nodes?',
                    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
                    answer: 2,
                    exp: 'On a completely degenerated/skewed tree, recursion stack frames reach depth N, consuming O(N) space!'
                }
            },
            {
                type: 'treat',
                label: 'TREAT: Shield',
                sublabel: 'Spectral Guard',
                color: '#ea580c', // Pumpkin flame
                icon: '🛡️',
                reward: { type: 'shield', value: 1, desc: 'Claimed 1 Spectral Shield! Use it to bypass any lethal question!' }
            },
            {
                type: 'trick',
                label: 'TRICK: Labyrinth Trap',
                sublabel: 'Speed Logic',
                color: '#0f172a', // Midnight slate
                icon: '🦇',
                trick: {
                    title: '🦇 Banshee\'s Logic Trap!',
                    prompt: 'Break the spell: A vampire bat flies 60 miles at 20 mph, and returns along the same dark path at 30 mph. What is its average round-trip speed?',
                    options: ['25 mph', '24 mph', '22 mph', '26 mph'],
                    answer: 1,
                    exp: 'Harmonic average speed = 2 * S1 * S2 / (S1 + S2) = 2 * 20 * 30 / 50 = 24 mph!'
                }
            },
            {
                type: 'treat',
                label: 'TREAT: Elixir',
                sublabel: '50:50 Intuition',
                color: '#15803d', // Slime green
                icon: '🧪',
                reward: { type: 'elixir', value: 1, desc: 'Acquired 1 Elixir of Intuition! Eliminates 2 false options in trial!' }
            },
            {
                type: 'trick',
                label: 'TRICK: EQ Dilemma',
                sublabel: 'Crisis Leadership',
                color: '#581c87', // Royal witch purple
                icon: '🕯️',
                trick: {
                    title: '🕯️ Gargoyle\'s Soft Skill Crisis!',
                    prompt: 'A critical system collapses during midnight release. A junior teammate is hyperventilating in terror. What is the supreme EQ action?',
                    options: [
                        'Publicly reprimand them so everyone knows who broke it.',
                        'Reassure them calmly, pair up to triage root cause, and run a blameless post-mortem later.',
                        'Disconnect immediately and let them suffer alone.',
                        'Delete the production database in frustration.'
                    ],
                    answer: 1,
                    exp: 'High emotional intelligence de-escalates crisis panic, establishes psychological safety, and leads through collaborative triage!'
                }
            },
            {
                type: 'treat',
                label: 'TREAT: Kapil\'s Blessing',
                sublabel: 'Royal Title + 500 XP',
                color: '#b45309', // Amber Gold
                icon: '👑',
                reward: { type: 'blessing', value: 500, title: 'Keeper of the Blood Moon', desc: 'Kapil bestows his Royal Blessing! Gained +500 XP and unlocked the sacred title "Keeper of the Blood Moon"!' }
            },
            {
                type: 'trick',
                label: 'TRICK: Code Glitch',
                sublabel: 'Stack Poison',
                color: '#991b1b', // Blood red
                icon: '⚡',
                trick: {
                    title: '⚡ Zombie\'s Code Glitch!',
                    prompt: 'Identify the curse: Which of the following conditions in a recursive algorithm causes an irrecoverable Stack Overflow?',
                    options: [
                        'Missing or unreachable base case.',
                        'Using memoization hash map.',
                        'Passing arguments by reference.',
                        'Using tail-call optimization.'
                    ],
                    answer: 0,
                    exp: 'Without a reachable terminating base condition, recursive function frames accumulate infinitely until call stack memory is exhausted!'
                }
            }
        ];
    }

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.drawWheel();
    }

    drawWheel() {
        if (!this.ctx || !this.canvas) return;
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        ctx.clearRect(0, 0, width, height);

        const numSlices = this.slices.length;
        const sliceAngle = (2 * Math.PI) / numSlices;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.currentAngle);

        // 1. Draw outer ornate glow ring
        ctx.beginPath();
        ctx.arc(0, 0, radius + 10, 0, 2 * Math.PI);
        ctx.strokeStyle = '#d97706'; // Gold
        ctx.lineWidth = 12;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 2. Outer rim studs / golden skull pegs
        for (let i = 0; i < numSlices; i++) {
            const pegAngle = i * sliceAngle;
            const px = (radius + 4) * Math.cos(pegAngle);
            const py = (radius + 4) * Math.sin(pegAngle);
            ctx.beginPath();
            ctx.arc(px, py, 6, 0, 2 * Math.PI);
            ctx.fillStyle = '#fde68a';
            ctx.fill();
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // 3. Draw Slices
        for (let i = 0; i < numSlices; i++) {
            const startA = i * sliceAngle;
            const endA = startA + sliceAngle;
            const slice = this.slices[i];

            // Slice background
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, startA, endA);
            ctx.closePath();
            ctx.fillStyle = slice.color;
            ctx.fill();

            // Slice boundary lines
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Text and icons
            ctx.save();
            ctx.rotate(startA + sliceAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#ffffff';

            // Icon
            ctx.font = '24px sans-serif';
            ctx.fillText(slice.icon, radius - 16, 8);

            // Label
            ctx.font = 'bold 13px "Cinzel", Georgia, serif';
            ctx.fillStyle = slice.type === 'treat' ? '#fde68a' : '#fca5a5';
            ctx.fillText(slice.label, radius - 50, 4);

            // Sublabel
            ctx.font = '10px "Inter", sans-serif';
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText(slice.sublabel, radius - 50, 18);

            ctx.restore();
        }

        ctx.restore(); // Restore wheel rotation so center medallion stays upright!

        // 4. Center Medallion (Kapil's Vampire Portrait Hub - stays upright)
        ctx.save();
        ctx.translate(centerX, centerY);

        ctx.beginPath();
        ctx.arc(0, 0, 46, 0, 2 * Math.PI);
        ctx.fillStyle = '#7f1d1d';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#f59e0b';
        ctx.stroke();

        if (this.isImgLoaded && this.founderImg.complete && this.founderImg.naturalWidth > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, 42, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(this.founderImg, -42, -52, 84, 105);
            ctx.restore();
        } else {
            ctx.font = '30px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🧛‍♂️', 0, 0);
        }

        // Inner gold hub ring
        ctx.beginPath();
        ctx.arc(0, 0, 42, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        // 5. Stationary Pointer (Bloody Golden Dagger / Clacker at Top)
        this.drawPointer(centerX, centerY - radius + 4);
    }

    drawPointer(x, y) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);

        // Gothic flapper dagger
        ctx.beginPath();
        ctx.moveTo(0, 24);
        ctx.lineTo(-14, -12);
        ctx.lineTo(14, -12);
        ctx.closePath();

        ctx.fillStyle = '#dc2626'; // Blood red
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#f59e0b'; // Gold trim
        ctx.stroke();

        // Pointer base jewel
        ctx.beginPath();
        ctx.arc(0, -12, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#fde68a';
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    spin() {
        if (this.isSpinning) return;

        // Check if player has spins
        if (!window.gameApp || !window.gameApp.state) return;
        const state = window.gameApp.state;
        if (!state.wheelSpins || state.wheelSpins <= 0) {
            alert("🔒 NO SPINS REMAINING!\n\nConquer any of the 5 Haunted Realms to earn +2 more spins on Kapil's Wheel of Trick or Treat!");
            return;
        }

        state.wheelSpins--;
        window.gameApp.saveState();
        this.updateWheelUI();

        this.isSpinning = true;
        window.spookyAudio.init();

        // Choose a random winning slice index
        const winningIndex = Math.floor(Math.random() * this.slices.length);
        const sliceAngle = (2 * Math.PI) / this.slices.length;

        // Pointer is at the top (3*PI/2)
        const randomExtraSpins = (5 + Math.floor(Math.random() * 4)) * (2 * Math.PI);
        const sliceCenter = winningIndex * sliceAngle + sliceAngle / 2;
        const targetRotation = (3 * Math.PI / 2) - sliceCenter;
        
        const startRotation = this.currentAngle % (2 * Math.PI);
        let delta = targetRotation - startRotation;
        while (delta < 0) delta += 2 * Math.PI;

        this.targetAngle = this.currentAngle + randomExtraSpins + delta;

        // Physics animation parameters
        const startTime = performance.now();
        const duration = 4800; // 4.8 seconds
        const initialAngle = this.currentAngle;
        let lastPegIndex = -1;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic deceleration
            const easeOut = 1 - Math.pow(1 - progress, 3);
            this.currentAngle = initialAngle + (this.targetAngle - initialAngle) * easeOut;

            // Trigger wheel clicking sound as pegs pass
            const currentPeg = Math.floor((this.currentAngle / sliceAngle));
            if (currentPeg !== lastPegIndex) {
                lastPegIndex = currentPeg;
                const pitch = 1400 - (progress * 400);
                window.spookyAudio.playWheelClick(pitch);
            }

            this.drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isSpinning = false;
                this.onSpinComplete(winningIndex);
            }
        };

        requestAnimationFrame(animate);
    }

    onSpinComplete(index) {
        const slice = this.slices[index];
        this.updateWheelUI();

        if (slice.type === 'treat') {
            window.spookyAudio.playCorrect();
            window.spookyAudio.playLevelComplete();
            this.handleTreat(slice);
        } else {
            window.spookyAudio.playJumpScare();
            document.body.classList.add('horror-shake');
            setTimeout(() => document.body.classList.remove('horror-shake'), 500);
            this.handleTrick(slice);
        }
    }

    handleTreat(slice) {
        const state = window.gameApp.state;
        const reward = slice.reward;

        if (reward.type === 'xp') {
            state.occultXP = (state.occultXP || 0) + reward.value;
        } else if (reward.type === 'shield') {
            state.spectralShields = (state.spectralShields || 0) + reward.value;
        } else if (reward.type === 'elixir') {
            state.elixirsOfIntuition = (state.elixirsOfIntuition || 0) + reward.value;
        } else if (reward.type === 'blessing') {
            state.occultXP = (state.occultXP || 0) + reward.value;
            if (!state.specialTitles) state.specialTitles = [];
            if (!state.specialTitles.includes(reward.title)) {
                state.specialTitles.push(reward.title);
            }
        }

        window.gameApp.saveState();
        this.updateWheelUI();
        window.gameApp.updateCertificatePreview();

        // Show Treat Dialog
        const modal = document.getElementById('wheel-result-modal');
        if (modal) {
            document.getElementById('wheel-result-title').textContent = "🍬 SWEET HALLOWEEN TREAT!";
            document.getElementById('wheel-result-title').style.color = "var(--slime-green)";
            document.getElementById('wheel-result-icon').textContent = slice.icon;
            document.getElementById('wheel-result-desc').textContent = reward.desc;
            document.getElementById('wheel-result-action-btn').textContent = "Claim Treat & Rejoice";
            document.getElementById('wheel-result-action-btn').onclick = () => { modal.style.display = 'none'; };
            document.getElementById('wheel-trick-challenge-box').style.display = 'none';
            modal.style.display = 'flex';
        }
    }

    handleTrick(slice) {
        const trick = slice.trick;
        const modal = document.getElementById('wheel-result-modal');
        if (!modal) return;

        document.getElementById('wheel-result-title').textContent = "🎃 MISCHIEVOUS TRICK!";
        document.getElementById('wheel-result-title').style.color = "var(--blood-red)";
        document.getElementById('wheel-result-icon').textContent = slice.icon;
        document.getElementById('wheel-result-desc').textContent = "The Netherworld has cast a curse upon you! Break the spell by answering Kapil's rapid riddle, or suffer the brain fog!";
        
        // Render trick question
        const trickBox = document.getElementById('wheel-trick-challenge-box');
        trickBox.style.display = 'block';
        document.getElementById('wheel-trick-prompt').textContent = trick.prompt;
        
        const optsContainer = document.getElementById('wheel-trick-options');
        optsContainer.innerHTML = '';

        trick.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.style.margin = '4px 0';
            btn.innerHTML = `<span class="option-prefix">${['A','B','C','D'][idx]}</span> <span>${opt}</span>`;
            btn.onclick = () => {
                const isCorrect = (idx === trick.answer);
                if (isCorrect) {
                    window.spookyAudio.playCorrect();
                    const state = window.gameApp.state;
                    state.occultXP = (state.occultXP || 0) + 300; // Bonus double XP!
                    window.gameApp.saveState();
                    this.updateWheelUI();

                    alert(`✨ CURSE SHATTERED!\n\nSplendid intellect! You defeated the trick and earned +300 Occult Redemption XP!\n\nLore: ${trick.exp}`);
                } else {
                    window.spookyAudio.playWrong();
                    alert(`💀 THE CURSE CONSUMES YOU!\n\nIncorrect! The spirits cackle in glee.\nCorrect Answer was Option ${['A','B','C','D'][trick.answer]}.\n\nLore: ${trick.exp}`);
                }
                modal.style.display = 'none';
            };
            optsContainer.appendChild(btn);
        });

        document.getElementById('wheel-result-action-btn').textContent = "Surrender to the Shadows";
        document.getElementById('wheel-result-action-btn').onclick = () => { modal.style.display = 'none'; };
        modal.style.display = 'flex';
    }

    updateWheelUI() {
        if (!window.gameApp || !window.gameApp.state) return;
        const state = window.gameApp.state;

        if (state.wheelSpins === undefined) state.wheelSpins = 3;
        if (state.occultXP === undefined) state.occultXP = 0;
        if (state.spectralShields === undefined) state.spectralShields = 0;
        if (state.elixirsOfIntuition === undefined) state.elixirsOfIntuition = 0;

        const spinsDisplay = document.getElementById('wheel-spins-count');
        const xpDisplay = document.getElementById('wheel-xp-count');
        const shieldsDisplay = document.getElementById('wheel-shields-count');
        const elixirsDisplay = document.getElementById('wheel-elixirs-count');
        const spinBtn = document.getElementById('spin-wheel-btn');

        if (spinsDisplay) spinsDisplay.textContent = state.wheelSpins;
        if (xpDisplay) xpDisplay.textContent = state.occultXP;
        if (shieldsDisplay) shieldsDisplay.textContent = state.spectralShields;
        if (elixirsDisplay) elixirsDisplay.textContent = state.elixirsOfIntuition;

        if (spinBtn) {
            spinBtn.disabled = this.isSpinning || state.wheelSpins <= 0;
            spinBtn.innerHTML = this.isSpinning 
                ? "🌀 Conjuring Fate..." 
                : (state.wheelSpins > 0 ? `🎲 SPIN THE OCCULT WHEEL (${state.wheelSpins} Left)` : "🔒 No Spins Left (Beat Levels to Earn)");
        }
    }
}

if (typeof window !== 'undefined') {
    window.spookyWheel = new SpookyWheelEngine();
}
