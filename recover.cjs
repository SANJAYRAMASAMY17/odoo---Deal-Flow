const fs = require('fs');
const logPath = 'C:/Users/JERINE JOSHWA/.gemini/antigravity-ide/brain/f65619b2-c7d7-489c-9a0d-0697eaddab1a/.system_generated/logs/transcript_full.jsonl';

const stream = fs.readFileSync(logPath, 'utf8');
const lines = stream.split('\n');

for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('initialWarehouseStock') && lines[i].includes('const Dashboard = ({ setIsAuthenticated }) => {')) {
    console.log('Found full Dashboard match at transcript line', i);
    const json = JSON.parse(lines[i]);
    // Save to backup
    fs.writeFileSync('dashboard_recovered.txt', JSON.stringify(json, null, 2), 'utf8');
    console.log('Saved to dashboard_recovered.txt');
    break;
  }
}
