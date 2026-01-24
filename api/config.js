const { kv } = require('@vercel/kv');

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

async function getConfig() {
  try {
    const config = await kv.get('kitkat:config');
    if (!config) {
      return DEFAULT_CONFIG;
    }
    // Merge with defaults to ensure all required fields exist
    const merged = {
      ...DEFAULT_CONFIG,
      ...config,
      // If links is empty, use defaults
      links: config.links && config.links.length > 0 ? config.links : DEFAULT_CONFIG.links,
      // If contacts is empty, use defaults
      contacts: config.contacts && config.contacts.length > 0 ? config.contacts : DEFAULT_CONFIG.contacts
    };
    return merged;
  } catch (error) {
    console.error('Error reading config from KV:', error);
    return DEFAULT_CONFIG;
  }
}

async function saveConfig(config) {
  try {
    await kv.set('kitkat:config', config);
    return true;
  } catch (error) {
    console.error('Error saving config to KV:', error);
    return false;
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
