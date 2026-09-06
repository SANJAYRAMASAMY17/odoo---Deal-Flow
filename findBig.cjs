const fs = require('fs');
const logPath = 'C:/Users/JERINE JOSHWA/.gemini/antigravity-ide/brain/f65619b2-c7d7-489c-9a0d-0697eaddab1a/.system_generated/logs/transcript_full.jsonl';

const stream = fs.readFileSync(logPath, 'utf8');
const lines = stream.split('\n');

for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].length > 100000 && lines[i].includes('const initialWarehouseStock') && lines[i].includes('handleCreateQuotationSubmit')) {
    console.log('Found massive log line at', i, 'Length:', lines[i].length);
    const parsed = JSON.parse(lines[i]);
    fs.writeFileSync('full_file_found.json', JSON.stringify(parsed, null, 2), 'utf8');
    console.log('Saved to full_file_found.json');
    break;
  }
}
