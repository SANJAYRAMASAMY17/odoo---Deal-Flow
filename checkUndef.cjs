const { execSync } = require('child_process');
const fs = require('fs');

const allFiles = [
  'src/components/Dashboard.jsx',
  'src/components/DashboardHeader.jsx',
  'src/components/DashboardModals.jsx',
  ...fs.readdirSync('src/components/sections')
    .filter(f => f.endsWith('.jsx'))
    .map(f => 'src/components/sections/' + f)
];

let hasFail = false;

allFiles.forEach(file => {
  try {
    execSync('npx eslint ' + file + ' -f json', { shell: 'cmd.exe', maxBuffer: 10 * 1024 * 1024 });
    console.log('PASS (clean):', file);
  } catch (err) {
    const output = err.stdout ? err.stdout.toString() : '';
    if (output) {
      try {
        const results = JSON.parse(output);
        const undefs = new Set();
        results.forEach(fileRes => {
          fileRes.messages.forEach(m => {
            const match = m.message.match(/'([^']+)' is not defined/);
            if (match) undefs.add(match[1]);
          });
        });
        if (undefs.size > 0) {
          console.log('FAIL (undef):', file, 'Undefined:', Array.from(undefs));
          hasFail = true;
        } else {
          console.log('PASS (no undef):', file);
        }
      } catch (e) {
        console.log('Parse error for', file);
      }
    }
  }
});

if (!hasFail) {
  console.log('\n>>> ALL 14 FILES PASSED ZERO-UNDEFINED CHECK! <<<');
}
