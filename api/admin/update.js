const { kv } = require('@vercel/kv');

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

async function getConfig() {
  try {
    const config = await kv.get('kitkat:config');
    return config || DEFAULT_CONFIG;
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
