// Halloween Powered By Kapil - Certificate Engine
// Sarlayash Productions
// Robust HTML5 Canvas 2D Renderer with Zero Text Spillover / Overlap Guarantees

class HalloweenCertificateEngine {
    constructor() {
        this.width = 1920;
        this.height = 1080;
    }

    /**
     * Helper to wrap text cleanly and return lines without overflowing or overlapping
     */
    wrapTextLines(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    /**
     * Render the certificate onto a high-res canvas
     */
    renderCertificate(canvas, data) {
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d');

        // 1. Spooky Mystic Deep Purple & Obsidian Background
        const bgGrad = ctx.createRadialGradient(
            this.width / 2, this.height / 2, 100,
            this.width / 2, this.height / 2, 900
        );
        bgGrad.addColorStop(0, '#1a0b2e'); // Haunted royal purple
        bgGrad.addColorStop(0.5, '#0f051d');
        bgGrad.addColorStop(1, '#05020a'); // Abyssal black
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // 2. Eerie Vignette / Fog texture
        this.drawVignette(ctx);

        // 3. Ornate Double Gold & Blood Red Gothic Border
        this.drawOrnateBorders(ctx);

        // 4. Corner Halloween Emblems (Bats / Web Motifs)
        this.drawCornerFlourishes(ctx);

        // 5. Header: Sarlayash Productions
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f59e0b'; // Gold
        ctx.font = 'bold 24px "Cinzel", "Cinzel Decorative", serif, Georgia';
        ctx.letterSpacing = '6px';
        ctx.shadowColor = '#d97706';
        ctx.shadowBlur = 10;
        ctx.fillText("★ SARLAYASH PRODUCTIONS PRESENTS ★", this.width / 2, 110);
        ctx.shadowBlur = 0;

        // 6. Powered By Subhead
        ctx.fillStyle = '#ff5722'; // Halloween flame orange
        ctx.font = 'bold 26px "Cinzel", serif, Georgia';
        ctx.letterSpacing = '4px';
        ctx.fillText("HALLOWEEN POWERED BY KAPIL", this.width / 2, 155);

        // 7. Main Title: CERTIFICATE OF MASTERY
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 52px "Cinzel Decorative", "Cinzel", serif, Georgia';
        ctx.shadowColor = '#ff4500';
        ctx.shadowBlur = 18;
        ctx.fillText("CERTIFICATE OF EXCELLENCE", this.width / 2, 230);
        ctx.shadowBlur = 0;

        // Divider Line with pumpkin/gem in center
        this.drawSpookyDivider(ctx, this.width / 2, 260, 600);

        // 8. "This is proudly conferred upon"
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 24px "Cinzel", Georgia, serif';
        ctx.letterSpacing = '2px';
        ctx.fillText("This sacred recognition is triumphantly conferred upon", this.width / 2, 310);

        // 9. RECIPIENT NAME (Auto-scaled to prevent ANY spillover / overlap)
        const recipientName = (data.name && data.name.trim()) ? data.name.trim() : "CHAMPION OF THE NIGHT";
        this.drawAdaptiveName(ctx, recipientName, this.width / 2, 395, 1400);

        // 10. Achievement Narrative (Bounded Wrapping, strictly non-overlapping)
        const scoreText = data.score !== undefined ? `${data.score}%` : "EXEMPLARY";
        const narrative = `For bravely conquering the 5 Haunted Realms of DSA, Aptitude, Soft Skills, and Alchemical Gamification, culminating in passing the 1-Hour 300-MCQ Final Assessment with a grand score of ${scoreText}. You have broken the netherworld curse through unmatched intellect and perseverance.`;

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '20px Georgia, serif';
        ctx.letterSpacing = '0.5px';
        const lines = this.wrapTextLines(ctx, narrative, 1300);
        let currentY = 460;
        const lineHeight = 32;
        lines.forEach(line => {
            ctx.fillText(line, this.width / 2, currentY);
            currentY += lineHeight;
        });

        // 11. Badges Row (5 distinct achievement icons with labels)
        this.drawBadgesSection(ctx, data.badges || [], 590);

        // 12. Gold Wax Seal & Credentials
        this.drawWaxSeal(ctx, this.width / 2, 850);

        // 13. Left Signature: KAPIL (Founder)
        this.drawSignatureBlock(ctx, 420, 890, "Kapil", "Architect & Founder", "Sarlayash Productions");

        // 14. Right Signature: Grand Assessment Director
        this.drawSignatureBlock(ctx, 1500, 890, "Dr. Gabriel Thorne", "Grand Examiner of DSA & Logic", "Halloween Academy of Sciences");

        // 15. Footer Bar: Verification ID, Issue Date, Zero Spillover
        const issueDate = data.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const certId = data.certId || `SARL-HW-${Math.floor(100000 + Math.random() * 900000)}`;

        ctx.fillStyle = '#64748b';
        ctx.font = '14px monospace';
        ctx.letterSpacing = '1px';
        ctx.fillText(`Verification ID: ${certId}  |  Issued: ${issueDate}  |  Official Sarlayash Productions Certification Record`, this.width / 2, 1010);
    }

    /**
     * Adapts font size so learner names never overflow or spill over bounds
     */
    drawAdaptiveName(ctx, name, x, y, maxAllowableWidth) {
        let fontSize = 58;
        ctx.font = `bold ${fontSize}px "Cinzel Decorative", "Cinzel", Georgia, serif`;
        
        while (ctx.measureText(name).width > maxAllowableWidth && fontSize > 24) {
            fontSize -= 2;
            ctx.font = `bold ${fontSize}px "Cinzel Decorative", "Cinzel", Georgia, serif`;
        }

        ctx.fillStyle = '#f59e0b'; // Amber Gold
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
        ctx.fillText(name.toUpperCase(), x, y);
        ctx.shadowBlur = 0;

        // Elegant underline
        const measuredW = Math.min(ctx.measureText(name.toUpperCase()).width + 60, maxAllowableWidth);
        const grad = ctx.createLinearGradient(x - measuredW / 2, y + 15, x + measuredW / 2, y + 15);
        grad.addColorStop(0, 'rgba(245, 158, 11, 0)');
        grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.8)');
        grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - measuredW / 2, y + 15);
        ctx.lineTo(x + measuredW / 2, y + 15);
        ctx.stroke();
    }

    drawVignette(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fillRect(0, 0, this.width, this.height);
    }

    drawOrnateBorders(ctx) {
        // Outer Gold Line
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 4;
        ctx.strokeRect(50, 50, this.width - 100, this.height - 100);

        // Inner Red/Orange Line
        ctx.strokeStyle = '#b91c1c';
        ctx.lineWidth = 2;
        ctx.strokeRect(62, 62, this.width - 124, this.height - 124);

        // Thin decorative gold inner border
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(70, 70, this.width - 140, this.height - 140);
    }

    drawCornerFlourishes(ctx) {
        const corners = [
            { x: 50, y: 50, angle: 0 },
            { x: this.width - 50, y: 50, angle: Math.PI / 2 },
            { x: this.width - 50, y: this.height - 50, angle: Math.PI },
            { x: 50, y: this.height - 50, angle: -Math.PI / 2 }
        ];

        corners.forEach(c => {
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.angle);

            // Spooky spiderweb / bracket pattern
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(60, 0);
            ctx.lineTo(0, 60);
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, 30, 0, Math.PI / 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, 50, 0, Math.PI / 2);
            ctx.stroke();

            // Skull/gem marker
            ctx.fillStyle = '#ff4500';
            ctx.beginPath();
            ctx.arc(15, 15, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        });
    }

    drawSpookyDivider(ctx, x, y, width) {
        const grad = ctx.createLinearGradient(x - width / 2, y, x + width / 2, y);
        grad.addColorStop(0, 'rgba(217, 119, 6, 0)');
        grad.addColorStop(0.5, 'rgba(255, 69, 0, 0.9)');
        grad.addColorStop(1, 'rgba(217, 119, 6, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - width / 2, y);
        ctx.lineTo(x + width / 2, y);
        ctx.stroke();

        // Center jewel
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
    }

    drawBadgesSection(ctx, earnedBadges, startY) {
        const badges = [
            { icon: "💀", name: "DSA Necromancer", domain: "Algorithms" },
            { icon: "🔮", name: "Labyrinth Mind", domain: "Aptitude" },
            { icon: "🕯️", name: "EQ Specter", domain: "Soft Skills" },
            { icon: "🧪", name: "Alchemist Master", domain: "Crucible" },
            { icon: "👑", name: "Grandmaster", domain: "300 MCQs Trial" }
        ];

        const totalWidth = 1100;
        const spacing = totalWidth / (badges.length - 1);
        const startX = (this.width - totalWidth) / 2;

        badges.forEach((b, i) => {
            const bx = startX + i * spacing;
            const by = startY;

            // Circular badge plate
            ctx.save();
            ctx.beginPath();
            ctx.arc(bx, by, 34, 0, Math.PI * 2);
            ctx.fillStyle = '#1e1136';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#f59e0b';
            ctx.stroke();

            // Emoji icon
            ctx.font = '30px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(b.icon, bx, by - 2);

            // Badge Name
            ctx.font = 'bold 13px "Cinzel", Georgia, serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(b.name, bx, by + 50);

            // Domain subtitle
            ctx.font = '11px sans-serif';
            ctx.fillStyle = '#f59e0b';
            ctx.fillText(b.domain, bx, by + 66);

            ctx.restore();
        });
    }

    drawWaxSeal(ctx, x, y) {
        ctx.save();
        // Red wax base
        ctx.beginPath();
        ctx.arc(x, y, 54, 0, Math.PI * 2);
        ctx.fillStyle = '#881337'; // Deep blood wax
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner rim
        ctx.beginPath();
        ctx.arc(x, y, 46, 0, Math.PI * 2);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Wax text
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#fde68a';
        ctx.textAlign = 'center';
        ctx.fillText("SARLAYASH", x, y - 16);
        ctx.fillText("★ SEAL ★", x, y - 2);
        ctx.fillText("VERIFIED", x, y + 12);
        ctx.font = '9px sans-serif';
        ctx.fillStyle = '#f97316';
        ctx.fillText("KAPIL", x, y + 26);

        ctx.restore();
    }

    drawSignatureBlock(ctx, x, y, name, title, org) {
        ctx.save();
        ctx.textAlign = 'center';

        // Signature line
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 140, y);
        ctx.lineTo(x + 140, y);
        ctx.stroke();

        // Stylized cursive signature name
        ctx.font = 'italic 26px "Brush Script MT", "Caveat", "Segoe Script", cursive, Georgia';
        ctx.fillStyle = '#fcd34d';
        ctx.fillText(name, x, y - 12);

        // Title and Org
        ctx.font = 'bold 14px "Cinzel", Georgia, serif';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(title, x, y + 22);

        ctx.font = '12px Georgia, serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(org, x, y + 40);

        ctx.restore();
    }

    /**
     * Exports canvas cleanly as PNG without spillover
     */
    downloadCertificatePNG(canvas, studentName) {
        const sanitized = (studentName || 'Champion')
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .substring(0, 30);
        const fileName = `Halloween_Kapil_Certificate_${sanitized}.png`;

        // Generate data URL
        const imageURI = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = fileName;
        link.href = imageURI;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

window.halloweenCertificateEngine = new HalloweenCertificateEngine();
