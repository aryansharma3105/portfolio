/* ============================================
   VALORANT PORTFOLIO - DATA
   ============================================ */

// Project Data
const projectsData = {
    cricket: {
        code: 'MISSION 01',
        title: 'CRICKET PLAYER ANALYZER',
        description: 'A comprehensive cricket statistics analysis platform that provides in-depth player performance metrics, comparative analytics, and visual insights. The system processes historical match data to generate detailed reports on batting averages, bowling figures, fielding statistics, and overall player ratings. Features include player comparison tools, trend analysis, and predictive performance modeling.',
        tech: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Data Visualization'],
        features: [
            'Player performance metrics and statistics',
            'Comparative analysis between players',
            'Interactive data visualizations',
            'Historical trend analysis',
            'Custom report generation'
        ],
        github: '#',
        demo: '#'
    },
    ufc: {
        code: 'MISSION 02',
        title: 'UFC FIGHTERS DASHBOARD',
        description: 'An interactive Power BI dashboard for comprehensive UFC fighter statistics and fight history analysis. The dashboard provides real-time insights into fighter performance, weight class rankings, fight outcomes, and statistical comparisons. Users can filter by weight class, fighter nationality, fight date ranges, and various performance metrics.',
        tech: ['Power BI', 'Python', 'Pandas', 'DAX', 'Data Modeling', 'Dashboard Design'],
        features: [
            'Interactive fighter statistics',
            'Weight class analysis',
            'Fight history visualization',
            'Performance trend tracking',
            'Custom filtering and drill-down'
        ],
        github: '#',
        demo: '#'
    },
    predictor: {
        code: 'MISSION 03',
        title: 'MATCH OUTCOME PREDICTOR',
        description: 'A machine learning model designed to predict match outcomes based on historical data, team statistics, and various performance indicators. The system uses advanced algorithms including Random Forest, Logistic Regression, and Neural Networks to achieve high prediction accuracy. Features include real-time data ingestion, model retraining, and confidence scoring.',
        tech: ['Python', 'Scikit-learn', 'TensorFlow', 'Pandas', 'Machine Learning', 'Statistical Analysis'],
        features: [
            'Multi-algorithm prediction models',
            'Historical data analysis',
            'Confidence scoring system',
            'Real-time prediction API',
            'Model performance monitoring'
        ],
        github: '#',
        demo: '#'
    }
};

// Terminal Commands
const terminalCommands = {
    '/home': {
        description: 'Navigate to home section',
        action: () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return 'Navigating to HOME section...';
        }
    },
    '/about': {
        description: 'Navigate to agent dossier',
        action: () => {
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
            return 'Accessing AGENT DOSSIER...';
        }
    },
    '/skills': {
        description: 'View loadout and abilities',
        action: () => {
            document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
            return 'Loading LOADOUT data...';
        }
    },
    '/services': {
        description: 'View abilities panel',
        action: () => {
            document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
            return 'Accessing ABILITIES panel...';
        }
    },
    '/projects': {
        description: 'View mission archive',
        action: () => {
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
            return 'Opening MISSION archive...';
        }
    },
    '/cv': {
        description: 'View career log',
        action: () => {
            document.getElementById('cv').scrollIntoView({ behavior: 'smooth' });
            return 'Accessing CAREER LOG...';
        }
    },
    '/contact': {
        description: 'Open comms panel',
        action: () => {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            return 'Opening COMMS panel...';
        }
    },
    '/help': {
        description: 'Show available commands',
        action: () => {
            return `Available commands:\n${Object.entries(terminalCommands)
                .map(([cmd, info]) => `  ${cmd.padEnd(12)} - ${info.description}`)
                .join('\n')}`;
        }
    },
    '/clear': {
        description: 'Clear terminal output',
        action: () => {
            return 'CLEAR';
        }
    },
    '/status': {
        description: 'System status report',
        action: () => {
            return `System Status Report:
  OS: ${navigator.platform}
  Browser: ${navigator.userAgent.split(')')[0]})}
  Resolution: ${window.innerWidth}x${window.innerHeight}
  Online: ${navigator.onLine ? 'YES' : 'NO'}
  Time: ${new Date().toLocaleTimeString()}`;
        }
    }
};

// Sound Effects Configuration
const soundConfig = {
    hover: {
        frequency: 800,
        duration: 50,
        type: 'sine'
    },
    click: {
        frequency: 400,
        duration: 100,
        type: 'square'
    },
    terminal: {
        frequency: 600,
        duration: 150,
        type: 'sawtooth'
    },
    glitch: {
        frequency: 200,
        duration: 80,
        type: 'sawtooth'
    },
    success: {
        frequency: 1000,
        duration: 200,
        type: 'sine'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { projectsData, terminalCommands, soundConfig };
}
