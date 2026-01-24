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

