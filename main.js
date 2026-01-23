// API Base URL
const API_BASE_URL = window.location.origin;

// Default settings
const DEFAULT_SETTINGS = {
    adminPanelName: 'KitKat Universe',
    username: 'Ahmed Khamlich',
    commissionStatus: 'Open',
    tagline: '',
    aboutSection: '',
    servicesSection: '',
    profilePicture: '',
    bannerImage: '',
    backgroundMusic: '',
    contactEmail: '',
    contactPhone: '',
    sideStickers: '',
    contactUs: '',
    primaryColor: '#a855f7',
    secondaryColor: '#d946ef',
    footerColor: '#000000',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    links: [
        {
            id: 1,
            title: 'youtube',
            url: 'https://www.youtube.com/@KitKatUVU',
            icon: '📺'
        }
    ]
};

// Load settings from API
async function loadSettings() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/settings`);
        if (!response.ok) throw new Error('Failed to load settings');
        return await response.json();
    } catch (err) {
        console.error('Error loading settings:', err);
        return DEFAULT_SETTINGS;
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    await loadPageSettings();
    await renderCards();
    setupAnimations();
});

// Load and apply settings
async function loadPageSettings() {
    const settings = await loadSettings();
    
    // Apply colors to CSS variables
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
    document.documentElement.style.setProperty('--footer-color', settings.footerColor);
    
    // Update background gradient
    const body = document.body;
    const primaryRGB = hexToRgb(settings.primaryColor);
    const secondaryRGB = hexToRgb(settings.secondaryColor);
    
    body.style.background = `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.secondaryColor} 50%, ${adjustColor(settings.primaryColor, 20)} 100%)`;
    
    // Apply font family
    document.body.style.fontFamily = settings.fontFamily;
    
    // Play background music if set
    if (settings.backgroundMusic) {
        try {
            const audio = new Audio(settings.backgroundMusic);
            audio.loop = true;
            audio.volume = 0.3;
            audio.play().catch(() => {
                // Autoplay might be blocked by browser
                console.log('Autoplay blocked. Music can be played manually.');
            });
        } catch (e) {
            console.log('Could not load background music');
        }
    }
}

// Render cards from settings
async function renderCards() {
    const settings = await loadSettings();
    const container = document.getElementById('cardsContainer');
    
    // Clear existing cards
    container.innerHTML = '';
    
    // Create commissions card
    const commissionsCard = createCard(
        `Commissions : ${settings.commissionStatus}`,
        '📋',
        'commissions-card'
    );
    container.appendChild(commissionsCard);
    
    // Create link cards
    if (settings.links && settings.links.length > 0) {
        settings.links.forEach(link => {
            const linkCard = createLinkCard(link);
            container.appendChild(linkCard);
        });
    }
}

// Create a regular card
function createCard(label, icon, className = '') {
    const card = document.createElement('div');
    card.className = `card ${className}`;
    card.innerHTML = `
        <div class="card-content">
            <p class="card-label">${label}</p>
            <div class="card-icon">${icon}</div>
        </div>
    `;
    return card;
}

// Create a link card
function createLinkCard(link) {
    const card = document.createElement('div');
    card.className = 'card link-card';
    card.style.cursor = 'pointer';
    
    // Check if icon is a base64 image
    const isImage = link.icon && link.icon.startsWith('data:image');
    
    let iconHTML;
    if (isImage) {
        iconHTML = `<img src="${link.icon}" class="link-icon-image" alt="${link.title}">`;
    } else {
        iconHTML = `<span class="link-icon">${link.icon}</span>`;
    }
    
    card.innerHTML = `
        <div class="card-content">
            <div class="link-badge">
                ${iconHTML}
                <span>${link.title}</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.open(link.url, '_blank');
    });
    
    return card;
}

// Setup animations
function setupAnimations() {
    window.addEventListener('load', () => {
        const title = document.querySelector('.title');
        const cards = document.querySelectorAll('.card');
        
        if (title) {
            title.style.opacity = '0';
            title.style.animation = 'slideDown 0.8s ease forwards';
        }
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.animation = `slideUp 0.6s ease forwards ${0.3 + index * 0.1}s`;
        });
    });

    // Card interaction
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            if (!this.classList.contains('link-card')) return;
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });

        card.addEventListener('mouseover', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}

// Utility functions
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function adjustColor(hex, percent) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    
    const adjust = (c) => Math.min(255, Math.max(0, c + (c * percent / 100)));
    return `rgb(${adjust(rgb.r)}, ${adjust(rgb.g)}, ${adjust(rgb.b)})`;
}

// Add CSS for animations and dynamic styles
const style = document.createElement('style');
style.textContent = `
    :root {
        --primary-color: #a855f7;
        --secondary-color: #d946ef;
        --footer-color: #000000;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .link-badge {
        display: flex;
        align-items: center;
        gap: 10px;
        background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(217, 70, 239, 0.1) 100%);
        border: 1.5px solid rgba(168, 85, 247, 0.4);
        border-radius: 30px;
        padding: 12px 24px;
        color: white;
        font-size: 1.1rem;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .card:hover .link-badge {
        border-color: rgba(168, 85, 247, 0.7);
        background: linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(217, 70, 239, 0.2) 100%);
    }

    .link-icon {
        font-size: 1.3rem;
    }
`;
document.head.appendChild(style);

// Listen for storage changes (when admin updates settings in another tab)
window.addEventListener('storage', async (e) => {
    if (e.key === 'kitkatSettings' || e.key === null) {
        // Settings updated, reload the page dynamically
        setTimeout(async () => {
            await loadPageSettings();
            await renderCards();
        }, 100);
    }
});

// Refresh data every 3 seconds to check for updates
setInterval(async () => {
    await renderCards();
}, 3000);
