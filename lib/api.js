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
    const url = `${registry}/${account}/storage/${json.data}`;
    return url;
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
    if (text.length !== 64) throw new Error("Swarm gateway returned invalid hash.");
    const url = "bzz://" + text;
    return url;
}

async function addModuleToRegistry(registry, uri, account, key) {
    const response = await fetch(`${registry}/${account}/registry/add-module?uri=${encodeURIComponent(uri)}&key=${key}`, {
        method: 'POST'
    });

    const json = await response.json();
    if (!json.success) throw new Error(json.message || "Error in addModuleToRegistry");
    return;
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
module.exports.addModuleToRegistry = addModuleToRegistry;
module.exports.addSiteBinding = addSiteBinding;