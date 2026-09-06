const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('C:/Users/JERINE JOSHWA/.gemini/antigravity-ide/brain/f65619b2-c7d7-489c-9a0d-0697eaddab1a/.system_generated/logs/transcript_full.jsonl');
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineNum = 0;
rl.on('line', (line) => {
  lineNum++;
  if (lineNum === 168) {
    const obj = JSON.parse(line);
    console.log('Keys on line 168:', Object.keys(obj));
    if (obj.tool_calls) {
      obj.tool_calls.forEach(tc => {
        console.log('Tool call:', tc.name);
        if (tc.args && tc.args.CodeContent) {
          fs.writeFileSync('line_168_code.jsx', tc.args.CodeContent, 'utf8');
          console.log('Wrote line_168_code.jsx, size:', tc.args.CodeContent.length);
        }
      });
    }
  }
});

rl.on('close', () => {
  console.log('Finished reading line 168.');
});
