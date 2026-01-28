const { kv } = require('@vercel/kv');
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
  links: [],
  contacts: []
};

const configPath = path.join(process.cwd(), 'data', 'config.json');

async function getConfig() {
  try {
    // Try KV first (on Vercel)
    if (process.env.REDIS_URL) {
      const config = await kv.get('kitkat:config');
      if (config) {
        return {
          ...DEFAULT_CONFIG,
          ...config,
          links: config.links && config.links.length > 0 ? config.links : DEFAULT_CONFIG.links,
          contacts: config.contacts && config.contacts.length > 0 ? config.contacts : DEFAULT_CONFIG.contacts
        };
      }
    }
    
    // Fallback to local file
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
    // Save to KV if available (on Vercel)
    if (process.env.REDIS_URL) {
      await kv.set('kitkat:config', config);
      return true;
    }
    
    // Fallback to local file
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
    const { password, links } = req.body;

    if (password !== 'kitkat09') {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const config = await getConfig();
    config.links = links || [];

    if (await saveConfig(config)) {
      res.status(200).json({ success: true, config });
    } else {
      res.status(500).json({ success: false, message: 'Error saving links' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
