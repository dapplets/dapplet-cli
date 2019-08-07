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

## Example
Run `dapplet-cli` from the project root directory containing a manifest.json file.

### Deploy package to registry
```
$ dapplet-cli -a test -k testkey deploy
```

### Add site-binding
```
$ dapplet-cli -a test -k testkey add-site example.com
```