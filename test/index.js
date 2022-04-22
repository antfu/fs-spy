const fs = require('fs')
const fsp = require('fs/promises')

fs.statSync('package.json')
fsp.stat('package.json')
fs.readFileSync('package.json')
fs.existsSync('index.cjs')
fsp.readFile('README.md')
fs.readFileSync('README.md')
fs.accessSync('.gitignore')
fsp.lstat('.gitignore')
fs.lstatSync('.gitignore')
