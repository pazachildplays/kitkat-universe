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
  contacts: [],
  leaderboards: {}
};

const configPath = path.join(process.cwd(), 'data', 'config.json');

async function getConfig() {
  try {
    // Try KV first (on Vercel)
    if (process.env.REDIS_URL) {
      const config = await kv.get('kitkat:config');
      return config || DEFAULT_CONFIG;
    }
    
    // Fallback to local file
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(data) || DEFAULT_CONFIG;
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
    const { game, playerName, score } = req.body;
    
    if (!game || !playerName || score === undefined) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    
    const config = await getConfig();
    config.leaderboards = config.leaderboards || {};
    config.leaderboards[game] = config.leaderboards[game] || [];
    
    // Check if player already exists
    const existingIndex = config.leaderboards[game].findIndex(e => e.playerName === playerName);
    
    if (existingIndex >= 0) {
      // Update if new score is higher
      if (score > config.leaderboards[game][existingIndex].score) {
        config.leaderboards[game][existingIndex].score = score;
      }
    } else {
      // Add new entry
      config.leaderboards[game].push({ playerName, score });
    }
    
    // Sort by score descending
    config.leaderboards[game].sort((a, b) => b.score - a.score);
    
    if (await saveConfig(config)) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to save leaderboard' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};
