/* ============================================
   VALORANT PORTFOLIO - MAIN
   ============================================ */

// Custom Cursor
class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor-wrapper');
        this.crosshair = document.querySelector('.cursor-crosshair');
        this.ring = document.querySelector('.cursor-ring');
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.isActive = true;

        this.init();
    }

    init() {
        // Check for touch device
        if (window.matchMedia('(pointer: coarse)').matches) {
            this.isActive = false;
            if (this.cursor) {
                this.cursor.style.display = 'none';
            }
            document.body.style.cursor = 'auto';
            return;
        }

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Smooth cursor follow
        this.animate();

        // Hover effects
        this.initHoverEffects();

        // Click effects
        document.addEventListener('mousedown', () => {
            document.body.classList.add('cursor-click');
            this.recoil();
        });

        document.addEventListener('mouseup', () => {
            document.body.classList.remove('cursor-click');
        });
    }

    animate() {
        if (!this.isActive) return;

        // Smooth interpolation
        this.cursorX += (this.mouseX - this.cursorX) * 0.15;
        this.cursorY += (this.mouseY - this.cursorY) * 0.15;

        if (this.cursor) {
            this.cursor.style.left = `${this.cursorX}px`;
            this.cursor.style.top = `${this.cursorY}px`;
        }

        requestAnimationFrame(() => this.animate());
    }

    initHoverEffects() {
        const hoverElements = document.querySelectorAll('a, button, .btn, input, textarea, .mission-card, .ability-card, .skill-item, .hud-checkpoint, .hud-chat-input, .footer-hud-overlay');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });

            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    recoil() {
        if (!this.isActive || !this.crosshair) return;

        // Recoil animation
        gsap.to(this.crosshair, {
            scale: 0.7,
            duration: 0.05,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out'
        });

        // Ring expansion
        gsap.to(this.ring, {
            scale: 1.5,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
                gsap.set(this.ring, { scale: 1, opacity: 0 });
            }
        });

        if (typeof soundManager !== 'undefined') {
            soundManager.playClick();
        }
    }
}

// Mobile Menu
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    const links = document.querySelectorAll('.mobile-nav-links a');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        toggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');

        // Animate hamburger
        const spans = toggle.querySelectorAll('span');
        if (toggle.classList.contains('active')) {
            gsap.to(spans[0], { rotate: 45, y: 8, duration: 0.3 });
            gsap.to(spans[1], { opacity: 0, duration: 0.3 });
            gsap.to(spans[2], { rotate: -45, y: -8, duration: 0.3 });
        } else {
            gsap.to(spans[0], { rotate: 0, y: 0, duration: 0.3 });
            gsap.to(spans[1], { opacity: 1, duration: 0.3 });
            gsap.to(spans[2], { rotate: 0, y: 0, duration: 0.3 });
        }
    });

    // Close menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            document.body.classList.remove('menu-open');

            const spans = toggle.querySelectorAll('span');
            gsap.to(spans[0], { rotate: 0, y: 0, duration: 0.3 });
            gsap.to(spans[1], { opacity: 1, duration: 0.3 });
            gsap.to(spans[2], { rotate: 0, y: 0, duration: 0.3 });
        });
    });
}

// Project Modals
function initProjectModals() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.querySelector('.modal-close');
    const missionBtns = document.querySelectorAll('.mission-btn');

    if (!modalOverlay || !modalContent) return;

    missionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.closest('.mission-card').dataset.project;
            const project = projectsData[projectId];

            if (project) {
                openModal(project);
            }
        });
    });

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    function openModal(project) {
        modalContent.innerHTML = `
            <div class="modal-header">
                <span class="modal-code">${project.code}</span>
                <h2 class="modal-title">${project.title}</h2>
            </div>
            <p class="modal-description">${project.description}</p>
            <div class="modal-tech">
                ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
            <div class="modal-features">
                <h3 style="font-family: var(--font-display); font-size: 1rem; margin-bottom: 12px; color: var(--val-white);">KEY FEATURES</h3>
                <ul style="list-style: none; padding: 0;">
                    ${project.features.map(f => `
                        <li style="padding: 8px 0; color: var(--val-light-grey); border-bottom: 1px solid var(--val-dark-light);">
                            <i class="fas fa-check" style="color: var(--val-red); margin-right: 12px;"></i>${f}
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="modal-actions">
                <a href="${project.github}" class="btn btn-primary" target="_blank">
                    <span class="btn-text">VIEW CODE</span>
                    <span class="btn-icon"><i class="fab fa-github"></i></span>
                </a>
                <a href="${project.demo}" class="btn btn-secondary" target="_blank">
                    <span class="btn-text">LIVE DEMO</span>
                    <span class="btn-icon"><i class="fas fa-external-link-alt"></i></span>
                </a>
            </div>
        `;

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (typeof soundManager !== 'undefined') {
            soundManager.playTerminal();
        }
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';

        if (typeof soundManager !== 'undefined') {
            soundManager.playClick();
        }
    }
}

// Contact Form with VALORANT-style Transmit
function initContactForm() {
    const form = document.getElementById('contactForm');
    const transmitBtn = document.getElementById('transmitBtn');
    const transmitText = document.getElementById('transmitText');
    const transmitIcon = document.getElementById('transmitIcon');
    const transmitProgress = document.getElementById('transmitProgress');
    const transmitStatus = document.getElementById('transmitStatus');
    const transmitContainer = document.querySelector('.transmit-container');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Start transmission animation
        transmitContainer.classList.add('transmitting');
        transmitStatus.classList.add('transmitting');
        transmitBtn.disabled = true;
        
        // Update button text
        transmitText.textContent = 'TRANSMITTING...';
        transmitIcon.innerHTML = '<i class="fas fa-satellite-dish fa-spin"></i>';
        
        // Update status
        const statusText = transmitStatus.querySelector('.status-text');
        statusText.textContent = 'ESTABLISHING UPLINK...';

        if (typeof soundManager !== 'undefined') {
            soundManager.playTerminal();
        }

        // Animate progress bar
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            transmitProgress.style.width = progress + '%';
            
            // Update status text based on progress
            if (progress < 30) {
                statusText.textContent = 'ENCRYPTING DATA...';
            } else if (progress < 60) {
                statusText.textContent = 'UPLOADING PACKET...';
            } else if (progress < 90) {
                statusText.textContent = 'VERIFYING INTEGRITY...';
            } else {
                statusText.textContent = 'FINALIZING...';
            }
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                completeTransmission();
            }
        }, 200);

        function completeTransmission() {
            setTimeout(() => {
                transmitContainer.classList.remove('transmitting');
                transmitStatus.classList.remove('transmitting');
                transmitStatus.classList.add('success');
                
                transmitText.textContent = 'TRANSMISSION COMPLETE';
                transmitIcon.innerHTML = '<i class="fas fa-check"></i>';
                transmitBtn.style.background = 'var(--hud-green)';
                transmitBtn.style.borderColor = 'var(--hud-green)';
                
                statusText.textContent = 'MESSAGE DELIVERED SUCCESSFULLY';

                if (typeof soundManager !== 'undefined') {
                    soundManager.playSuccess();
                }

                // Reset after delay
                setTimeout(() => {
                    transmitStatus.classList.remove('success');
                    transmitText.textContent = 'INITIATE TRANSMISSION';
                    transmitIcon.innerHTML = '<i class="fas fa-satellite-dish"></i>';
                    transmitBtn.style.background = '';
                    transmitBtn.style.borderColor = '';
                    transmitBtn.disabled = false;
                    transmitProgress.style.width = '0%';
                    statusText.textContent = 'READY TO TRANSMIT';
                    form.reset();
                }, 3000);
            }, 500);
        }
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 70; // Account for fixed nav
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                if (typeof soundManager !== 'undefined') {
                    soundManager.playClick();
                }
            }
        });
    });
}

// Glitch effect on hover for name
function initGlitchEffect() {
    const nameLines = document.querySelectorAll('.name-line');

    nameLines.forEach(line => {
        line.addEventListener('mouseenter', () => {
            line.classList.add('glitch');
            line.setAttribute('data-text', line.textContent);

            if (typeof soundManager !== 'undefined') {
                soundManager.playGlitch();
            }
        });

        line.addEventListener('mouseleave', () => {
            setTimeout(() => {
                line.classList.remove('glitch');
            }, 300);
        });
    });
}

// Ability card VALORANT-style click animation with transmit button
function initAbilityCards() {
    const cards = document.querySelectorAll('.ability-card');

    cards.forEach(card => {
        const activateBtn = card.querySelector('.btn-ability');
        const activateContainer = card.querySelector('.ability-activate');
        const progressBar = card.querySelector('.activate-progress');
        
        if (activateBtn) {
            activateBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Remove active class from all cards
                cards.forEach(c => {
                    c.classList.remove('ability-active');
                    const btn = c.querySelector('.btn-ability');
                    if (btn) {
                        btn.classList.remove('activated');
                        btn.querySelector('.btn-text').textContent = 'ACTIVATE';
                    }
                });
                
                // Add active class to clicked card
                card.classList.add('ability-active');
                activateContainer.classList.add('activating');
                activateBtn.disabled = true;
                
                // Animate progress bar
                let progress = 0;
                const progressInterval = setInterval(() => {
                    progress += Math.random() * 20;
                    if (progress > 100) progress = 100;
                    progressBar.style.width = progress + '%';
                    
                    if (progress >= 100) {
                        clearInterval(progressInterval);
                        completeActivation();
                    }
                }, 100);
                
                function completeActivation() {
                    activateContainer.classList.remove('activating');
                    activateBtn.classList.add('activated');
                    activateBtn.querySelector('.btn-text').textContent = 'ACTIVE';
                    activateBtn.disabled = false;
                    
                    // Flash effect
                    gsap.fromTo(card, 
                        { boxShadow: '0 0 0 transparent' },
                        { 
                            boxShadow: '0 0 60px var(--val-red-glow), inset 0 0 30px rgba(255, 70, 85, 0.3)',
                            duration: 0.2,
                            yoyo: true,
                            repeat: 1
                        }
                    );
                    
                    // Key animation
                    const key = card.querySelector('.ability-key');
                    gsap.to(key, {
                        scale: 0.9,
                        background: 'var(--hud-green)',
                        borderColor: 'var(--hud-green)',
                        color: 'var(--val-black)',
                        duration: 0.2
                    });
                    
                    // Create particle burst
                    createAbilityParticles(card);
                    
                    if (typeof soundManager !== 'undefined') {
                        soundManager.playSuccess();
                    }
                }
            });
        }
        
        // Card click creates bullet trace
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking the button
            if (e.target.closest('.btn-ability')) return;
            
            createBulletTrace(e.clientX, e.clientY);
        });
    });
}

// Create bullet trace effect
function createBulletTrace(targetX, targetY) {
    // Get a random starting position from the edges
    const edges = ['top', 'right', 'bottom', 'left'];
    const startEdge = edges[Math.floor(Math.random() * edges.length)];
    
    let startX, startY;
    const offset = 100;
    
    switch(startEdge) {
        case 'top':
            startX = Math.random() * window.innerWidth;
            startY = -offset;
            break;
        case 'right':
            startX = window.innerWidth + offset;
            startY = Math.random() * window.innerHeight;
            break;
        case 'bottom':
            startX = Math.random() * window.innerWidth;
            startY = window.innerHeight + offset;
            break;
        case 'left':
            startX = -offset;
            startY = Math.random() * window.innerHeight;
            break;
    }
    
    // Calculate angle and distance
    const deltaX = targetX - startX;
    const deltaY = targetY - startY;
    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Create bullet trace
    const trace = document.createElement('div');
    trace.className = 'bullet-trace';
    trace.style.cssText = `
        left: ${startX}px;
        top: ${startY}px;
        width: ${distance}px;
        transform: rotate(${angle}rad);
    `;
    document.body.appendChild(trace);
    
    // Create muzzle flash at start
    const muzzleFlash = document.createElement('div');
    muzzleFlash.className = 'muzzle-flash';
    muzzleFlash.style.left = startX + 'px';
    muzzleFlash.style.top = startY + 'px';
    document.body.appendChild(muzzleFlash);
    
    // Animate bullet trace
    requestAnimationFrame(() => {
        trace.classList.add('fade-out');
    });
    
    // Play sound
    if (typeof soundManager !== 'undefined') {
        soundManager.playClick();
    }
    
    // Cleanup
    setTimeout(() => {
        trace.remove();
        muzzleFlash.remove();
    }, 300);
}

function createAbilityParticles(card) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: var(--val-red);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${centerX}px;
            top: ${centerY}px;
        `;
        document.body.appendChild(particle);
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 100 + Math.random() * 50;
        
        gsap.to(particle, {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            opacity: 0,
            scale: 0,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => particle.remove()
        });
    }
}

// Skill item hover effect
function initSkillItems() {
    const skillItems = document.querySelectorAll('.skill-item');

    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const fill = item.querySelector('.skill-fill');
            if (fill) {
                gsap.to(fill, {
                    filter: 'brightness(1.3)',
                    duration: 0.3
                });
            }
        });

        item.addEventListener('mouseleave', () => {
            const fill = item.querySelector('.skill-fill');
            if (fill) {
                gsap.to(fill, {
                    filter: 'brightness(1)',
                    duration: 0.3
                });
            }
        });
    });
}

// Navigation visibility on scroll
function initNavVisibility() {
    const nav = document.querySelector('.main-nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.style.background = 'rgba(15, 20, 25, 0.98)';
        } else {
            nav.style.background = 'rgba(15, 20, 25, 0.9)';
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

// Aim Trainer Game
class AimTrainer {
    constructor() {
        this.gameArea = document.getElementById('gameArea');
        this.gameOverlay = document.getElementById('gameOverlay');
        this.startBtn = document.getElementById('startGameBtn');
        this.scoreEl = document.getElementById('scoreValue');
        this.timeEl = document.getElementById('timeValue');
        this.accuracyEl = document.getElementById('accuracyValue');
        
        this.score = 0;
        this.timeLeft = 30;
        this.hits = 0;
        this.misses = 0;
        this.isPlaying = false;
        this.timer = null;
        this.targetTimer = null;
        
        this.init();
    }
    
    init() {
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.startGame());
        }
        
        if (this.gameArea) {
            this.gameArea.addEventListener('mousedown', (e) => this.handleClick(e));
            this.gameArea.addEventListener('mousemove', (e) => this.updateCrosshair(e));
        }
    }
    
    startGame() {
        this.score = 0;
        this.timeLeft = 30;
        this.hits = 0;
        this.misses = 0;
        this.isPlaying = true;
        
        this.updateUI();
        this.gameOverlay.classList.add('hidden');
        this.startBtn.innerHTML = '<span class="btn-text">MISSION ACTIVE</span><span class="btn-icon"><i class="fas fa-spinner fa-spin"></i></span>';
        this.startBtn.disabled = true;
        
        // Clear any existing targets
        this.clearTargets();
        
        // Start spawning targets
        this.spawnTarget();
        this.targetTimer = setInterval(() => this.spawnTarget(), 800);
        
        // Start timer
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateUI();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
        
        if (typeof soundManager !== 'undefined') {
            soundManager.playSuccess();
        }
    }
    
    spawnTarget() {
        if (!this.isPlaying) return;
        
        // Remove old targets if too many
        const existingTargets = this.gameArea.querySelectorAll('.game-target');
        if (existingTargets.length >= 3) {
            existingTargets[0].remove();
        }
        
        const target = document.createElement('div');
        target.className = 'game-target';
        
        const maxX = this.gameArea.clientWidth - 60;
        const maxY = this.gameArea.clientHeight - 60;
        
        target.style.left = Math.random() * maxX + 'px';
        target.style.top = Math.random() * maxY + 'px';
        
        this.gameArea.appendChild(target);
        
        // Auto-remove target after 2 seconds
        setTimeout(() => {
            if (target.parentNode) {
                target.style.transform = 'scale(0)';
                setTimeout(() => target.remove(), 300);
            }
        }, 2000);
    }
    
    handleClick(e) {
        if (!this.isPlaying) return;
        
        const target = e.target.closest('.game-target');
        const rect = this.gameArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Create bullet trace from edge to click point
        const clickX = e.clientX;
        const clickY = e.clientY;
        
        // Get random start position from edge
        const edges = ['top', 'right', 'bottom', 'left'];
        const startEdge = edges[Math.floor(Math.random() * edges.length)];
        let startX, startY;
        const offset = 50;
        
        switch(startEdge) {
            case 'top':
                startX = rect.left + Math.random() * rect.width;
                startY = rect.top - offset;
                break;
            case 'right':
                startX = rect.right + offset;
                startY = rect.top + Math.random() * rect.height;
                break;
            case 'bottom':
                startX = rect.left + Math.random() * rect.width;
                startY = rect.bottom + offset;
                break;
            case 'left':
                startX = rect.left - offset;
                startY = rect.top + Math.random() * rect.height;
                break;
        }
        
        // Create bullet trace within game area
        this.createGameBulletTrace(startX, startY, clickX, clickY);
        
        if (target) {
            // Hit!
            this.hits++;
            this.score += 100;
            
            // Create hit effect
            this.createHitEffect(x, y);
            
            // Create score popup
            this.createScorePopup(x, y);
            
            // Remove target
            target.style.transform = 'scale(1.5)';
            target.style.opacity = '0';
            setTimeout(() => target.remove(), 200);
            
            if (typeof soundManager !== 'undefined') {
                soundManager.playClick();
            }
        } else {
            // Miss
            this.misses++;
            this.createMissEffect(x, y);
            
            if (typeof soundManager !== 'undefined') {
                soundManager.playGlitch();
            }
        }
        
        this.updateUI();
    }
    
    createGameBulletTrace(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        const trace = document.createElement('div');
        trace.className = 'bullet-trace';
        trace.style.cssText = `
            left: ${startX}px;
            top: ${startY}px;
            width: ${distance}px;
            transform: rotate(${angle}rad);
            z-index: 100;
        `;
        this.gameArea.appendChild(trace);
        
        // Muzzle flash
        const flash = document.createElement('div');
        flash.className = 'muzzle-flash';
        flash.style.left = startX + 'px';
        flash.style.top = startY + 'px';
        flash.style.zIndex = '99';
        this.gameArea.appendChild(flash);
        
        requestAnimationFrame(() => {
            trace.classList.add('fade-out');
        });
        
        setTimeout(() => {
            trace.remove();
            flash.remove();
        }, 300);
    }
    
    createHitEffect(x, y) {
        const effect = document.createElement('div');
        effect.className = 'hit-effect';
        effect.style.left = x + 'px';
        effect.style.top = y + 'px';
        this.gameArea.appendChild(effect);
        setTimeout(() => effect.remove(), 400);
    }
    
    createMissEffect(x, y) {
        const effect = document.createElement('div');
        effect.className = 'miss-effect';
        effect.style.left = x + 'px';
        effect.style.top = y + 'px';
        this.gameArea.appendChild(effect);
        setTimeout(() => effect.remove(), 300);
    }
    
    createScorePopup(x, y) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = '+100';
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
        this.gameArea.appendChild(popup);
        setTimeout(() => popup.remove(), 800);
    }
    
    updateCrosshair(e) {
        const crosshair = document.getElementById('gameCrosshair');
        if (crosshair && this.isPlaying) {
            crosshair.style.left = e.clientX - 20 + 'px';
            crosshair.style.top = e.clientY - 20 + 'px';
            crosshair.classList.add('active');
        }
    }
    
    updateUI() {
        this.scoreEl.textContent = this.score;
        this.timeEl.textContent = this.timeLeft;
        
        const total = this.hits + this.misses;
        const accuracy = total > 0 ? Math.round((this.hits / total) * 100) : 100;
        this.accuracyEl.textContent = accuracy + '%';
        
        // Add accent color when time is low
        if (this.timeLeft <= 5) {
            this.timeEl.classList.add('accent');
        } else {
            this.timeEl.classList.remove('accent');
        }
    }
    
    clearTargets() {
        const targets = this.gameArea.querySelectorAll('.game-target');
        targets.forEach(t => t.remove());
    }
    
    endGame() {
        this.isPlaying = false;
        clearInterval(this.timer);
        clearInterval(this.targetTimer);
        
        this.clearTargets();
        
        const accuracy = this.hits + this.misses > 0 
            ? Math.round((this.hits / (this.hits + this.misses)) * 100) 
            : 0;
        
        // Show results
        this.gameOverlay.innerHTML = `
            <div class="game-results">
                <h3>MISSION COMPLETE</h3>
                <div class="final-score">${this.score}</div>
                <div class="final-accuracy">ACCURACY: ${accuracy}% | HITS: ${this.hits}</div>
                <button class="btn btn-primary" onclick="location.reload()">
                    <span class="btn-text">PLAY AGAIN</span>
                    <span class="btn-icon"><i class="fas fa-redo"></i></span>
                </button>
            </div>
        `;
        this.gameOverlay.classList.remove('hidden');
        
        this.startBtn.innerHTML = '<span class="btn-text">START MISSION</span><span class="btn-icon"><i class="fas fa-play"></i></span>';
        this.startBtn.disabled = false;
        
        if (typeof soundManager !== 'undefined') {
            soundManager.playSuccess();
        }
    }
}

// Compact Chat Bar (VALORANT Style)
class CompactChatBar {
    constructor() {
        this.container = document.getElementById('compactChatBar');
        this.messagesContainer = document.getElementById('chatBarMessages');
        this.input = document.getElementById('chatBarInput');
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.init();
    }
    
    init() {
        // Input handling
        this.input.addEventListener('keydown', (e) => this.handleInput(e));
        
        // Focus on click
        this.container.addEventListener('click', () => {
            this.input.focus();
        });
        
        // Welcome message
        this.addMessage('SYSTEM', 'Welcome! Type /help for commands.', 'system');
    }
    
    handleInput(e) {
        if (e.key === 'Enter') {
            const text = this.input.value.trim();
            if (text) {
                this.commandHistory.push(text);
                this.historyIndex = this.commandHistory.length;
                
                if (text.startsWith('/')) {
                    this.handleCommand(text);
                } else {
                    this.addMessage('You', text);
                }
                
                this.input.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory(1);
        }
    }
    
    handleCommand(command) {
        const cmd = command.toLowerCase().split(' ')[0];
        const args = command.split(' ').slice(1);
        
        switch(cmd) {
            case '/help':
                this.addMessage('SYSTEM', '/goto [section] - Navigate to section', 'system');
                this.addMessage('SYSTEM', 'Sections: hero, about, skills, projects, cv, contact', 'system');
                break;
            case '/goto':
                if (args.length > 0) {
                    const section = args[0].toLowerCase();
                    const element = document.getElementById(section);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                        this.addMessage('SYSTEM', `Navigating to ${section}...`, 'system');
                    } else {
                        this.addMessage('SYSTEM', `Section "${section}" not found`, 'system');
                    }
                } else {
                    this.addMessage('SYSTEM', 'Usage: /goto [section]', 'system');
                }
                break;
            case '/skills':
                this.navigateTo('skills');
                break;
            case '/projects':
                this.navigateTo('projects');
                break;
            case '/contact':
                this.navigateTo('contact');
                break;
            case '/about':
                this.navigateTo('about');
                break;
            case '/cv':
                this.navigateTo('cv');
                break;
            case '/aim':
                const aimGame = document.getElementById('aimGame');
                if (aimGame) {
                    aimGame.classList.add('active');
                    this.addMessage('SYSTEM', 'Aim Trainer activated!', 'system');
                }
                break;
            case '/clear':
                this.messagesContainer.innerHTML = '';
                this.addMessage('SYSTEM', 'Chat cleared', 'system');
                break;
            default:
                this.addMessage('SYSTEM', `Unknown: ${cmd}. Try /help`, 'system');
        }
    }
    
    navigateTo(section) {
        const element = document.getElementById(section);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            this.addMessage('SYSTEM', `Navigating to ${section}...`, 'system');
        }
    }
    
    addMessage(sender, text, type = 'normal') {
        const message = document.createElement('div');
        message.className = 'chat-bar-message';
        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        
        message.innerHTML = `
            <span class="chat-bar-msg-time">[${time}]</span>
            <span class="chat-bar-msg-sender ${type}">${sender}:</span>
            <span class="chat-bar-msg-text">${this.escapeHtml(text)}</span>
        `;
        
        this.messagesContainer.appendChild(message);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        // Keep only last 5 messages
        while (this.messagesContainer.children.length > 5) {
            this.messagesContainer.removeChild(this.messagesContainer.firstChild);
        }
    }
    
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
            return;
        }
        
        this.input.value = this.commandHistory[this.historyIndex];
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Mission Progress System
class MissionProgress {
    constructor() {
        this.sections = ['about', 'skills', 'services', 'projects', 'aim-trainer', 'cv', 'contact'];
        this.unlockedSections = new Set(['about']);
        this.progressBar = null;
        this.init();
    }
    
    init() {
        this.createProgressUI();
        this.setupScrollListener();
        this.checkUnlocks();
    }
    
    createProgressUI() {
        const hudContainer = document.createElement('div');
        hudContainer.className = 'footer-hud-overlay';
        hudContainer.innerHTML = `
            <div class="hud-left">
                <div class="hud-location">
                    <span class="hud-loc-label">LOC</span>
                    <span class="hud-loc-value" id="hudLocation">SPAWN</span>
                </div>
                <div class="hud-kill-feed" id="hudKillFeed">
                    <span class="hud-killer">Aryan</span>
                    <i class="fas fa-code"></i>
                    <span class="hud-victim">Bugs</span>
                </div>
            </div>
            <div class="hud-center">
                <div class="hud-progress-section">
                    <div class="hud-progress-header">
                        <span class="hud-progress-title">MISSION PROGRESS</span>
                        <span class="hud-progress-percent" id="missionProgressPercent">0%</span>
                    </div>
                    <div class="hud-progress-bar">
                        <div class="hud-progress-fill" id="missionProgressFill"></div>
                    </div>
                    <div class="hud-checkpoints">
                        ${this.sections.map((section, i) => `
                            <div class="hud-checkpoint" data-section="${section}" data-index="${i}" title="${section.toUpperCase()}">
                                <span class="hud-checkpoint-dot"></span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="hud-right">
                <div class="hud-chat">
                    <div class="hud-chat-messages" id="hudChatMessages"></div>
                    <div class="hud-chat-input">
                        <span class="hud-chat-prefix">></span>
                        <input type="text" id="hudChatInput" placeholder="Type /help" autocomplete="off" spellcheck="false">
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(hudContainer);
        
        this.progressBar = document.getElementById('missionProgressFill');
        this.progressPercent = document.getElementById('missionProgressPercent');
        this.hudLocation = document.getElementById('hudLocation');
        this.hudKillFeed = document.getElementById('hudKillFeed');
        
        // Setup HUD features with small delay to ensure DOM is ready
        setTimeout(() => {
            this.setupLocationUpdates();
            this.setupKillFeed();
            this.setupHUDChat();
            this.setupCheckpointClicks();
        }, 100);
    }
    
    setupLocationUpdates() {
        const sectionNames = {
            'hero': 'SPAWN',
            'about': 'DOSSIER',
            'skills': 'LOADOUT',
            'services': 'ABILITIES',
            'projects': 'MISSIONS',
            'cv': 'CAREER',
            'contact': 'COMMS'
        };
        
        const updateLocation = () => {
            const scrollPos = window.scrollY + window.innerHeight / 2;
            let currentSection = 'hero';
            
            for (const sectionId of ['hero', 'about', 'skills', 'services', 'projects', 'cv', 'contact']) {
                const section = document.getElementById(sectionId);
                if (section) {
                    const top = section.offsetTop;
                    const bottom = top + section.offsetHeight;
                    if (scrollPos >= top && scrollPos < bottom) {
                        currentSection = sectionId;
                        break;
                    }
                }
            }
            
            if (this.hudLocation) {
                this.hudLocation.textContent = sectionNames[currentSection] || 'SPAWN';
            }
            
            // Update checkpoint dots
            document.querySelectorAll('.hud-checkpoint').forEach(cp => {
                cp.classList.toggle('active', cp.dataset.section === currentSection);
            });
        };
        
        window.addEventListener('scroll', updateLocation, { passive: true });
        updateLocation();
    }
    
    setupKillFeed() {
        const messages = [
            { killer: 'Aryan', weapon: 'fa-code', victim: 'Bugs' },
            { killer: 'Aryan', weapon: 'fa-database', victim: 'Data Issues' },
            { killer: 'Aryan', weapon: 'fa-rocket', victim: 'Slow Performance' },
            { killer: 'Aryan', weapon: 'fa-shield-alt', victim: 'Security Flaws' },
            { killer: 'Aryan', weapon: 'fa-laptop-code', victim: 'Full Stack' },
            { killer: 'Aryan', weapon: 'fa-chart-line', victim: 'Data Model' },
            { killer: 'Aryan', weapon: 'fa-bug', victim: 'Production Error' }
        ];
        
        let messageIndex = 0;
        
        setInterval(() => {
            if (!this.hudKillFeed) return;
            
            const msg = messages[messageIndex % messages.length];
            messageIndex++;
            
            this.hudKillFeed.innerHTML = `
                <span class="hud-killer">${msg.killer}</span>
                <i class="fas ${msg.weapon}"></i>
                <span class="hud-victim">${msg.victim}</span>
            `;
            this.hudKillFeed.classList.remove('active');
            void this.hudKillFeed.offsetWidth;
            this.hudKillFeed.classList.add('active');
        }, 5000);
    }
    
    setupHUDChat() {
        const input = document.getElementById('hudChatInput');
        const messagesContainer = document.getElementById('hudChatMessages');
        
        if (!input || !messagesContainer) {
            console.error('Chat elements not found');
            return;
        }
        
        const commandHistory = [];
        let historyIndex = -1;
        
        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };
        
        const addMessage = (sender, text, type = 'normal') => {
            const message = document.createElement('div');
            message.className = 'hud-chat-message';
            const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
            
            message.innerHTML = `
                <span class="hud-chat-time">[${time}]</span>
                <span class="hud-chat-sender ${type}">${escapeHtml(sender)}:</span>
                <span class="hud-chat-text">${escapeHtml(text)}</span>
            `;
            
            messagesContainer.appendChild(message);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            while (messagesContainer.children.length > 3) {
                messagesContainer.removeChild(messagesContainer.firstChild);
            }
        };
        
        const handleCommand = (command) => {
            const cmd = command.toLowerCase().split(' ')[0];
            const args = command.split(' ').slice(1);
            
            const sectionMap = {
                'home': 'hero',
                'hero': 'hero',
                'about': 'about',
                'dossier': 'about',
                'skills': 'skills',
                'loadout': 'skills',
                'services': 'services',
                'abilities': 'services',
                'projects': 'projects',
                'missions': 'projects',
                'cv': 'cv',
                'career': 'cv',
                'contact': 'contact',
                'comms': 'contact'
            };
            
            switch(cmd) {
                case '/help':
                    addMessage('SYSTEM', '━━ COMMANDS ━━', 'system');
                    addMessage('SYSTEM', '/goto [section] - Navigate to section', 'system');
                    addMessage('SYSTEM', '/home, /about, /skills, /projects', 'system');
                    addMessage('SYSTEM', '/cv, /contact, /aim, /clear', 'system');
                    break;
                    
                case '/goto':
                    if (args.length > 0) {
                        const target = args[0].toLowerCase();
                        const sectionId = sectionMap[target] || target;
                        const element = document.getElementById(sectionId);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                            addMessage('SYSTEM', `Navigating to ${target.toUpperCase()}...`, 'system');
                        } else {
                            addMessage('SYSTEM', `Section "${target}" not found`, 'system');
                        }
                    } else {
                        addMessage('SYSTEM', 'Usage: /goto [section]', 'system');
                    }
                    break;
                    
                case '/home':
                case '/hero':
                    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
                    addMessage('SYSTEM', 'Navigating to SPAWN...', 'system');
                    break;
                    
                case '/about':
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                    addMessage('SYSTEM', 'Navigating to DOSSIER...', 'system');
                    break;
                    
                case '/skills':
                    document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
                    addMessage('SYSTEM', 'Navigating to LOADOUT...', 'system');
                    break;
                    
                case '/services':
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                    addMessage('SYSTEM', 'Navigating to ABILITIES...', 'system');
                    break;
                    
                case '/projects':
                    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                    addMessage('SYSTEM', 'Navigating to MISSIONS...', 'system');
                    break;
                    
                case '/cv':
                    document.getElementById('cv')?.scrollIntoView({ behavior: 'smooth' });
                    addMessage('SYSTEM', 'Navigating to CAREER...', 'system');
                    break;
                    
                case '/contact':
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    addMessage('SYSTEM', 'Navigating to COMMS...', 'system');
                    break;
                    
                case '/aim':
                case '/range':
                    const aimGame = document.getElementById('aimGame');
                    if (aimGame) {
                        aimGame.classList.add('active');
                        addMessage('SYSTEM', 'Aim Trainer activated!', 'system');
                    } else {
                        document.getElementById('aim-trainer')?.scrollIntoView({ behavior: 'smooth' });
                        addMessage('SYSTEM', 'Navigating to RANGE...', 'system');
                    }
                    break;
                    
                case '/clear':
                    messagesContainer.innerHTML = '';
                    addMessage('SYSTEM', 'Chat cleared', 'system');
                    break;
                    
                default:
                    addMessage('SYSTEM', `Unknown: "${cmd}". Type /help`, 'system');
            }
        };
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const text = input.value.trim();
                if (text) {
                    commandHistory.push(text);
                    historyIndex = commandHistory.length;
                    
                    if (text.startsWith('/')) {
                        handleCommand(text);
                    } else {
                        addMessage('You', text);
                    }
                    input.value = '';
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    input.value = commandHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    input.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    input.value = '';
                }
            }
        });
        
        // Focus input when clicking on chat area
        const chatContainer = input.closest('.hud-chat');
        if (chatContainer) {
            chatContainer.addEventListener('click', (e) => {
                if (e.target !== input) {
                    input.focus();
                }
            });
        }
        
        // Global Enter key to focus chat (when not in input)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && document.activeElement !== input) {
                const tagName = document.activeElement?.tagName;
                if (tagName !== 'INPUT' && tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    input.focus();
                }
            }
        });
        
        // Welcome message
        addMessage('SYSTEM', 'Welcome! Type /help', 'system');
        console.log('HUD Chat initialized successfully');
    }
    
    setupCheckpointClicks() {
        document.querySelectorAll('.hud-checkpoint').forEach(cp => {
            cp.addEventListener('click', () => {
                const section = cp.dataset.section;
                document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
    

    setupScrollListener() {
        window.addEventListener('scroll', () => {
            this.updateProgress();
            this.checkUnlocks();
        }, { passive: true });
    }
    
    updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(100, Math.round((scrollTop / docHeight) * 100));
        
        if (this.progressBar) {
            this.progressBar.style.width = progress + '%';
        }
        if (this.progressPercent) {
            this.progressPercent.textContent = progress + '%';
        }
    }
    
    checkUnlocks() {
        this.sections.forEach(section => {
            const el = document.getElementById(section);
            const checkpoint = document.querySelector(`.checkpoint[data-section="${section}"]`);
            
            if (el && checkpoint) {
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight * 0.7;
                
                if (isVisible && !this.unlockedSections.has(section)) {
                    this.unlockSection(section, checkpoint);
                }
            }
        });
    }
    
    unlockSection(section, checkpoint) {
        this.unlockedSections.add(section);
        checkpoint.classList.add('unlocked');
        
        // Animation
        gsap.fromTo(checkpoint.querySelector('.checkpoint-dot'),
            { scale: 0 },
            { scale: 1, duration: 0.5, ease: 'back.out(2)' }
        );
        
        // Sound
        if (typeof soundManager !== 'undefined') {
            soundManager.playSuccess();
        }
    }
}

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize custom cursor
    new CustomCursor();

    // Initialize mobile menu
    initMobileMenu();

    // Initialize project modals
    initProjectModals();

    // Initialize contact form
    initContactForm();

    // Initialize smooth scroll
    initSmoothScroll();

    // Initialize glitch effect
    initGlitchEffect();

    // Initialize ability cards
    initAbilityCards();

    // Initialize skill items
    initSkillItems();

    // Initialize nav visibility
    initNavVisibility();
    
    // Initialize Aim Trainer
    new AimTrainer();
    
    // Initialize Mission Progress
    new MissionProgress();
    
    // Initialize VALORANT Chat System
    window.valorantChat = new ValorantChat();
    
    // All HUD features (Location, Kill Feed, Progress, Chat) are integrated into Footer HUD

    // Console easter egg
    console.log('%c VALORANT PORTFOLIO ', 'background: #ff4655; color: #fff; font-size: 24px; font-weight: bold; padding: 10px 20px;');
    console.log('%c Welcome to my tactical portfolio system. ', 'color: #ff4655; font-size: 14px;');
    console.log('%c Press Enter to open the chat. Use /help for commands. ', 'color: #8b929d; font-size: 12px;');
});
