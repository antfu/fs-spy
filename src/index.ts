import { resolve } from 'path'
import { writeFileSync } from 'fs'
import { partition } from '@antfu/utils'
import { yellow } from 'ansis'
import { displayBadge, displayTree } from './display'

// make them configurable by env
const HIDE_NODE_MODULES = true
const LOG = true

export const SupportedEvents = [
  'open',
  'openFileHandle',
  'stat',
  'lstat',
  'access',
] as const

export type FileSystemEvent = typeof SupportedEvents[number]
export type EventLog = [
  event: FileSystemEvent,
  filepath: string,
  timestamp: number,
]

export const eventsLog: EventLog[] = []
export const counter = new Map<string, number>()

export function registerSpy() {
  /* eslint-disable no-console */
  // @ts-expect-error i know
  // eslint-disable-next-line n/no-deprecated-api
  const _internalFs = process.binding('fs')
  SupportedEvents.forEach((event) => {
    const _fn = _internalFs[event]
    _internalFs[event] = function(...args: any[]) {
      _onEvent(event, args[0])
      return _fn(...args)
    }
  })
}

const _listeners: OnFileEventListener[] = []

export type OnFileEventListener = (...e: EventLog) => void
export function onFileEvent(fn: OnFileEventListener) {
  _listeners.push(fn)
  return () => {
    const i = _listeners.indexOf(fn)
    if (i >= 0)
      _listeners.splice(i, 1)
  }
}

function _onEvent(event: FileSystemEvent, path: string) {
  if (typeof path !== 'string')
    return
  if (HIDE_NODE_MODULES && path.includes('node_modules'))
    return
    // remove messy leading '\\' or '\\\\?\\' Universal Naming Convention (UNC) prefix in windows' file path
  const normalizedPath = path.replace(/\\\\*\??\\+/, '')
  const abs = resolve(process.cwd(), normalizedPath)
  const log: EventLog = [event, abs, Date.now()]
  eventsLog.push(log)
  _listeners.forEach(fn => fn(...log))
  if (LOG)
    console.log(yellow`[fs.${event}]`, abs)
  counter.set(abs, (counter.get(abs) || 0) + 1)
}

export function writeLog(path = '.fs-spy.json') {
  writeFileSync(path, JSON.stringify(eventsLog, null, 2))
}

export function printCountTree() {
  const entries = [...counter.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  const cwd = process.cwd()
  const [relative, absolute] = partition(entries, i => i[0].startsWith(cwd))

  displayBadge()
  displayTree(absolute, '', '/')
  displayTree(relative, cwd, cwd)
}

registerSpy()
process.on('beforeExit', () => {
  writeLog()
  printCountTree()
})
