require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://kitkat:kitkat09@cluster0.mongodb.net/kitkat-universe?retryWrites=true&w=majority';

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB Connected');
}).catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
});

// Schema for Site Settings
const settingsSchema = new mongoose.Schema({
    adminPanelName: String,
    username: String,
    commissionStatus: String,
    tagline: String,
    aboutSection: String,
    servicesSection: String,
    profilePicture: String,
    bannerImage: String,
    backgroundMusic: String,
    contactEmail: String,
    contactPhone: String,
    sideStickers: String,
    contactUs: String,
    primaryColor: String,
    secondaryColor: String,
    footerColor: String,
    fontFamily: String,
    links: [{
        id: Number,
        title: String,
        url: String,
        icon: String
    }],
    updatedAt: { type: Date, default: Date.now }
});

const Settings = mongoose.model('Settings', settingsSchema);

// Default Settings
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

// Initialize settings on startup
async function initializeSettings() {
    try {
        const existingSettings = await Settings.findOne();
        if (!existingSettings) {
            await Settings.create(DEFAULT_SETTINGS);
            console.log('✅ Default settings initialized');
        }
    } catch (err) {
        console.error('Error initializing settings:', err);
    }
}

// Routes

// Get all settings
app.get('/api/settings', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create(DEFAULT_SETTINGS);
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update settings
app.post('/api/settings', async (req, res) => {
    try {
        const updatedSettings = {
            ...req.body,
            updatedAt: new Date()
        };
        
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create(updatedSettings);
        } else {
            settings = await Settings.findOneAndUpdate({}, updatedSettings, { new: true });
        }
        
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add link
app.post('/api/links', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create(DEFAULT_SETTINGS);
        }
        
        const newId = Math.max(...settings.links.map(l => l.id), 0) + 1;
        const newLink = {
            id: newId,
            ...req.body
        };
        
        settings.links.push(newLink);
        settings = await settings.save();
        
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update link
app.put('/api/links/:id', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            return res.status(404).json({ error: 'Settings not found' });
        }
        
        const linkIndex = settings.links.findIndex(l => l.id == req.params.id);
        if (linkIndex === -1) {
            return res.status(404).json({ error: 'Link not found' });
        }
        
        settings.links[linkIndex] = {
            ...settings.links[linkIndex],
            ...req.body
        };
        
        settings = await settings.save();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete link
app.delete('/api/links/:id', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            return res.status(404).json({ error: 'Settings not found' });
        }
        
        settings.links = settings.links.filter(l => l.id != req.params.id);
        settings = await settings.save();
        
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    initializeSettings();
});
