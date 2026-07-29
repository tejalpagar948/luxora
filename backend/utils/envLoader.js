const fs = require('fs');
const path = require('path');

/**
 * Custom lightweight environment variables loader.
 * Parses backend/.env file and loads variables into process.env.
 */
function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split(/\r?\n/);
      
      lines.forEach((line) => {
        const cleanLine = line.trim();
        // Ignore empty lines and comments
        if (!cleanLine || cleanLine.startsWith('#')) {
          return;
        }
        
        const eqIdx = cleanLine.indexOf('=');
        if (eqIdx === -1) return;
        
        const key = cleanLine.substring(0, eqIdx).trim();
        let val = cleanLine.substring(eqIdx + 1).trim();
        
        // Unquote value if quoted
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.substring(1, val.length - 1);
        }
        
        // Set env variable if not already set (retaining existing environment overrides)
        if (process.env[key] === undefined) {
          process.env[key] = val;
        }
      });
    }
  } catch (err) {
    console.error('Warning: Failed to load .env file:', err.message);
  }
}

module.exports = loadEnv;
