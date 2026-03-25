/* ============================================
   VALORANT PORTFOLIO - CHAT SYSTEM & MINIMAP
   ============================================ */

class ValorantChat {
    constructor() {
        this.overlay = document.getElementById('chatOverlay');
        this.input = document.getElementById('chatInput');
        this.messages = document.getElementById('chatMessages');
        this.sendBtn = document.getElementById('chatSend');
        this.channelIndicator = document.getElementById('currentChannel');
        this.tabs = document.querySelectorAll('.chat-tab');
        this.isOpen = false;
        this.currentChannel = 'team';
        this.commandHistory = [];
        this.historyIndex = -1;

        this.init();
    }

    init() {
        // Keyboard shortcut (Enter to open, Escape to close)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.isOpen && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                this.open();
            }
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Close button
        const closeBtn = document.querySelector('.chat-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Send button
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.sendMessage());
        }

        // Input handling
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            }
        });

        // Tab switching
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchChannel(tab.dataset.tab));
        });

        // Initial message
        this.addSystemMessage('Welcome to Agent Profile. Type /help for available commands.');
    }

    open() {
        this.isOpen = true;
        this.overlay.classList.add('active');
        this.input.focus();
        this.playSound('ui_open');
    }

    close() {
        this.isOpen = false;
        this.overlay.classList.remove('active');
        this.input.blur();
        this.playSound('ui_close');
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    switchChannel(channel) {
        this.currentChannel = channel;
        this.channelIndicator.textContent = channel.toUpperCase();
        
        this.tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === channel);
        });
        
        this.playSound('ui_click');
    }

    sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        this.commandHistory.push(text);
        this.historyIndex = this.commandHistory.length;

        if (text.startsWith('/')) {
            this.handleCommand(text);
        } else {
            this.addMessage('Aryan', text, this.currentChannel);
        }

        this.input.value = '';
        this.scrollToBottom();
    }

    handleCommand(command) {
        const cmd = command.toLowerCase().split(' ')[0];
        const args = command.split(' ').slice(1);

        switch(cmd) {
            case '/help':
                this.showHelp();
                break;
            case '/goto':
                this.handleGoto(args);
                break;
            case '/skills':
                this.navigateTo('skills');
                this.addSystemMessage('Navigating to Loadout...');
                break;
            case '/projects':
                this.navigateTo('projects');
                this.addSystemMessage('Navigating to Missions...');
                break;
            case '/contact':
                this.navigateTo('contact');
                this.addSystemMessage('Navigating to Comms...');
                break;
            case '/about':
                this.navigateTo('about');
                this.addSystemMessage('Navigating to Dossier...');
            case '/cv':
                this.navigateTo('cv');
                this.addSystemMessage('Navigating to Career Log...');
                break;
            case '/clear':
                this.messages.innerHTML = '';
                this.addSystemMessage('Chat cleared.');
                break;
            case '/aim':
                this.addSystemMessage('Starting Aim Trainer...');
                setTimeout(() => {
                    const aimGame = document.getElementById('aimGame');
                    if (aimGame) aimGame.classList.add('active');
                }, 500);
                break;
            default:
                this.addSystemMessage(`Unknown command: ${cmd}. Type /help for available commands.`);
        }
    }

    showHelp() {
        const helpText = `
Available Commands:
/help - Show this help message
/goto [section] - Navigate to section (hero, about, skills, projects, cv, contact)
/skills - Quick navigate to Loadout
/projects - Quick navigate to Missions
/contact - Quick navigate to Comms
/about - Quick navigate to Dossier
/cv - Quick navigate to Career Log
/aim - Start Aim Trainer
/clear - Clear chat

Navigation: Use Arrow Up/Down for command history
        `;
        this.addSystemMessage(helpText);
    }

    handleGoto(args) {
        if (args.length === 0) {
            this.addSystemMessage('Usage: /goto [section]');
            return;
        }
        
        const section = args[0].toLowerCase();
        const validSections = ['hero', 'about', 'skills', 'services', 'projects', 'cv', 'contact'];
        
        if (validSections.includes(section)) {
            this.navigateTo(section);
            this.addSystemMessage(`Navigating to ${section}...`);
        } else {
            this.addSystemMessage(`Invalid section. Available: ${validSections.join(', ')}`);
        }
    }

    navigateTo(section) {
        const element = document.getElementById(section);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            this.close();
        }
    }

    addMessage(sender, text, channel = 'team') {
        const message = document.createElement('div');
        message.className = `chat-message ${channel}`;
        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        
        message.innerHTML = `
            <span class="msg-time">[${time}]</span>
            <span class="msg-sender">${sender}:</span>
            <span class="msg-text">${this.escapeHtml(text)}</span>
        `;
        
        this.messages.appendChild(message);
        this.scrollToBottom();
        this.playSound('message');
    }

    addSystemMessage(text) {
        const message = document.createElement('div');
        message.className = 'chat-message system';
        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        
        message.innerHTML = `
            <span class="msg-time">[${time}]</span>
            <span class="msg-sender system">SYSTEM:</span>
            <span class="msg-text">${this.escapeHtml(text)}</span>
        `;
        
        this.messages.appendChild(message);
        this.scrollToBottom();
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

    scrollToBottom() {
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    playSound(type) {
        // Sound effects can be added here
    }
}

// Kill Feed System
class KillFeed {
    constructor() {
        this.container = document.getElementById('killFeed');
        this.messages = [
            { killer: 'Aryan', weapon: 'fa-code', victim: 'Bugs' },
            { killer: 'Aryan', weapon: 'fa-database', victim: 'Data Issues' },
            { killer: 'Aryan', weapon: 'fa-rocket', victim: 'Slow Performance' },
            { killer: 'Aryan', weapon: 'fa-shield-alt', victim: 'Security Flaws' },
            { killer: 'Aryan', weapon: 'fa-laptop-code', victim: 'Full Stack Project' },
            { killer: 'Aryan', weapon: 'fa-chart-line', victim: 'Data Model' },
            { killer: 'Aryan', weapon: 'fa-bug', victim: 'Production Error' },
            { killer: 'Aryan', weapon: 'fa-terminal', victim: 'Command Line' }
        ];
        this.init();
    }

    init() {
        // Show initial kill
        this.showKill(this.messages[0]);
        
        // Random kill feed every 8-15 seconds
        setInterval(() => {
            const randomKill = this.messages[Math.floor(Math.random() * this.messages.length)];
            this.showKill(randomKill);
        }, 8000 + Math.random() * 7000);
    }

    showKill(kill) {
        const item = document.createElement('div');
        item.className = 'kill-feed-item';
        item.innerHTML = `
            <span class="killer">${kill.killer}</span>
            <span class="weapon"><i class="fas ${kill.weapon}"></i></span>
            <span class="victim">${kill.victim}</span>
        `;
        
        this.container.appendChild(item);
        
        // Remove after animation
        setTimeout(() => {
            item.remove();
        }, 5000);
    }
}

// Location Indicator System
class LocationIndicator {
    constructor() {
        this.indicator = document.getElementById('locationIndicator');
        this.locationName = document.getElementById('currentLocation');
        this.dots = document.querySelectorAll('.zone-dot');
        this.sections = ['hero', 'about', 'skills', 'services', 'projects', 'cv', 'contact'];
        this.sectionNames = {
            'hero': 'SPAWN',
            'about': 'DOSSIER',
            'skills': 'LOADOUT',
            'services': 'ABILITIES',
            'projects': 'MISSIONS',
            'cv': 'CAREER',
            'contact': 'COMMS'
        };
        
        this.init();
    }

    init() {
        // Update location on scroll
        window.addEventListener('scroll', () => this.updateLocation());
        
        // Dot click handlers
        this.dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const section = dot.dataset.section;
                document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        // Initial location
        this.updateLocation();
    }

    updateLocation() {
        const currentSection = this.getCurrentSection();
        const sectionName = this.sectionNames[currentSection] || 'SPAWN';
        
        // Update location name with animation
        if (this.locationName.textContent !== sectionName) {
            this.locationName.style.animation = 'none';
            setTimeout(() => {
                this.locationName.textContent = sectionName;
                this.locationName.style.animation = 'locationChange 0.5s ease';
            }, 10);
        }
        
        // Update active dot
        this.dots.forEach(dot => {
            dot.classList.toggle('active', dot.dataset.section === currentSection);
        });
    }

    getCurrentSection() {
        const scrollPos = window.scrollY + window.innerHeight / 2;
        
        for (const sectionId of this.sections) {
            const section = document.getElementById(sectionId);
            if (section) {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                if (scrollPos >= top && scrollPos < bottom) {
                    return sectionId;
                }
            }
        }
        return 'hero';
    }
}

// Legacy Command Terminal (Keep for compatibility)
class CommandTerminal {
    constructor() {
        this.overlay = document.getElementById('terminalOverlay');
        if (!this.overlay) return;
        
        this.input = document.getElementById('terminalInput');
        this.output = document.getElementById('terminalOutput');
        this.suggestions = document.getElementById('terminalSuggestions');
        this.isOpen = false;
        this.commandHistory = [];
        this.historyIndex = -1;
        this.suggestionIndex = -1;

        this.init();
    }

    init() {
        // Keyboard shortcut (Ctrl+K)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Terminal trigger button
        const trigger = document.querySelector('.terminal-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => this.open());
        }

        // Close button
        const closeBtn = document.querySelector('.terminal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Input handling
        if (this.input) {
            this.input.addEventListener('keydown', (e) => this.handleInput(e));
            this.input.addEventListener('input', () => this.handleInputChange());
        }

        // Click outside to close
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });
        }
    }

    open() {
        this.isOpen = true;
        this.overlay.classList.add('active');
        this.input.focus();
        document.body.style.overflow = 'hidden';

        if (typeof soundManager !== 'undefined') {
            soundManager.playTerminal();
        }

        // Add opening animation
        gsap.fromTo(this.overlay.querySelector('.terminal-container'),
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
    }

    close() {
        this.isOpen = false;
        this.overlay.classList.remove('active');
        this.input.blur();
        document.body.style.overflow = '';
        this.hideSuggestions();

        if (typeof soundManager !== 'undefined') {
            soundManager.playTerminal();
        }
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    handleInput(e) {
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                this.executeCommand(this.input.value.trim());
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory(-1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory(1);
                break;
            case 'Tab':
                e.preventDefault();
                this.autocomplete();
                break;
        }
    }

    handleInputChange() {
        const value = this.input.value.trim();
        if (value.startsWith('/')) {
            this.showSuggestions(value);
        } else {
            this.hideSuggestions();
        }
    }

    showSuggestions(input) {
        const matches = Object.keys(terminalCommands).filter(cmd =>
            cmd.toLowerCase().startsWith(input.toLowerCase())
        );

        if (matches.length === 0) {
            this.hideSuggestions();
            return;
        }

        this.suggestions.innerHTML = matches.map((cmd, index) => `
            <div class="suggestion-item ${index === 0 ? 'selected' : ''}" data-cmd="${cmd}">
                <span class="cmd-name">${cmd}</span>
                <span class="cmd-desc">${terminalCommands[cmd].description}</span>
            </div>
        `).join('');

        this.suggestions.classList.add('active');
        this.suggestionIndex = 0;

        // Add click handlers
        this.suggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                this.input.value = item.dataset.cmd;
                this.hideSuggestions();
                this.input.focus();
            });
        });
    }

    hideSuggestions() {
        this.suggestions.classList.remove('active');
        this.suggestionIndex = -1;
    }

    autocomplete() {
        const value = this.input.value.trim();
        const matches = Object.keys(terminalCommands).filter(cmd =>
            cmd.toLowerCase().startsWith(value.toLowerCase())
        );

        if (matches.length === 1) {
            this.input.value = matches[0];
            this.hideSuggestions();
        } else if (matches.length > 1 && this.suggestionIndex >= 0) {
            const items = this.suggestions.querySelectorAll('.suggestion-item');
            if (items[this.suggestionIndex]) {
                this.input.value = items[this.suggestionIndex].dataset.cmd;
                this.hideSuggestions();
            }
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

    executeCommand(command) {
        if (!command) return;

        // Add to history
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;

        // Display command
        this.addLine('user', command);

        // Clear input
        this.input.value = '';
        this.hideSuggestions();

        // Process command
        if (command === '/clear') {
            this.output.innerHTML = '';
            this.addLine('system', 'Terminal cleared.');
            return;
        }

        const cmd = terminalCommands[command.toLowerCase()];
        if (cmd) {
            const result = cmd.action();
            if (result) {
                setTimeout(() => {
                    this.addLine('response', result);
                }, 300);
            }
        } else {
            setTimeout(() => {
                this.addLine('error', `Unknown command: ${command}`);
                this.addLine('response', 'Type /help for available commands.');
            }, 200);
        }

        if (typeof soundManager !== 'undefined') {
            soundManager.playType();
        }

        // Scroll to bottom
        setTimeout(() => {
            this.output.scrollTop = this.output.scrollHeight;
        }, 100);
    }

    addLine(type, text) {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;

        let prefix = '';
        switch (type) {
            case 'system':
                prefix = '[SYSTEM]';
                break;
            case 'error':
                prefix = '[ERROR]';
                break;
            case 'user':
                prefix = '>';
                break;
        }

        if (prefix) {
            line.innerHTML = `<span class="line-prefix">${prefix}</span> <span class="line-text">${this.escapeHtml(text).replace(/\n/g, '<br>')}</span>`;
        } else {
            line.innerHTML = `<span class="line-text">${this.escapeHtml(text).replace(/\n/g, '<br>')}</span>`;
        }

        this.output.appendChild(line);

        // Typewriter effect for response
        if (type === 'response' || type === 'system') {
            const textSpan = line.querySelector('.line-text');
            const originalText = text;
            textSpan.textContent = '';

            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < originalText.length) {
                    textSpan.textContent += originalText[i];
                    i++;
                    if (typeof soundManager !== 'undefined' && i % 3 === 0) {
                        soundManager.playType();
                    }
                } else {
                    clearInterval(typeInterval);
                }
            }, 15);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize terminal on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.terminal = new CommandTerminal();
});
