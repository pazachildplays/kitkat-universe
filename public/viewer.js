// Load and display config on page load
async function loadConfig() {
    try {
        const response = await fetch('/api/config');
        const config = await response.json();
        
        // Apply primary and secondary colors via CSS variables for dynamic styling
        document.documentElement.style.setProperty('--primary-color', config.primaryColor || '#7c3aed');
        document.documentElement.style.setProperty('--secondary-color', config.secondaryColor || '#d946ef');
        
        // Update background using CSS variables (not inline style)
        // This allows the CSS to use var(--primary-color) and var(--secondary-color)
        
        // Update text color
        document.body.style.color = config.textColor || "#ffffff";
        
        // Update title
        const titleElement = document.getElementById('title');
        if (titleElement) {
            titleElement.textContent = config.title || "Welcome to KitKat Universe";
            titleElement.style.color = config.textColor || "#ffffff";
        }
        
        // Update commissions status
        const commissionsText = document.getElementById('commissionsText');
        if (commissionsText) {
            commissionsText.textContent = `Commissions : ${config.commissionsStatus || 'Open'}`;
        }
        
        // Load links
        const linksContainer = document.getElementById('links-container');
        if (linksContainer && config.links && config.links.length > 0) {
            linksContainer.innerHTML = '';
            config.links.forEach(link => {
                const linkBox = document.createElement('a');
                linkBox.href = link.url;
                linkBox.target = '_blank';
                linkBox.className = 'link-box';
                linkBox.innerHTML = `
                    <span class="icon">${link.icon || '🔗'}</span>
                    <span class="name">${link.name}</span>
                `;
                linksContainer.appendChild(linkBox);
            });
        }
        
        // Load contacts and update footer
        const footer = document.getElementById('footer');
        if (footer) {
            footer.style.background = config.footerColor || "#1a1a1a";
        }
        
        const contactsContainer = document.getElementById('contacts-container');
        if (contactsContainer && config.contacts && config.contacts.length > 0) {
            contactsContainer.innerHTML = '';
            config.contacts.forEach(contact => {
                const contactItem = document.createElement('div');
                contactItem.className = 'contact-item';
                contactItem.innerHTML = `
                    <span class="contact-icon">${contact.icon || '📧'}</span>
                    <span class="contact-label">${contact.label}</span>
                    <span class="contact-value">${contact.value}</span>
                `;
                contactsContainer.appendChild(contactItem);
            });
        }
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

// Poll for config changes every 2 seconds
setInterval(loadConfig, 2000);

// Initial load
loadConfig();
