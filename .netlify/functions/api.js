const fs = require('fs');
const path = require('path');

// For Netlify, we need to handle file paths carefully
const getConfigPath = () => {
  // Try multiple possible paths
  const possiblePaths = [
    path.join(__dirname, '../../data/config.json'),
    '/var/task/data/config.json',
    process.env.LAMBDA_TASK_ROOT ? path.join(process.env.LAMBDA_TASK_ROOT, 'data/config.json') : null,
  ].filter(Boolean);
  
  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        return p;
      }
    } catch (e) {}
  }
  
  // Return default path as fallback
  return path.join(__dirname, '../../data/config.json');
};

function getConfig() {
  try {
    const configPath = getConfigPath();
    const data = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading config:', error);
    return getDefaultConfig();
  }
}

function getDefaultConfig() {
  return {
    title: "Welcome to KitKat Universe",
    bgGradient: "linear-gradient(135deg, #5b7cfa 0%, #d946ef 100%)",
    primaryColor: "#7c3aed",
    secondaryColor: "#d946ef",
    footerColor: "#1a1a1a",
    textColor: "#ffffff",
    commissionsStatus: "Open",
    links: [],
    contacts: []
  };
}

function saveConfig(data) {
  try {
    const configPath = getConfigPath();
    const dir = path.dirname(configPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing config:', error);
    return false;
  }
}

exports.handler = async (event, context) => {
  const { path, httpMethod, body } = event;
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true })
    };
  }

  try {
    // Get config
    if (path === '/api/config' && httpMethod === 'GET') {
      const config = getConfig();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(config)
      };
    }

    // Admin login
    if (path === '/api/admin/login' && httpMethod === 'POST') {
      let data = {};
      try {
        data = JSON.parse(body || '{}');
      } catch (e) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, message: 'Invalid JSON' })
        };
      }
      
      if (data.password === 'kitkat09') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Login successful' })
        };
      } else {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ success: false, message: 'Invalid password' })
        };
      }
    }

    // Update config
    if (path === '/api/admin/update' && httpMethod === 'POST') {
      let data = {};
      try {
        data = JSON.parse(body || '{}');
      } catch (e) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, message: 'Invalid JSON' })
        };
      }
      
      if (data.password !== 'kitkat09') {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ success: false, message: 'Invalid password' })
        };
      }

      const config = getConfig();
      const updatedConfig = { ...config, ...data.updates };
      
      if (saveConfig(updatedConfig)) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, config: updatedConfig })
        };
      } else {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ success: false, message: 'Error saving config' })
        };
      }
    }

    // Update links
    if (path === '/api/admin/links' && httpMethod === 'POST') {
      let data = {};
      try {
        data = JSON.parse(body || '{}');
      } catch (e) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, message: 'Invalid JSON' })
        };
      }
      
      if (data.password !== 'kitkat09') {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ success: false, message: 'Invalid password' })
        };
      }

      const config = getConfig();
      config.links = data.links || [];
      
      if (saveConfig(config)) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, config })
        };
      } else {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ success: false, message: 'Error saving links' })
        };
      }
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ success: false, message: 'Not found' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Server error: ' + error.message })
    };
  }
};
