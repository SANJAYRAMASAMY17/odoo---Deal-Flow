const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('C:/Users/JERINE JOSHWA/.gemini/antigravity-ide/brain/f65619b2-c7d7-489c-9a0d-0697eaddab1a/.system_generated/logs/transcript_full.jsonl');
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineNum = 0;
rl.on('line', (line) => {
  lineNum++;
  if (line.includes('handleCreateQuotationSubmit') || line.includes('openQuotationDetail')) {
    if (line.length > 2000) {
      try {
        const obj = JSON.parse(line);
        if (obj.content && obj.content.includes('const Dashboard =')) {
          console.log('Found content on line', lineNum, 'length:', obj.content.length);
        }
        if (obj.tool_calls) {
          obj.tool_calls.forEach(tc => {
            if (tc.args) {
              for (const k of Object.keys(tc.args)) {
                const val = tc.args[k];
                if (typeof val === 'string' && val.includes('handleCreateQuotationSubmit') && val.includes('openQuotationDetail')) {
                  console.log('Found tool call arg', k, 'on line', lineNum, 'length:', val.length);
                  if (val.length > 20000) {
                    fs.writeFileSync(`recovered_${k}_${lineNum}.txt`, val, 'utf8');
                    console.log('Wrote to recovered_' + k + '_' + lineNum + '.txt');
                  }
                }
              }
            }
          });
        }
      } catch (e) {
      }
    }
  }
});

rl.on('close', () => {
  console.log('Done scanning transcript.');
});
