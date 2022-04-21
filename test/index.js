const fs = require('fs')
const fsp = require('fs/promises')

fs.readFileSync('package.json')
fs.existsSync('index.cjs')
fsp.readFile('README.md')
fs.readFileSync('README.md')
