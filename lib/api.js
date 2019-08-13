const FormData = require('form-data');
const fetch = require('node-fetch');

const REGISTRY_API_URL = "https://test.dapplets.org";

async function saveToStorage(stream, account) {
    var form = new FormData();
    form.append('file', stream);

    const response = await fetch(`${REGISTRY_API_URL}/${account}/storage`, {
        method: 'POST',
        body: form,
        headers: form.getHeaders()
    });

    const json = await response.json();
    if (!json.success) throw new Error("Error in saveToStorage")
    return json.data;
}

async function addModuleToRegistry(uri, account, key) {
    const response = await fetch(`${REGISTRY_API_URL}/${account}/registry/add-module?uri=${uri}&key=${key}`, {
        method: 'POST'
    });

    const json = await response.json();
    if (!json.success) {
        throw new Error("Error in addModuleToRegistry");
    }
    return;
}

async function addSiteBinding(name, branch, site, account, key) {
    const response = await fetch(`${REGISTRY_API_URL}/${account}/registry/add-site-binding?name=${name}&branch=${branch}&site=${site}&key=${key}`, {
        method: 'POST'
    });

    const json = await response.json();
    if (!json.success) throw new Error("Error in addSiteBinding")
    return;
}

module.exports.saveToStorage = saveToStorage;
module.exports.addModuleToRegistry = addModuleToRegistry;
module.exports.addSiteBinding = addSiteBinding;