# fs-spy

[![NPM version](https://img.shields.io/npm/v/fs-spy?color=a1b858&label=)](https://www.npmjs.com/package/fs-spy)

Monitoring fs accessing for Node process

## Install

```bash
npm i -D fs-spy
```

## Usage

```bash
node -r fs-spy my-module.js
```

For wrapped CLIs:

```bash
# NODE_OPTIONS=--require=fs-spy <command>
NODE_OPTIONS=--require=fs-spy rollup -c
```

<img width="495" alt="image" src="https://user-images.githubusercontent.com/11247099/164841468-c805fcc0-0cc5-4724-8d38-7c2d8866ea1d.png">

On the process exit, you will get the accessed file tree report and a generated `.fs-spy.json` file under your current working directory.

## Debugging

You can use `fs-spy` to debug why certain file has be accessed by using the hook. For example

```ts
import spy from 'fs-spy'

spy.onFileEvent((event, filepath) => {
  if (filepath.endsWith('.json'))
    throw new Error('See the stack trace')
})
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2022 [Anthony Fu](https://github.com/antfu)
