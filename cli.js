#!/usr/bin/env node
'use strict'
const meow = require('meow')
const svgSpreact = require('svg-spreact')
const fs = require('fs')
const { extname, resolve } = require('path')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const readdirAsync = promisify(fs.readdir)

const cli = meow(
  `
Usage
  $ svg-spreact <folder>
  
Options
  --optimize, -o  Optimize output
  --tidy, -t      Prettify output
	
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
    },
  }
)

const readFolder = async folder => {
  let svgsString = ''
  const folderToRead = folder || './'
  try {
    const files = await readdirAsync(folderToRead)
    const filtered = files.filter(file => extname(file) === '.svg')
    if (filtered.length) {
      const filenames = filtered.map(file => file.replace('.svg', ''))
      for (const file of filtered) {
        const data = await readFileAsync(resolve(folderToRead, file))
        svgsString = `${svgsString}${data.toString()}`
      }
      return Promise.resolve({ svgsString, filenames })
    }
    return Promise.reject(`No svg files found in ${folderToRead}`)
  } catch (e) {
    Promise.reject(e)
  }
}

const doSprite = ({ svgsString, filenames }) => {
  let n = 0
  const processIds = node => {
    if (node.name === 'svg') {
      const id = filenames[n++]
      return {
        ...node,
        attribs: {
          ...node.attribs,
          id,
        },
      }
    }
    return node
  }

  return svgSpreact(svgsString, { ...cli.flags, processIds })
}

readFolder(cli.input[0])
  .then(doSprite)
  .then(({ defs, refs }) => {
    console.log(defs)
    console.log(refs)
  })
  .catch(e => console.log(e))
