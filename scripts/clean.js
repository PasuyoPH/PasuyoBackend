// to clean output folder
// run only on top of module, recommended via npm
const { rmSync } = require('fs'),
  outDir = '/dist',
  cwd    = process.cwd()

rmSync(
  cwd + outDir,
  { recursive: true, force: true }
)

console.log('Removed', outDir)