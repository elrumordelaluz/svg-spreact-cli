<p align="center">
  <img alt="SVG Spreact" title="SVG Spreact" src="https://cdn.rawgit.com/elrumordelaluz/svg-spreact/2b58118b/logo.svg" width="450">
</p>

<p align="center">
  CLI version of <a href="https://github.com/elrumordelaluz/svg-spreact">svg-spreact</a> 
</p>

## Install

```zsh
npm i -g svg-spreact-cli
```

## Usage

```zsh
svg-spreact <folder> [options]
```

<p align="center">
  <img alt="svg-spreact demo" title="svg-spreact demo" src="https://cdn.rawgit.com/elrumordelaluz/svg-spreact-cli/87a503e8/demo.gif" width="450">
</p>

## Example

```zsh
svg-spreact ./icons --optimize true --tidy false
```

Will log the output (defs `<symbols>` and refs `<use>`) and automatically copies to _Clipboard_

```zsh
svg-spreact ./icons > sprite.svg
```

## API

#### folder

Default: `./`

#### options

* `--tidy` `-t` (`boolean`) default: `true`
* `--optimize` `-o` (`boolean`) default: `true`
* `--prefix` `-p` (`string`) default: ''
* `--suffix` `-s` (`string`) default: ''
* `--classname` `-c` (`string`) default: ''

## Related

[svg-spreact](https://github.com/elrumordelaluz/svg-spreact) Main Package
