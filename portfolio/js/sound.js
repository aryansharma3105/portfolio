/* ============================================
   VALORANT PORTFOLIO - SOUND SYSTEM
   ============================================ */

class SoundManager {
    constructor() {
        this.enabled = true;
        this.audioContext = null;
        this.volume = 0.3;
        this.init();
    }

    init() {
        // Initialize audio context on first user interaction
        document.addEventListener('click', () => this.initAudioContext(), { once: true });
        document.addEventListener('keydown', () => this.initAudioContext(), { once: true });
    }

    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
    }

    play(type = 'click') {
        if (!this.enabled || !this.audioContext) return;

        const config = soundConfig[type] || soundConfig.click;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(config.frequency, this.audioContext.currentTime);

        // Add slight randomization for variety
        const randomFreq = config.frequency + (Math.random() * 50 - 25);
        oscillator.frequency.setValueAtTime(randomFreq, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + config.duration / 1000);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + config.duration / 1000);
    }

    playHover() {
        this.play('hover');
    }

    playClick() {
        this.play('click');
    }

    playTerminal() {
        this.play('terminal');
    }

    playGlitch() {
        this.play('glitch');
    }

    playSuccess() {
        this.play('success');
    }

    // Typewriter sound effect
    playType() {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.03);

        gainNode.gain.setValueAtTime(this.volume * 0.05, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.03);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.03);
    }
}

// Initialize sound manager
const soundManager = new SoundManager();

// Update sound toggle button
function updateSoundToggle() {
    const toggle = document.querySelector('.sound-toggle');
    if (toggle) {
        const icon = toggle.querySelector('i');
        if (soundManager.enabled) {
            icon.className = 'fas fa-volume-up';
            toggle.style.color = '';
        } else {
            icon.className = 'fas fa-volume-mute';
            toggle.style.color = 'var(--val-grey)';
        }
    }
}

// Add hover sounds to interactive elements
function initSoundEffects() {
    // Sound toggle button
    const soundToggle = document.querySelector('.sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundManager.toggle();
            updateSoundToggle();
            if (soundManager.enabled) {
                soundManager.playSuccess();
            }
        });
    }

    // Add hover sounds to buttons and links
    const interactiveElements = document.querySelectorAll('button, a, .btn, .nav-links a, .mission-btn, .social-link');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (!el.classList.contains('sound-toggle')) {
                soundManager.playHover();
            }
        });
        el.addEventListener('click', () => soundManager.playClick());
    });

    // Add click sounds to form inputs
    const formInputs = document.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => soundManager.playTerminal());
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initSoundEffects);
