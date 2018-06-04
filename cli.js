#!/usr/bin/env node
'use strict'
const meow = require('meow')
const svgSpreact = require('svg-spreact')
const fs = require('fs')
const { write: copy } = require('clipboardy')
const { extname, resolve } = require('path')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const readdirAsync = promisify(fs.readdir)

const copyToClipboard = async text => {
  try {
    await copy(text)
    return true
  } catch (err) {
    return false
  }
}

const cli = meow(
  `
Usage
  $ svg-spreact <folder>
  
Options
  --optimize, -o    Optimize output
  --tidy, -t        Prettify output
  --preffix, -p     Add a prefix into the id
  --suffix, -s      Add a suffix into the id
  --classname, -c   Add a classname to each <use> element
  --filename, -f    Use the filename as id or not
	
Examples
  $ svg-spreact ./icons
  <svg><symbol>…</symbol></svg>
  <svg><use>…</use></svg>
`,
  {
    flags: {
      optimize: {
        type: 'boolean',
        alias: 'o',
        default: true,
      },
      tidy: {
        type: 'boolean',
        alias: 't',
        default: true,
      },
      prefix: {
        type: 'string',
        alias: 'p',
        default: '',
      },
      suffix: {
        type: 'string',
        alias: 's',
        default: '',
      },
      classname: {
        type: 'string',
        alias: 'c',
        default: '',
      },
      filename: {
        type: 'boolean',
        alias: 'f',
        default: true,
      },
    },
  }
)

const readFolder = async folder => {
  let svgs = []
  const folderToRead = folder || './'
  try {
    const files = await readdirAsync(folderToRead)
    const filtered = files.filter(file => extname(file) === '.svg')
    if (filtered.length) {
      const filenames = filtered.map(file => file.replace('.svg', ''))
      for (const file of filtered) {
        const data = await readFileAsync(resolve(folderToRead, file))
        svgs = [...svgs, data.toString()]
      }
      return Promise.resolve({ svgs, filenames })
    }
    return Promise.reject(`No svg files found in ${folderToRead}`)
  } catch (e) {
    Promise.reject(e)
  }
}

const doSprite = ({ svgs, filenames }) => {
  const {
    optimize,
    tidy,
    prefix,
    suffix,
    classname: className,
    filename,
  } = cli.flags
  const processId = n => `${prefix}${filename ? filenames[n] : n}${suffix}`
  return svgSpreact(svgs, {
    optimize,
    tidy,
    processId,
    className,
  })
}

readFolder(cli.input[0])
  .then(doSprite)
  .then(({ defs, refs }) => {
    const output = `
${defs}

${refs}`
    console.log(output)
    return output
  })
  .then(copyToClipboard)
  .catch(e => console.log(e))
