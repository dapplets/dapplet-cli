const FormData = require('form-data');
const fetch = require('node-fetch');
const toArray = require('stream-to-array');

async function saveToStorage(registry, stream, account) {
    var form = new FormData();
    form.append('file', stream);

    const response = await fetch(`${registry}/${account}/storage`, {
        method: 'POST',
        body: form,
        headers: form.getHeaders()
    });

    const json = await response.json();
    if (!json.success) throw new Error(json.message || "Error in saveToStorage");
    return json.data;
}

async function saveToSwarmStorage(stream) {
    const arr = await toArray(stream);
    const response = await fetch("https://swarm-gateways.net/bzz:/", {
        method: 'POST',
        headers: {
            "Content-Length": arr.length
        },
        body: arr
    });

    const text = await response.text();
    if (text.length !== 64) throw new Error("Swarm gateway returned invalid response:\n" + text);
    const url = "bzz://" + text;
    return url;
}

async function addModuleWithObjects(registry, account, name, branch, version, hashUris, key) {
    const response = await fetch(`${registry}/${account}/registry/add-module-with-objects?name=${name}&branch=${branch}&version=${version}&hashUris=${JSON.stringify(hashUris)}&key=${key}`, {
        method: 'POST'
    });

    if (!response.ok) throw Error(response.statusText);
    const json = await response.json();
    if (!json.success) throw Error(json.message);
}

async function addSiteBinding(registry, name, branch, site, account, key) {
    const response = await fetch(`${registry}/${account}/registry/add-site-binding?name=${name}&branch=${branch}&site=${site}&key=${key}`, {
        method: 'POST'
    });

    const json = await response.json();
    if (!json.success) throw new Error(json.message || "Error in addSiteBinding")
    return;
}

module.exports.saveToStorage = saveToStorage;
module.exports.saveToSwarmStorage = saveToSwarmStorage;
module.exports.addModuleWithObjects = addModuleWithObjects;
module.exports.addSiteBinding = addSiteBinding;