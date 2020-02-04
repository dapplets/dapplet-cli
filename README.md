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
Usage: dapplet [options] [command]

Options:
  -V, --version            output the version number
  -r, --registry [address] set the registry endpoint address. default: https://test.dapplets.org
  -a, --account <account>  set the account name
  -k, --key <key>          set the account key
  -h, --help               output usage information

Commands:
  create                   create new module
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
Run `dapplet` from a project root directory containing a manifest.json file.

The following global parameters can be filled using environment variables:

| Parameter | Environment Variable |
| --------- | -------------------- |
| `-r, --registry` | `DAPPLET_CLI_REGISTRY` |
| `-a, --account` | `DAPPLET_CLI_ACCOUNT` |
| `-k, --key` | `DAPPLET_CLI_KEY` |

Example of Windows command line:
```
$ set DAPPLET_CLI_REGISTRY=https://test.dapplets.org && set DAPPLET_CLI_ACCOUNT=test && set DAPPLET_CLI_KEY=testkey && dapplet deploy
```

### Generate new module
```
$ dapplet create
```

1. Answer the questions. 
2. After creating a project change dir to a created directory and run `npm start` to build and run watching.
3. Add dependencies (e.g. adapters), which you will use in your code via `@Inject()` decorators, into `manifest.json` file:
```json
"dependencies": {
  // branch - default
  "twitter-adapter.dapplet-base.eth": "0.3.5",
  // specific branch
  "twitter-adapter.dapplet-base.eth": {
    "default": "0.3.5",
    "legacy": "0.3.5",
    "new": "0.3.5"
  }
}
```
4. Add URL to the Developer tab of the Extension: `http://localhost:10001/dapplets.json`
5. Turn on your Feature in the Features tab and refresh context page.

### Deploy package to registry
```
$ dapplet -a test -k testkey deploy
```

### Deploy package with archive modules to registry **[WILL BE DEPRECATED]**
```
$ dapplet -a test -k testkey deploy --archive
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
$ dapplet -a test -k testkey add-site example.com
```