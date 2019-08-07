# Dapplets CLI
The tooling for deployment of dapplet modules to registries.

## Installation
### Install Globally
```
npm install -g @dapplets/cli
```
### Install Locally
```
npm install --save-dev @dapplets/cli
```

## Usage
```
Usage: dapplet-cli [options] [command]

Options:
  -V, --version            output the version number
  -a, --account <account>  set the account name
  -k, --key <key>          set the account key
  -h, --help               output usage information

Commands:
  deploy                   run deploy of module to registry
  add-site <hostname>      add site-binding
```

```
Usage: deploy [options]

run deploy of module to registry

Options:
  -A, --archive  publish archive modules from "archive" folder
  -h, --help     output usage information
```

## Examples
Run `dapplet-cli` from a project root directory containing a manifest.json file.

### Deploy package to registry
```
$ dapplet-cli -a test -k testkey deploy
```

### Deploy package with archive modules to registry
```
$ dapplet-cli -a test -k testkey deploy --archive
```

Archive modules will be loaded from `archive` subfolder of root project folder. An `archive` directory must contain folders with the version name containing a manifest and module script. 

Example of `archive` directory structure:
```
$/
  0.1.0/
    index.js
    manifest.json
  0.1.1/
    index.js
    manifest.json
```

### Add site-binding
```
$ dapplet-cli -a test -k testkey add-site example.com
```