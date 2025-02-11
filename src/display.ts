/* eslint-disable no-console */
import { sep } from 'path'
import { blue, gray, green, magenta } from 'ansis'

export interface TreeNode<T> {
  name: string
  data?: T
  children: TreeNode<T>[]
}

function createNode<T>(path: string[], tree: TreeNode<T>[], data?: T): void {
  const name = path.shift()!
  const idx = tree.findIndex((e: TreeNode<T>) => {
    return e.name === name
  })
  if (idx < 0) {
    tree.push({
      name,
      data: path.length ? undefined : data,
      children: [],
    })
    if (path.length !== 0)
      createNode(path, tree[tree.length - 1].children, data)
  }
  else {
    createNode(path, tree[idx].children, data)
  }
}

function pathListToTree<T>(data: [string, T][]): TreeNode<T>[] {
  const tree: TreeNode<T>[] = []
  for (let i = 0; i < data.length; i++) {
    const path: string = data[i][0]
    const split: string[] = path.split(sep)
    createNode(split, tree, data[i][1])
  }
  return tree
}

export function displayBadge() {
  console.log()
  console.log(magenta.bold.inverse(' FSSPY ') + magenta(' Summary'))
}

export function displayTree(entries: [string, number][], root = '', message = '') {
  if (entries.length === 0)
    return

  console.log()
  console.log(blue(message), `(${entries.length})`)
  const tree = pathListToTree<number>(entries.map(i => [i[0].slice(root.length), i[1]]))
  console.log(renderTreeNodes(tree[0].children, '', false, true).join('\n'))
}

function renderTreeNodes(nodes: TreeNode<number>[], indent = '', prevLast = false, root = false): string[] {
  return nodes.flatMap((child, i) => {
    const last = i === nodes.length - 1
    return renderTreeNode(
      child,
      root
        ? ''
        : prevLast
          ? `${indent}   `
          : `${indent}│  `,
      last ? '└─' : '├─',
      last,
    )
  })
}
function renderTreeNode(node: TreeNode<number>, indent = '', prefix = '├─', prevLast = false): string[] {
  if (node.children.length === 1) {
    return renderTreeNode({
      ...node.children[0],
      name: `${node.name}${sep}${node.children[0].name}`,
    }, indent, prefix, prevLast)
  }
  return [
    (node.name ? `${gray`${indent}${prefix} `}${node.name}` : '') + (node.data ? green` x${node.data}` : ''),
    ...renderTreeNodes(node.children, indent, prevLast),
  ]
}
