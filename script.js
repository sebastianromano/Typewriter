// DOM Elements
const elements = {
    output: document.getElementById('output'),
    userInput: document.getElementById('userInput'),
    startButton: document.getElementById('startButton'),
    fontFamily: document.getElementById('fontFamily'),
    fontSize: document.getElementById('fontSize'),
    speed: document.getElementById('speed'),
    boldToggle: document.getElementById('boldToggle'),
    italicToggle: document.getElementById('italicToggle'),
    systemTheme: document.getElementById('systemTheme'),
    lightTheme: document.getElementById('lightTheme'),
    darkTheme: document.getElementById('darkTheme'),
    customTheme: document.getElementById('customTheme'),
    customThemeSection: document.getElementById('customThemeSection'),
    bgImage: document.getElementById('bgImage'),
    removeImage: document.getElementById('removeImage'),
    charCounter: document.querySelector('.char-counter'),
    errorMessage: document.getElementById('errorMessage'),
    presetButtons: document.querySelectorAll('.preset-button'),
    textColor: document.getElementById('textColor'),
    fullscreenToggle: document.getElementById('fullscreenToggle')
};

// Configuration Objects
const config = {
    // Typing speeds (milliseconds)
    speeds: {
        slow: { min: 100, max: 300 },
        medium: { min: 50, max: 150 },
        fast: { min: 20, max: 80 }
    },
    // Common typing mistakes and their variations
    commonTypos: {
        // English Words (30)
        'the': ['teh', 'hte', 'th'],
        'and': ['adn', 'nad', 'annd'],
        'that': ['taht', 'tht', 'thta'],
        'with': ['wiht', 'whit', 'witth'],
        'here': ['heer', 'hrre', 'heree'],
        'there': ['tehre', 'ther', 'therre'],
        'would': ['wuold', 'wold', 'woild'],
        'should': ['shuold', 'shoudd', 'shold'],
        'could': ['cuold', 'coud', 'coulf'],
        'what': ['waht', 'whatt', 'wht'],
        'when': ['wehn', 'whenn', 'whn'],
        'where': ['wehre', 'wherre', 'wher'],
        'this': ['tihs', 'thiss', 'thhis'],
        'have': ['hvae', 'ahve', 'havv'],
        'your': ['yoru', 'yuor', 'yur'],
        'they': ['tehy', 'thye', 'tey'],
        'because': ['becuase', 'becuse', 'bcause'],
        'about': ['abuot', 'abotu', 'bout'],
        'which': ['whihc', 'wich', 'whcih'],
        'their': ['thier', 'thire', 'theyr'],
        'people': ['peopel', 'poeple', 'peple'],
        'through': ['thrugh', 'throuh', 'thruogh'],
        'think': ['thikn', 'thnk', 'thinik'],
        'something': ['somethign', 'somthing', 'sumthing'],
        'really': ['realy', 'relly', 'reelly'],
        'before': ['beofre', 'befre', 'bfore'],
        'after': ['atfer', 'aftr', 'aftter'],
        'know': ['knwo', 'konw', 'knw'],
        'right': ['rihgt', 'rigth', 'rigt'],
        'time': ['tiem', 'tim', 'tmie'],
        // Danish Words (30)
        'også': ['ogsa', 'ogås', 'osgå'],
        'ikke': ['ikek', 'ikke', 'ikke'],
        'være': ['vaere', 'vere', 'væere'],
        'har': ['har', 'hhar', 'haar'],
        'kan': ['kna', 'kaan', 'kkan'],
        'skal': ['skal', 'sakl', 'skla'],
        'meget': ['megt', 'meegt', 'megett'],
        'hvordan': ['hvrodan', 'hvordn', 'hvordaan'],
        'hvad': ['hvda', 'hvd', 'hvadd'],
        'godt': ['goodt', 'gdt', 'godtt'],
        'lige': ['lgie', 'liige', 'lgei'],
        'mere': ['mree', 'merr', 'meree'],
        'kommer': ['komer', 'kommr', 'kommerr'],
        'dag': ['dga', 'dagg', 'ddag'],
        'eller': ['elerl', 'ellr', 'elller'],
        'sådan': ['sadan', 'sådn', 'såådan'],
        'bliver': ['blivr', 'bliver', 'bliverr'],
        'mange': ['mnage', 'mangge', 'magne'],
        'hvor': ['hvrr', 'hvoor', 'hvor'],
        'uden': ['udn', 'udeen', 'udne'],
        'helt': ['hlet', 'heltt', 'hellt'],
        'derfor': ['defor', 'drfor', 'derforr'],
        'siden': ['siedn', 'sidn', 'sidenn'],
        'blevet': ['blevt', 'bleevet', 'blevett'],
        'måske': ['maske', 'måsek', 'måskee'],
        'noget': ['nogett', 'ngt', 'nogget'],
        'sammen': ['samenn', 'sammn', 'samemn'],
        'altid': ['altdi', 'altd', 'altidd'],
        'efter': ['eftr', 'efterr', 'etfer'],
        'mellem': ['melem', 'mellm', 'mellemm']
    }
};

// State Management
const state = {
    isBold: false,
    isItalic: false,
    systemThemePreference: window.matchMedia('(prefers-color-scheme: dark)'),
    isFullscreen: false
};

// Utility Functions
const utils = {
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    getRandomInt: (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min,

    showError: (message) => {
        elements.errorMessage.textContent = message;
        elements.errorMessage.style.display = 'block';
    },

    hideError: () => {
        elements.errorMessage.style.display = 'none';
    }
};

// Theme Management
const themeManager = {
    handleSystemThemeChange: (e) => {
        if (elements.systemTheme.classList.contains('active')) {
            themeManager.setTheme(e.matches ? 'dark' : 'light', true);
        }
    },

    setTheme: (theme, isSystem = false) => {
        // Reset all theme buttons
        elements.systemTheme.classList.remove('active');
        elements.lightTheme.classList.remove('active');
        elements.darkTheme.classList.remove('active');
        elements.customTheme.classList.remove('active');

        // Set active theme button
        if (isSystem) elements.systemTheme.classList.add('active');
        else if (theme === 'light') elements.lightTheme.classList.add('active');
        else if (theme === 'dark') elements.darkTheme.classList.add('active');
        else if (theme === 'custom') elements.customTheme.classList.add('active');

        // Apply theme
        if (theme === 'dark' || (isSystem && state.systemThemePreference.matches)) {
            document.body.setAttribute('data-theme', 'dark');
        } else if (theme === 'light' || (isSystem && !state.systemThemePreference.matches)) {
            document.body.removeAttribute('data-theme');
        }

        // Handle custom theme section
        elements.customThemeSection.style.display = theme === 'custom' ? 'flex' : 'none';

        // Clear custom background if switching to a different theme
        if (theme !== 'custom') {
            elements.output.classList.remove('custom-bg');
            elements.output.style.background = '';
            elements.removeImage.style.display = 'none';
        }
    }
};

// Style Management
const styleManager = {
    updateOutputStyle: () => {
        elements.output.style.fontFamily = elements.fontFamily.value;
        elements.output.style.fontSize = `${elements.fontSize.value}px`;
        elements.output.style.fontWeight = state.isBold ? 'bold' : 'normal';
        elements.output.style.fontStyle = state.isItalic ? 'italic' : 'normal';
    },

    updateCharCounter: () => {
        const text = elements.userInput.value;
        const chars = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        elements.charCounter.textContent = `${chars} characters | ${words} words`;
    },

    updateOutputStyle: () => {
        elements.output.style.fontFamily = elements.fontFamily.value;
        elements.output.style.fontSize = `${elements.fontSize.value}px`;
        elements.output.style.fontWeight = state.isBold ? 'bold' : 'normal';
        elements.output.style.fontStyle = state.isItalic ? 'italic' : 'normal';
        elements.output.style.color = elements.textColor.value || 'inherit';
    }
};

// Typing Logic
const typingManager = {
    getTypingSpeed: () => config.speeds[elements.speed.value],

    getTypo: (word) => {
        const lowerWord = word.toLowerCase();
        if (config.commonTypos[lowerWord]) {
            const typos = config.commonTypos[lowerWord];
            return typos[Math.floor(Math.random() * typos.length)];
        }

        // Create random typo if no predefined one exists
        const chars = word.split('');
        const typoType = Math.random();

        if (typoType < 0.33 && chars.length > 1) {
            const pos = Math.floor(Math.random() * (chars.length - 1));
            [chars[pos], chars[pos + 1]] = [chars[pos + 1], chars[pos]];
        } else if (typoType < 0.66 && chars.length > 2) {
            const pos = Math.floor(Math.random() * chars.length);
            chars.splice(pos, 0, chars[pos]);
        } else {
            const pos = Math.floor(Math.random() * chars.length);
            chars.splice(pos, 1);
        }

        return chars.join('');
    },

    async typeText(text) {
        try {
            elements.output.textContent = '';
            let currentText = '';
            const words = text.split(' ');
            const totalWords = words.length;
            const typosToMake = Math.max(2, Math.floor(totalWords / 15) * 2);
            let typosRemaining = typosToMake;

            styleManager.updateOutputStyle();

            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                const typingSpeed = this.getTypingSpeed();

                const shouldMakeTypoHere = typosRemaining > 0 &&
                    word.length > 2 &&
                    Math.random() < (typosRemaining / (words.length - i));

                if (shouldMakeTypoHere) {
                    typosRemaining--;
                    const typoWord = this.getTypo(word);

                    // Type the typo
                    for (let char of typoWord) {
                        currentText += char;
                        elements.output.textContent = currentText;
                        await utils.sleep(utils.getRandomInt(typingSpeed.min, typingSpeed.max));
                    }

                    // Notice the error
                    await utils.sleep(utils.getRandomInt(400, 800));

                    // Delete the typo
                    for (let j = 0; j < typoWord.length; j++) {
                        currentText = currentText.slice(0, -1);
                        elements.output.textContent = currentText;
                        await utils.sleep(utils.getRandomInt(30, 80));
                    }

                    // Pause before correction
                    await utils.sleep(utils.getRandomInt(200, 400));

                    // Type correct word
                    for (let char of word) {
                        currentText += char;
                        elements.output.textContent = currentText;
                        await utils.sleep(utils.getRandomInt(typingSpeed.min, typingSpeed.max));
                    }
                } else {
                    // Type normally
                    for (let char of word) {
                        currentText += char;
                        elements.output.textContent = currentText;
                        await utils.sleep(utils.getRandomInt(typingSpeed.min, typingSpeed.max));
                    }
                }

                // Add space between words
                if (i < words.length - 1) {
                    currentText += ' ';
                    elements.output.textContent = currentText;
                    await utils.sleep(utils.getRandomInt(typingSpeed.min, typingSpeed.max));
                }
            }
        } catch (error) {
            utils.showError('An error occurred while typing. Please try again.');
            console.error('Typing error:', error);
        }
    }
};

const fullscreenManager = {
    toggleFullscreen: () => {
        state.isFullscreen = !state.isFullscreen;
        elements.fullscreenToggle.classList.toggle('active');
        elements.output.classList.toggle('fullscreen');

        if (state.isFullscreen) {
            // Create exit button if it doesn't exist
            if (!document.querySelector('.exit-fullscreen')) {
                const exitButton = document.createElement('button');
                exitButton.className = 'exit-fullscreen';
                exitButton.textContent = 'Exit Fullscreen';
                exitButton.addEventListener('click', () => {
                    fullscreenManager.toggleFullscreen();
                });
                document.body.appendChild(exitButton);
            }
            // Hide controls and start button
            elements.controls.style.display = 'none';
            elements.startButton.style.display = 'none';
        } else {
            // Remove exit button and show controls
            const exitButton = document.querySelector('.exit-fullscreen');
            if (exitButton) {
                exitButton.remove();
            }
            elements.controls.style.display = 'grid';
            elements.startButton.style.display = 'block';
        }

        // Update styles to ensure proper display
        styleManager.updateOutputStyle();
    },

    handleEscapeKey: (e) => {
        if (e.key === 'Escape' && state.isFullscreen) {
            fullscreenManager.toggleFullscreen();
        }
    }
};

// Event Listeners
function initializeEventListeners() {
    // Theme listeners
    state.systemThemePreference.addListener(themeManager.handleSystemThemeChange);
    elements.systemTheme.addEventListener('click', () => themeManager.setTheme('system', true));
    elements.lightTheme.addEventListener('click', () => themeManager.setTheme('light'));
    elements.darkTheme.addEventListener('click', () => themeManager.setTheme('dark'));
    elements.customTheme.addEventListener('click', () => themeManager.setTheme('custom'));

    // Style listeners
    elements.boldToggle.addEventListener('click', () => {
        state.isBold = !state.isBold;
        elements.boldToggle.classList.toggle('active');
        styleManager.updateOutputStyle();
    });

    elements.italicToggle.addEventListener('click', () => {
        state.isItalic = !state.isItalic;
        elements.italicToggle.classList.toggle('active');
        styleManager.updateOutputStyle();
    });

    // Font size validation
    elements.fontSize.addEventListener('input', () => {
        const value = parseInt(elements.fontSize.value);
        if (value < 12) elements.fontSize.value = 12;
        if (value > 96) elements.fontSize.value = 96;
        styleManager.updateOutputStyle();
    });

    // Background image handling
    elements.bgImage.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) {
                utils.showError('Image size should be less than 5MB');
                elements.bgImage.value = '';
                return;
            }
            elements.output.style.opacity = '0.5';
            const reader = new FileReader();
            reader.onload = (e) => {
                elements.output.style.background = `url(${e.target.result})`;
                elements.output.classList.add('custom-bg');
                elements.removeImage.style.display = 'block';
                elements.output.style.opacity = '1';
                utils.hideError();
            };
            reader.onerror = () => {
                utils.showError('Error loading image. Please try another file.');
                elements.output.style.opacity = '1';
            };
            reader.readAsDataURL(file);
        }
    });

    elements.removeImage.addEventListener('click', () => {
        elements.output.classList.remove('custom-bg');
        elements.output.style.background = '';
        elements.bgImage.value = '';
        elements.removeImage.style.display = 'none';
    });

    // Text input listeners
    elements.userInput.addEventListener('input', styleManager.updateCharCounter);

    // Preset text buttons
    elements.presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const presetText = button.getAttribute('data-text');
            elements.userInput.value = presetText;
            styleManager.updateCharCounter();
            elements.userInput.focus();
        });
    });

    // Start button
    elements.startButton.addEventListener('click', async () => {
        const text = elements.userInput.value.trim();
        if (!text) {
            utils.showError('Please enter some text to type');
            return;
        }

        try {
            utils.hideError();
            elements.startButton.disabled = true;
            await typingManager.typeText(text);
        } catch (error) {
            utils.showError('An error occurred. Please try again.');
            console.error('Error:', error);
        } finally {
            elements.startButton.disabled = false;
        }
    });

    // Enter key handling
    elements.userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            elements.startButton.click();
        }
    });

    // Text color listener
    elements.textColor.addEventListener('change', styleManager.updateOutputStyle);

    // Fullscreen toggle listener
    elements.fullscreenToggle.addEventListener('click', fullscreenManager.toggleFullscreen);

    // Escape key listener for fullscreen
    document.addEventListener('keydown', fullscreenManager.handleEscapeKey);
}

// Initialize
function initialize() {
    styleManager.updateCharCounter();
    styleManager.updateOutputStyle();
    themeManager.setTheme('system', true);
    initializeEventListeners();
}

// Start the application
initialize();
