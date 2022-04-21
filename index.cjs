const { resolve } = require('path')

const internalFs = process.binding('fs')

const _open = internalFs.open
internalFs.open = function(...args) {
  onOpen(args[0])
  return _open(...args)
}
const openFileHandle = internalFs.openFileHandle
internalFs.openFileHandle = function(...args) {
  onOpen(args[0])
  return openFileHandle(...args)
}

const map = new Map()

function onOpen(path) {
  const abs = resolve(process.cwd(), path)
  console.log('[open]', abs)
  map.set(abs, (map.get(abs)) || 0 + 1)
}

process.on('beforeExit', () => {
  console.log('[fs]', map)
})
