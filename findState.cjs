const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('C:/Users/JERINE JOSHWA/.gemini/antigravity-ide/brain/f65619b2-c7d7-489c-9a0d-0697eaddab1a/.system_generated/logs/transcript_full.jsonl');
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineNum = 0;
rl.on('line', (line) => {
  lineNum++;
  if (line.includes('handleApproveQuotation') && line.includes('handleReturnQuotation')) {
    console.log('Found line', lineNum, 'length:', line.length);
    if (line.length > 5000) {
      try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
          obj.tool_calls.forEach(tc => {
            if (tc.args && tc.args.ReplacementContent) {
              console.log('  ReplacementContent on line', lineNum, 'len:', tc.args.ReplacementContent.length);
              fs.writeFileSync(`state_${lineNum}.txt`, tc.args.ReplacementContent, 'utf8');
            }
          });
        }
      } catch (e) {}
    }
  }
});

rl.on('close', () => {
  console.log('Done searching state.');
});
