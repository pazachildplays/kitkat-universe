// API Base URL - update this when deployed to Render
const API_BASE_URL = window.location.origin;

// Load settings from API
function loadSettings() {
    // This will be called by async fetch
    return {};
}

// Load settings from API (async version)
async function loadSettingsAsync() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/settings`);
        if (!response.ok) throw new Error('Failed to load settings');
        return await response.json();
    } catch (err) {
        console.error('Error loading settings:', err);
        return DEFAULT_SETTINGS;
    }
}

// Save settings to API
async function saveSettings(settings) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        if (!response.ok) throw new Error('Failed to save settings');
        return await response.json();
    } catch (err) {
        console.error('Error saving settings:', err);
        showNotification('❌ Failed to save settings');
        throw err;
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    await loadAdminData();
    renderLinks();
    setupEventListeners();
});

// Load admin data into form
async function loadAdminData() {
    const settings = await loadSettingsAsync();
    
    document.getElementById('adminPanelName').value = settings.adminPanelName;
    document.getElementById('username').value = settings.username;
    document.getElementById('displayUsername').textContent = settings.username;
    document.getElementById('commissionStatus').value = settings.commissionStatus;
    document.getElementById('tagline').value = settings.tagline;
    document.getElementById('aboutSection').value = settings.aboutSection;
    document.getElementById('servicesSection').value = settings.servicesSection;
    document.getElementById('profilePicture').value = settings.profilePicture;
    document.getElementById('bannerImage').value = settings.bannerImage;
    document.getElementById('backgroundMusic').value = settings.backgroundMusic;
    document.getElementById('contactEmail').value = settings.contactEmail;
    document.getElementById('contactPhone').value = settings.contactPhone;
    document.getElementById('sideStickers').value = settings.sideStickers;
    document.getElementById('contactUs').value = settings.contactUs;
    document.getElementById('primaryColor').value = settings.primaryColor;
    document.getElementById('primaryColorHex').value = settings.primaryColor;
    document.getElementById('secondaryColor').value = settings.secondaryColor;
    document.getElementById('secondaryColorHex').value = settings.secondaryColor;
    document.getElementById('footerColor').value = settings.footerColor;
    document.getElementById('footerColorHex').value = settings.footerColor;
    document.getElementById('fontFamily').value = settings.fontFamily;
}

// Setup event listeners
function setupEventListeners() {
    // Color pickers
    document.getElementById('primaryColor').addEventListener('change', (e) => {
        document.getElementById('primaryColorHex').value = e.target.value;
    });
    
    document.getElementById('secondaryColor').addEventListener('change', (e) => {
        document.getElementById('secondaryColorHex').value = e.target.value;
    });
    
    document.getElementById('footerColor').addEventListener('change', (e) => {
        document.getElementById('footerColorHex').value = e.target.value;
    });

    // Settings form
    document.getElementById('settings-form').addEventListener('submit', handleSettingsSave);

    // Link form
    document.getElementById('linkForm').addEventListener('submit', handleAddLink);

    // Update display username in real-time
    document.getElementById('username').addEventListener('change', (e) => {
        document.getElementById('displayUsername').textContent = e.target.value;
    });

    // Icon file upload handler
    document.getElementById('linkIconFile').addEventListener('change', handleIconUpload);
}

// Handle icon upload
function handleIconUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
        showNotification('❌ Please select an image file');
        return;
    }

    // Validate file size (max 500KB)
    if (file.size > 500000) {
        showNotification('❌ Image too large (max 500KB)');
        return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
        const base64Image = event.target.result;
        
        // Store in hidden field
        document.getElementById('linkIcon').value = base64Image;
        
        // Show preview
        const preview = document.getElementById('iconPreview');
        preview.innerHTML = `<img src="${base64Image}" alt="Icon preview">`;
    };
    reader.readAsDataURL(file);
}

// Handle settings save
async function handleSettingsSave(e) {
    e.preventDefault();
    
    try {
        const settings = {
            adminPanelName: document.getElementById('adminPanelName').value,
            username: document.getElementById('username').value,
            commissionStatus: document.getElementById('commissionStatus').value,
            tagline: document.getElementById('tagline').value,
            aboutSection: document.getElementById('aboutSection').value,
            servicesSection: document.getElementById('servicesSection').value,
            profilePicture: document.getElementById('profilePicture').value,
            bannerImage: document.getElementById('bannerImage').value,
            backgroundMusic: document.getElementById('backgroundMusic').value,
            contactEmail: document.getElementById('contactEmail').value,
            contactPhone: document.getElementById('contactPhone').value,
            sideStickers: document.getElementById('sideStickers').value,
            contactUs: document.getElementById('contactUs').value,
            primaryColor: document.getElementById('primaryColor').value,
            secondaryColor: document.getElementById('secondaryColor').value,
            footerColor: document.getElementById('footerColor').value,
            fontFamily: document.getElementById('fontFamily').value,
            links: (await loadSettingsAsync()).links
        };

        await saveSettings(settings);
        showNotification('✅ Settings saved & synced to site!');
    } catch (err) {
        console.error('Error saving settings:', err);
    }
}

// Render links
function renderLinks() {
    const settingsPromise = loadSettingsAsync();
    const linksList = document.getElementById('links-list');
    const linksListMain = document.getElementById('links-list-main');
    
    settingsPromise.then(settings => {
        let html = '';

        if (!settings.links || settings.links.length === 0) {
            html = '<p style="text-align: center; color: rgba(255, 255, 255, 0.6);">No links added yet. Click "Add New Link" to create one.</p>';
        } else {
            html = settings.links.map(link => `
                <div class="link-item">
                    <div style="display: flex; align-items: center; flex: 1;">
                        <div class="link-icon">${link.icon}</div>
                        <div class="link-details">
                            <h3>${link.title}</h3>
                            <p>${link.url}</p>
                        </div>
                    </div>
                    <div class="link-actions">
                        <button class="edit-link" onclick="editLink(${link.id})">✏️ Edit</button>
                        <button class="delete-link" onclick="deleteLink(${link.id})">🗑️ Delete</button>
                    </div>
                </div>
            `).join('');
        }

        if (linksList) linksList.innerHTML = html;
        if (linksListMain) linksListMain.innerHTML = html;
    });
}

// Show add link form
function showAddLinkForm() {
    document.getElementById('linkModal').classList.add('active');
    document.getElementById('linkForm').reset();
    document.getElementById('linkForm').dataset.editId = '';
    document.getElementById('iconPreview').innerHTML = '';
    document.getElementById('linkIcon').value = '🔗';
}

// Close link modal
function closeLinkModal() {
    document.getElementById('linkModal').classList.remove('active');
}

// Handle add link
async function handleAddLink(e) {
    e.preventDefault();
    
    try {
        const settings = await loadSettingsAsync();
        const editId = document.getElementById('linkForm').dataset.editId;
        
        const linkData = {
            title: document.getElementById('linkTitle').value,
            url: document.getElementById('linkUrl').value,
            icon: document.getElementById('linkIcon').value
        };

        if (editId) {
            // Edit existing link
            await fetch(`${API_BASE_URL}/api/links/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(linkData)
            });
            showNotification('✏️ Link updated & synced to site!');
        } else {
            // Add new link
            await fetch(`${API_BASE_URL}/api/links`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(linkData)
            });
            showNotification('🔄 Site updated in real-time!');
        }

        renderLinks();
        closeLinkModal();
    } catch (err) {
        console.error('Error handling link:', err);
        showNotification('❌ Failed to update link');
    }
}

// Edit link
async function editLink(id) {
    const settings = await loadSettingsAsync();
    const link = settings.links.find(l => l.id === id);
    
    if (link) {
        document.getElementById('linkTitle').value = link.title;
        document.getElementById('linkUrl').value = link.url;
        document.getElementById('linkIcon').value = link.icon;
        document.getElementById('linkForm').dataset.editId = id;
        
        // Show preview if icon is image
        const preview = document.getElementById('iconPreview');
        if (link.icon && link.icon.startsWith('data:image')) {
            preview.innerHTML = `<img src="${link.icon}" alt="Icon preview">`;
        } else {
            preview.innerHTML = '';
        }
        
        document.getElementById('linkModal').classList.add('active');
    }
}

// Delete link
async function deleteLink(id) {
    if (confirm('Are you sure you want to delete this link?')) {
        try {
            await fetch(`${API_BASE_URL}/api/links/${id}`, {
                method: 'DELETE'
            });
            renderLinks();
            showNotification('🗑️ Link deleted & synced to site!');
        } catch (err) {
            console.error('Error deleting link:', err);
            showNotification('❌ Failed to delete link');
        }
    }
}

// Switch tabs
function switchTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked tab and button
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.closest('.nav-btn').classList.add('active');
}

// Switch subtabs
function switchSubTab(subtabName, element) {
    // Remove active class from all subtabs
    document.querySelectorAll('.subtab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked subtab and button
    document.getElementById(subtabName + '-subtab').classList.add('active');
    element.classList.add('active');
}

// Reset colors to default
function resetColors() {
    if (confirm('Reset all colors to default?')) {
        document.getElementById('primaryColor').value = '#a855f7';
        document.getElementById('primaryColorHex').value = '#a855f7';
        document.getElementById('secondaryColor').value = '#d946ef';
        document.getElementById('secondaryColorHex').value = '#d946ef';
        document.getElementById('footerColor').value = '#000000';
        document.getElementById('footerColorHex').value = '#000000';
        showNotification('Colors reset to default!');
    }
}

// Preview site
function previewSite() {
    window.open('index.html', '_blank');
}

// Sign out
function signOut() {
    if (confirm('Are you sure you want to sign out?')) {
        // Clear authentication
        sessionStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminAuthTime');
        
        // Redirect to login
        window.location.href = 'login.html';
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #a855f7;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Close modal when clicking outside
document.getElementById('linkModal').addEventListener('click', (e) => {
    if (e.target.id === 'linkModal') {
        closeLinkModal();
    }
});
