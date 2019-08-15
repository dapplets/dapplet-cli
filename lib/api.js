const FormData = require('form-data');
const fetch = require('node-fetch');

async function saveToStorage(registry, stream, account) {
    var form = new FormData();
    form.append('file', stream);

    const response = await fetch(`${registry}/${account}/storage`, {
        method: 'POST',
        body: form,
        headers: form.getHeaders()
    });

    const json = await response.json();
    if (!json.success) throw new Error(json.message || "Error in saveToStorage")
    return json.data;
}

async function addModuleToRegistry(registry, uri, account, key) {
    const response = await fetch(`${registry}/${account}/registry/add-module?uri=${uri}&key=${key}`, {
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
module.exports.addModuleToRegistry = addModuleToRegistry;
module.exports.addSiteBinding = addSiteBinding;