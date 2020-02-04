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
  -r, --registry [address] set the registry endpoint address. default: https://test.dapplets.org
  -a, --account <account>  set the account name
  -k, --key <key>          set the account key
  -h, --help               output usage information

Commands:
  deploy                   run deploy of module to registry
  add-site <hostname>      add site-binding
  create                   create new module
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

The following global parameters can be filled using environment variables:

| Parameter | Environment Variable |
| --------- | -------------------- |
| `-r, --registry` | `DAPPLET_CLI_REGISTRY` |
| `-a, --account` | `DAPPLET_CLI_ACCOUNT` |
| `-k, --key` | `DAPPLET_CLI_KEY` |

Example of Windows command line:
```
$ set DAPPLET_CLI_REGISTRY=https://test.dapplets.org && set DAPPLET_CLI_ACCOUNT=test && set DAPPLET_CLI_KEY=testkey && dapplet-cli deploy
```

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