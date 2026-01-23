const fs = require('fs');
const path = require('path');

function getConfig() {
  try {
    const possiblePaths = [
      path.join(process.cwd(), 'data', 'config.json'),
      path.join(__dirname, '..', 'data', 'config.json'),
      '/tmp/config.json'
    ];

    for (const configPath of possiblePaths) {
      try {
        if (fs.existsSync(configPath)) {
          const data = fs.readFileSync(configPath, 'utf8');
          return JSON.parse(data);
        }
      } catch (e) {
        // Continue
      }
    }

    return {
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
  } catch (error) {
    console.error('Error reading config:', error);
    return {};
  }
}

function saveConfig(config) {
  try {
    const configPath = path.join(process.cwd(), 'data', 'config.json');
    const dir = path.dirname(configPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
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
    const { password } = req.body;

    if (password === 'kitkat09') {
      res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
