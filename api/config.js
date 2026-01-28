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
    
    // Fallback to local file (for local development)
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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const config = await getConfig();
    res.status(200).json(config);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
