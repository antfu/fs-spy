import { resolve } from 'path'
import { writeFileSync } from 'fs'
import { partition } from '@antfu/utils'
import { displayBadge, displayTree, openBadge } from './display'

const HIDE_NODE_MODULES = true

/* eslint-disable no-console */
// @ts-expect-error i know
// eslint-disable-next-line n/no-deprecated-api
const _internalFs = process.binding('fs')

const _open = _internalFs.open
_internalFs.open = function(...args: any[]) {
  _onOpen(args[0])
  return _open(...args)
}

const _access = _internalFs.access
_internalFs.access = function(...args: any[]) {
  _onOpen(args[0])
  return _access(...args)
}

const _stat = _internalFs.stat
_internalFs.stat = function(...args: any[]) {
  _onOpen(args[0])
  return _stat(...args)
}

const _lstat = _internalFs.lstat
_internalFs.lstat = function(...args: any[]) {
  _onOpen(args[0])
  return _lstat(...args)
}

const _openFileHandle = _internalFs.openFileHandle
_internalFs.openFileHandle = function(...args: any[]) {
  _onOpen(args[0])
  return _openFileHandle(...args)
}

const _listeners: OnFileOpenListener[] = []

export type OnFileOpenListener = (path: string) => void
export function onFileOpen(fn: OnFileOpenListener) {
  _listeners.push(fn)
  return () => {
    const i = _listeners.indexOf(fn)
    if (i >= 0)
      _listeners.splice(i, 1)
  }
}

export const counter = new Map<string, number>()

function _onOpen(path: string) {
  if (typeof path !== 'string')
    return
  if (HIDE_NODE_MODULES && path.includes('node_modules'))
    return
  // remove messy leading '\\' or '\\\\?\\' Universal Naming Convention (UNC) prefix in windows' file path
  const normalizedPath = path.replace(/\\\\*\??\\+/, '')
  const abs = resolve(process.cwd(), normalizedPath)
  _listeners.forEach(fn => fn(abs))
  console.log(openBadge, abs)
  counter.set(abs, (counter.get(abs) || 0) + 1)
}

process.on('beforeExit', () => {
  const entries = [...counter.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  writeFileSync('.fs-spy.json', JSON.stringify(Object.fromEntries(entries), null, 2))
  const cwd = process.cwd()
  const [relative, absolute] = partition(entries, i => i[0].startsWith(cwd))

  displayBadge()
  displayTree(absolute, '', '/')
  displayTree(relative, cwd, cwd)
})
