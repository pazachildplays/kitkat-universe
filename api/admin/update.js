const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG = {
  title: 'Welcome to KitKat Universe',
  bgGradient: 'linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)',
  primaryColor: '#7c3aed',
  secondaryColor: '#d946ef',
  footerColor: '#1a1a1a',
  textColor: '#ffffff',
  commissionsStatus: 'Open',
  links: [
    { id: 1, name: 'Twitter', url: 'https://x.com/KitkatUvU', icon: '𝕏' },
    { id: 2, name: 'Twitch', url: 'https://www.twitch.tv/kitkaturvu', icon: '📺' },
    { id: 3, name: 'Tiktok', url: 'https://www.tiktok.com/@kitkat.uvu', icon: '🎵' },
    { id: 4, name: 'Youtube', url: 'https://www.youtube.com/@KitKatUvU', icon: '▶️' },
    { id: 5, name: 'VGen', url: 'https://vgen.co/kitkaturvu', icon: '🎨' }
  ],
  contacts: [
    { id: 1, type: 'email', label: 'Email', value: 'contact@kitkat.com', icon: '📧' },
    { id: 2, type: 'phone', label: 'Phone', value: '+1 (555) 123-4567', icon: '📱' }
  ]
};

const configPath = process.env.VERCEL ? '/tmp/config.json' : path.join(process.cwd(), 'data', 'config.json');

async function getConfig() {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(data);
      return {
        ...DEFAULT_CONFIG,
        ...config,
        links: config.links && config.links.length > 0 ? config.links : DEFAULT_CONFIG.links,
        contacts: config.contacts && config.contacts.length > 0 ? config.contacts : DEFAULT_CONFIG.contacts
      };
    }
    return DEFAULT_CONFIG;
  } catch (error) {
    console.error('Error reading config:', error);
    return DEFAULT_CONFIG;
  }
}

async function saveConfig(config) {
  try {
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving config:', error);
    return false;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password, updates } = req.body;

    if (password !== 'kitkat09') {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const config = await getConfig();
    const updatedConfig = { ...config, ...updates };

    if (await saveConfig(updatedConfig)) {
      res.status(200).json({ success: true, config: updatedConfig });
    } else {
      res.status(500).json({ success: false, message: 'Error saving config' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
