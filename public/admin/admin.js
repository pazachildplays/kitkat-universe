let adminPassword = null;
let currentConfig = {};

// Login functionality
function handleLoginKeyPress(event) {
    if (event.key === 'Enter') {
        adminLogin();
    }
}

async function adminLogin() {
    const password = document.getElementById('passwordInput').value;
    const loginError = document.getElementById('loginError');

    if (!password) {
        loginError.textContent = 'Please enter a password';
        return;
    }

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });

        const data = await response.json();
        console.log('Login response:', data, 'Status:', response.status);

        if (data.success && response.status === 200) {
            adminPassword = password;
            loginError.textContent = '';
            document.getElementById('login-modal').classList.add('hidden');
            document.getElementById('admin-dashboard').classList.remove('hidden');
            loadDashboardData();
        } else {
            loginError.textContent = data.message || 'Invalid password';
            console.error('Login failed:', data.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = 'Connection error - check console';
    }
}

function adminLogout() {
    adminPassword = null;
    document.getElementById('passwordInput').value = '';
    document.getElementById('login-modal').classList.remove('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const response = await fetch('/api/config');
        currentConfig = await response.json();
        
        // Update dashboard
        document.getElementById('commissionDisplay').textContent = currentConfig.commissionsStatus || 'Open';
        document.getElementById('linkCount').textContent = (currentConfig.links || []).length;
        
        // Update links tab
        displayLinks();
        
        // Update contacts tab
        displayContacts();
        
        // Update settings tab
        document.getElementById('settingTitle').value = currentConfig.title || '';
        document.getElementById('commissionStatus').value = currentConfig.commissionsStatus || 'Open';
        document.getElementById('bgGradient').value = currentConfig.bgGradient || '';
        
        // Set color inputs and pickers
        document.getElementById('primaryColor').value = currentConfig.primaryColor || '#7c3aed';
        document.getElementById('primaryColorPicker').value = currentConfig.primaryColor || '#7c3aed';
        
        document.getElementById('secondaryColor').value = currentConfig.secondaryColor || '#d946ef';
        document.getElementById('secondaryColorPicker').value = currentConfig.secondaryColor || '#d946ef';
        
        document.getElementById('footerColor').value = currentConfig.footerColor || '#1a1a1a';
        document.getElementById('footerColorPicker').value = currentConfig.footerColor || '#1a1a1a';
        
        document.getElementById('textColor').value = currentConfig.textColor || '#ffffff';
        document.getElementById('textColorPicker').value = currentConfig.textColor || '#ffffff';
        
        // Add event listeners for color sync
        setupColorSync();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Sync color inputs and pickers
function setupColorSync() {
    const colorFields = [
        { text: 'primaryColor', picker: 'primaryColorPicker' },
        { text: 'secondaryColor', picker: 'secondaryColorPicker' },
        { text: 'footerColor', picker: 'footerColorPicker' },
        { text: 'textColor', picker: 'textColorPicker' }
    ];
    
    colorFields.forEach(field => {
        const textInput = document.getElementById(field.text);
        const pickerInput = document.getElementById(field.picker);
        
        // Text input updates picker
        if (textInput) {
            textInput.addEventListener('change', () => {
                if (isValidHexColor(textInput.value)) {
                    pickerInput.value = textInput.value;
                }
            });
        }
        
        // Picker updates text input
        if (pickerInput) {
            pickerInput.addEventListener('input', () => {
                textInput.value = pickerInput.value;
            });
        }
    });
}

// Display links
function displayLinks() {
    const linksList = document.getElementById('links-list');
    linksList.innerHTML = '';
    
    if (currentConfig.links && currentConfig.links.length > 0) {
        currentConfig.links.forEach(link => {
            const linkItem = document.createElement('div');
            linkItem.className = 'link-item';
            linkItem.innerHTML = `
                <div class="link-info">
                    <div class="link-name">${link.icon} ${link.name}</div>
                    <div class="link-url">${link.url}</div>
                </div>
                <div class="link-actions">
                    <button class="btn-danger" onclick="deleteLink(${link.id})">🗑️ Delete</button>
                </div>
            `;
            linksList.appendChild(linkItem);
        });
    }
}

// Add link form
function showAddLinkForm() {
    document.getElementById('add-link-form').classList.remove('hidden');
}

function cancelAddLink() {
    document.getElementById('add-link-form').classList.add('hidden');
    document.getElementById('linkName').value = '';
    document.getElementById('linkUrl').value = '';
    document.getElementById('linkIcon').value = '🔗';
}

async function saveNewLink() {
    const name = document.getElementById('linkName').value;
    const url = document.getElementById('linkUrl').value;
    const icon = document.getElementById('linkIcon').value;

    if (!name || !url) {
        alert('Please fill in all fields');
        return;
    }

    const newLink = {
        id: Date.now(),
        name,
        url,
        icon
    };

    currentConfig.links = currentConfig.links || [];
    currentConfig.links.push(newLink);

    try {
        const response = await fetch('/api/admin/links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: adminPassword,
                links: currentConfig.links
            })
        });

        const data = await response.json();
        if (data.success) {
            cancelAddLink();
            displayLinks();
            document.getElementById('linkCount').textContent = currentConfig.links.length;
        }
    } catch (error) {
        console.error('Error saving link:', error);
        alert('Failed to save link');
    }
}

async function deleteLink(id) {
    if (!confirm('Are you sure you want to delete this link?')) {
        return;
    }

    currentConfig.links = currentConfig.links.filter(link => link.id !== id);

    try {
        const response = await fetch('/api/admin/links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: adminPassword,
                links: currentConfig.links
            })
        });

        const data = await response.json();
        if (data.success) {
            displayLinks();
            document.getElementById('linkCount').textContent = currentConfig.links.length;
        }
    } catch (error) {
        console.error('Error deleting link:', error);
        alert('Failed to delete link');
    }
}

// Contact management
function displayContacts() {
    const contactsList = document.getElementById('contacts-list');
    contactsList.innerHTML = '';
    
    if (currentConfig.contacts && currentConfig.contacts.length > 0) {
        currentConfig.contacts.forEach(contact => {
            const contactItem = document.createElement('div');
            contactItem.className = 'contact-item';
            contactItem.innerHTML = `
                <div class="contact-info">
                    <div class="contact-label">${contact.icon} ${contact.label}</div>
                    <div class="contact-value">${contact.value}</div>
                </div>
                <div class="contact-actions">
                    <button class="btn-danger" onclick="deleteContact(${contact.id})">🗑️ Delete</button>
                </div>
            `;
            contactsList.appendChild(contactItem);
        });
    }
}

function showAddContactForm() {
    document.getElementById('add-contact-form').classList.remove('hidden');
}

function cancelAddContact() {
    document.getElementById('add-contact-form').classList.add('hidden');
    document.getElementById('contactLabel').value = '';
    document.getElementById('contactValue').value = '';
    document.getElementById('contactIcon').value = '📧';
}

async function saveNewContact() {
    const label = document.getElementById('contactLabel').value;
    const value = document.getElementById('contactValue').value;
    const icon = document.getElementById('contactIcon').value;

    if (!label || !value) {
        alert('Please fill in all fields');
        return;
    }

    const newContact = {
        id: Date.now(),
        label,
        value,
        icon,
        type: label.toLowerCase()
    };

    currentConfig.contacts = currentConfig.contacts || [];
    currentConfig.contacts.push(newContact);

    try {
        const response = await fetch('/api/admin/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: adminPassword,
                updates: { contacts: currentConfig.contacts }
            })
        });

        const data = await response.json();
        if (data.success) {
            currentConfig = data.config;
            cancelAddContact();
            displayContacts();
        }
    } catch (error) {
        console.error('Error saving contact:', error);
        alert('Failed to save contact');
    }
}

async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) {
        return;
    }

    currentConfig.contacts = currentConfig.contacts.filter(contact => contact.id !== id);

    try {
        const response = await fetch('/api/admin/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: adminPassword,
                updates: { contacts: currentConfig.contacts }
            })
        });

        const data = await response.json();
        if (data.success) {
            currentConfig = data.config;
            displayContacts();
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Failed to delete contact');
    }
}

// Validate hex color
function isValidHexColor(hex) {
    return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

// Save settings
async function saveSetting(key, value) {
    // Validate color inputs
    if (['primaryColor', 'secondaryColor', 'footerColor', 'textColor'].includes(key)) {
        if (!isValidHexColor(value)) {
            alert('Invalid color code. Use format: #RRGGBB (e.g., #ff0000)');
            return;
        }
    }
    
    const updates = { [key]: value };

    try {
        const response = await fetch('/api/admin/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: adminPassword,
                updates
            })
        });

        const data = await response.json();
        if (data.success) {
            currentConfig = data.config;
            alert('✓ Setting saved successfully!');
            // Reload dashboard data to sync all fields
            loadDashboardData();
        }
    } catch (error) {
        console.error('Error saving setting:', error);
        alert('Failed to save setting');
    }
}

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected tab
    const tabId = tabName + '-tab';
    const tabElement = document.getElementById(tabId);
    if (tabElement) {
        tabElement.classList.add('active');
    }
    
    // Mark menu item as active
    event.target.classList.add('active');
    
    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        links: 'Manage Links',
        contacts: 'Contact Information',
        settings: 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[tabName] || 'Dashboard';
}

// Preview viewer site
function openPreview() {
    window.open('/', '_blank');
}

// Load dashboard on page load
loadDashboardData();

// Poll for config updates from other admin sessions
setInterval(loadDashboardData, 5000);
