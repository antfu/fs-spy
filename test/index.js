const fs = require('fs')
const fsp = require('fs/promises')
const spy = require('..')

spy.onFileEvent((event, filepath) => {
  // if (filepath.endsWith('.json'))
  //   throw new Error('See the stack trace')
})

fs.statSync('package.json')
fsp.stat('package.json')
fs.readFileSync('package.json')
fs.existsSync('index.cjs')
fsp.readFile('README.md')
fs.readFileSync('README.md')
fs.accessSync('.gitignore')
fsp.lstat('.gitignore')
fs.lstatSync('.gitignore')
