/* ============================================
   VALORANT PORTFOLIO - ANIMATIONS
   ============================================ */

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Loading Screen Animation
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.querySelector('.loading-bar');
    const statusPercent = document.querySelector('.status-percent');
    const statusText = document.querySelector('.status-text');

    const loadingStages = [
        'Loading assets',
        'Initializing systems',
        'Compiling modules',
        'Establishing connection',
        'Ready'
    ];

    let progress = 0;
    let stageIndex = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;

        loadingBar.style.width = `${progress}%`;
        statusPercent.textContent = `${Math.floor(progress)}%`;

        // Update status text based on progress
        const newStageIndex = Math.floor((progress / 100) * (loadingStages.length - 1));
        if (newStageIndex !== stageIndex) {
            stageIndex = newStageIndex;
            statusText.textContent = loadingStages[stageIndex];
        }

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                gsap.to(loadingScreen, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        loadingScreen.style.display = 'none';
                        initHeroAnimations();
                    }
                });
            }, 500);
        }
    }, 150);
}

// Hero Section Animations
function initHeroAnimations() {
    const tl = gsap.timeline();

    // Tag animation
    tl.from('.hero-tag', {
        opacity: 0,
        x: -30,
        duration: 0.6,
        ease: 'power2.out'
    })
    // Name lines with glitch effect
    .from('.name-line', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    }, '-=0.3')
    // Title
    .from('.hero-title', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.4')
    // Tagline
    .from('.hero-tagline', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.3')
    // Buttons
    .from('.hero-actions .btn', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
    }, '-=0.3')
    // Stats
    .from('.stat-item', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
    }, '-=0.3')
    // Scroll indicator
    .from('.hero-scroll', {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.2');

    // Add glitch effect to name on load
    setTimeout(() => {
        const nameLines = document.querySelectorAll('.name-line');
        nameLines.forEach(line => {
            line.classList.add('glitch');
            line.setAttribute('data-text', line.textContent);
            setTimeout(() => {
                line.classList.remove('glitch');
            }, 500);
        });
    }, 1000);
}

// Section Reveal Animations
function initSectionAnimations() {
    // Section headers - animate on scroll up and down
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.fromTo(header.children, 
            { opacity: 0, y: 30 },
            {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    toggleActions: 'play reverse play reverse'
                },
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
            }
        );
    });

    // About card - animate on scroll up and down
    gsap.fromTo('.about-card',
        { opacity: 0, y: 50, scale: 0.95 },
        {
            scrollTrigger: {
                trigger: '.about-card',
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play reverse play reverse'
            },
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out'
        }
    );

    // Dossier items
    gsap.fromTo('.dossier-item',
        { opacity: 0, y: 20, x: -10 },
        {
            scrollTrigger: {
                trigger: '.dossier-grid',
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play reverse play reverse'
            },
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out'
        }
    );

    // Skill categories
    gsap.utils.toArray('.skill-category').forEach((category, i) => {
        gsap.fromTo(category,
            { opacity: 0, y: 50, rotateX: -10 },
            {
                scrollTrigger: {
                    trigger: category,
                    start: 'top 90%',
                    end: 'bottom 10%',
                    toggleActions: 'play reverse play reverse'
                },
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.6,
                delay: i * 0.1,
                ease: 'power2.out'
            }
        );
    });

    // Skill bars animation with glow effect
    const skillBars = document.querySelectorAll('.skill-fill');
    skillBars.forEach(bar => {
        const fillPercent = bar.dataset.fill;
        bar.style.setProperty('--fill-percent', `${fillPercent}%`);
        bar.style.width = '0%';

        ScrollTrigger.create({
            trigger: bar,
            start: 'top 90%',
            end: 'bottom 10%',
            onEnter: () => {
                gsap.to(bar, {
                    width: `${fillPercent}%`,
                    duration: 1.2,
                    ease: 'power2.out',
                    onComplete: () => {
                        // Add glow pulse after fill
                        gsap.to(bar, {
                            boxShadow: '0 0 20px var(--val-red-glow)',
                            duration: 0.5,
                            yoyo: true,
                            repeat: 3
                        });
                    }
                });
                // Animate percentage counter
                const percentEl = bar.closest('.skill-item').querySelector('.skill-percent');
                if (percentEl) {
                    gsap.fromTo(percentEl, 
                        { textContent: '0%' },
                        {
                            textContent: `${fillPercent}%`,
                            duration: 1.2,
                            ease: 'power2.out',
                            snap: { textContent: 1 }
                        }
                    );
                }
            },
            onLeaveBack: () => {
                gsap.to(bar, { width: '0%', duration: 0.5 });
            }
        });
    });

    // Skill items hover animation
    gsap.utils.toArray('.skill-item').forEach(item => {
        const fill = item.querySelector('.skill-fill');
        
        item.addEventListener('mouseenter', () => {
            gsap.to(item, { 
                scale: 1.02, 
                x: 5,
                duration: 0.3,
                ease: 'power2.out'
            });
            if (fill) {
                gsap.to(fill, {
                    filter: 'brightness(1.4) drop-shadow(0 0 10px var(--val-red))',
                    duration: 0.3
                });
            }
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, { 
                scale: 1, 
                x: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
            if (fill) {
                gsap.to(fill, {
                    filter: 'brightness(1) drop-shadow(0 0 0 transparent)',
                    duration: 0.3
                });
            }
        });
    });

    // Ability cards - animate on scroll up and down
    gsap.fromTo('.ability-card',
        { opacity: 0, y: 50, scale: 0.9 },
        {
            scrollTrigger: {
                trigger: '.services-content',
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play reverse play reverse'
            },
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
        }
    );

    // Ability card hover glow effect
    gsap.utils.toArray('.ability-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                boxShadow: '0 0 30px var(--val-red-glow), 0 0 60px rgba(255, 70, 85, 0.2)',
                borderColor: 'var(--val-red)',
                scale: 1.03,
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(card.querySelector('.ability-icon'), {
                rotateY: 360,
                duration: 0.6,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                boxShadow: '0 0 0 transparent',
                borderColor: 'var(--val-dark-light)',
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(card.querySelector('.ability-icon'), {
                rotateY: 0,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
    });

    // Mission cards - animate on scroll up and down
    gsap.fromTo('.mission-card',
        { opacity: 0, y: 50, rotateY: -15 },
        {
            scrollTrigger: {
                trigger: '.projects-content',
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play reverse play reverse'
            },
            opacity: 1,
            y: 0,
            rotateY: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out'
        }
    );

    // Mission card enhanced hover
    gsap.utils.toArray('.mission-card').forEach(card => {
        const image = card.querySelector('.mission-placeholder');
        
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                scale: 1.02,
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
                duration: 0.4,
                ease: 'power2.out'
            });
            if (image) {
                gsap.to(image, {
                    scale: 1.15,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                boxShadow: '0 0 0 transparent',
                duration: 0.4,
                ease: 'power2.out'
            });
            if (image) {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
        });
    });

    // Timeline items - animate on scroll up and down
    gsap.fromTo('.timeline-item',
        { opacity: 0, x: -50 },
        {
            scrollTrigger: {
                trigger: '.career-timeline',
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play reverse play reverse'
            },
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out'
        }
    );

    // Timeline marker pulse
    gsap.utils.toArray('.marker-dot').forEach(dot => {
        gsap.to(dot, {
            boxShadow: '0 0 0 10px rgba(255, 70, 85, 0.3)',
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut'
        });
    });

    // Contact form - animate on scroll up and down
    gsap.fromTo('.contact-form-container',
        { opacity: 0, x: -50 },
        {
            scrollTrigger: {
                trigger: '.contact-content',
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play reverse play reverse'
            },
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power2.out'
        }
    );

    gsap.fromTo('.info-card',
        { opacity: 0, x: 50, scale: 0.9 },
        {
            scrollTrigger: {
                trigger: '.contact-info',
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play reverse play reverse'
            },
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
        }
    );

    // Info card hover
    gsap.utils.toArray('.info-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -5,
                borderColor: 'var(--val-red)',
                boxShadow: '0 10px 30px rgba(255, 70, 85, 0.2)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                borderColor: 'var(--val-dark-light)',
                boxShadow: '0 0 0 transparent',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Form inputs focus animation
    gsap.utils.toArray('.form-group input, .form-group textarea').forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                boxShadow: '0 0 20px var(--val-red-glow)',
                borderColor: 'var(--val-red)',
                duration: 0.3
            });
        });

        input.addEventListener('blur', () => {
            gsap.to(input, {
                boxShadow: '0 0 0 transparent',
                borderColor: 'var(--val-dark-light)',
                duration: 0.3
            });
        });
    });
}

// Parallax Effect
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    const gridOverlay = document.querySelector('.grid-overlay');

    if (heroSection && gridOverlay) {
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const xPercent = (clientX / innerWidth - 0.5) * 20;
            const yPercent = (clientY / innerHeight - 0.5) * 20;

            gsap.to(gridOverlay, {
                x: xPercent,
                y: yPercent,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    }
}

// Scroll Progress
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    }, { passive: true });
}

// Back to Top Button
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (typeof soundManager !== 'undefined') {
            soundManager.playTerminal();
        }
    });
}

// Navigation Active State
function initNavActiveState() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

// Particle System
function initParticles() {
    const container = document.querySelector('.particles-container');
    if (!container) return;

    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 3 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    const tx = (Math.random() - 0.5) * 200;
    const ty = (Math.random() - 0.5) * 200;
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);

    container.appendChild(particle);

    // Animate particle
    setTimeout(() => {
        particle.classList.add('animate');
    }, Math.random() * 2000);

    // Recreate particle after animation
    setTimeout(() => {
        particle.remove();
        createParticle(container);
    }, 3000 + Math.random() * 2000);
}

// Interactive Particle System
class InteractiveParticles {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.animationId = null;
        this.init();
    }
    
    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'interactive-particles';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.6;
        `;
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // Create particles
        this.createParticles();
        
        // Event listeners
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        // Start animation
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = Math.min(80, Math.floor((this.canvas.width * this.canvas.height) / 15000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                color: Math.random() > 0.5 ? 'rgba(255, 70, 85, 0.6)' : 'rgba(255, 255, 255, 0.3)',
                baseX: 0,
                baseY: 0,
                density: Math.random() * 30 + 1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Store base position
            p.baseX = p.x;
            p.baseY = p.y;
            
            // Mouse interaction
            if (this.mouse.x != null && this.mouse.y != null) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const directionX = forceDirectionX * force * p.density * 0.6;
                    const directionY = forceDirectionY * force * p.density * 0.6;
                    
                    // Attraction effect (move toward cursor)
                    p.x += directionX;
                    p.y += directionY;
                }
            }
            
            // Apply velocity
            p.x += p.vx;
            p.y += p.vy;
            
            // Boundary check - wrap around
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
            
            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 70, 85, ${0.15 * (1 - dist / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initSectionAnimations();
    initParallax();
    initScrollProgress();
    initBackToTop();
    initNavActiveState();
    initParticles();
    
    // Initialize interactive particle system
    new InteractiveParticles();
});
