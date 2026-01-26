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
    const { password } = req.body;

    if (password !== 'kitkat09') {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Delete old config and set fresh defaults
    await kv.del('kitkat:config');
    await kv.set('kitkat:config', DEFAULT_CONFIG);
    
    console.log('KV cleared and reset with defaults successfully');
    res.status(200).json({ success: true, message: 'Settings reset to defaults.', config: DEFAULT_CONFIG });
  } catch (error) {
    console.error('Error clearing KV:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

