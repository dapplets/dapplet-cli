const fs = require('fs');
const {
    saveToStorage,
    addModuleToRegistry,
    addSiteBinding
} = require('./api');

const MANIFEST_FILE_NAME = "manifest.json";
const MANIFEST_TEMP_FILE_NAME = "manifest.json.temp";

async function deploy(account, key) {
    const defaultManifest = _getManifest();

    // Dist file publishing
    if (!fs.existsSync(defaultManifest.dist)) throw new Error(defaultManifest.dist + " is not found.");
    const distStream = fs.createReadStream(defaultManifest.dist);
    const distUri = await saveToStorage(distStream);
    console.log(`Dist published to storage. URI: ${distUri}`);

    // Manifest editing
    defaultManifest.dist = distUri;

    // Manifest publishing
    const tempManifestJson = JSON.stringify(defaultManifest);
    fs.writeFileSync(MANIFEST_TEMP_FILE_NAME, tempManifestJson);
    const tempManifestStream = fs.createReadStream(MANIFEST_TEMP_FILE_NAME);
    const manifestUri = await saveToStorage(tempManifestStream);
    console.log(`Manifest published to storage. URI: ${manifestUri}`);
    fs.unlinkSync(MANIFEST_TEMP_FILE_NAME);

    await addModuleToRegistry(manifestUri, account, key);
    console.log(`${defaultManifest.name}#${defaultManifest.branch}@${defaultManifest.version} deployed to registry.`);
}

async function addSite(account, key, hostname) {
    const { name, branch } = _getManifest();
    await addSiteBinding(name, branch, hostname, account, key);
    console.log(`${name}#${branch} is binded to ${hostname}.`);
}

function _getManifest() {
    if (!fs.existsSync(MANIFEST_FILE_NAME)) throw new Error(MANIFEST_FILE_NAME + " is not found.");
    const defaultManifestJson = fs.readFileSync(MANIFEST_FILE_NAME, "utf8");
    let defaultManifest = {};

    // Manifest validity checking
    try {
        defaultManifest = JSON.parse(defaultManifestJson);
    } catch {
        throw new Error("Invalid manifest.");
    }
    if (!defaultManifest.name || !defaultManifest.version || !defaultManifest.type || !defaultManifest.dist) {
        throw new Error("A module manifest must have filled name, version, type and dist fields.");
    }
    if (defaultManifest.type === "FEATURE" && (!defaultManifest.icon || !defaultManifest.title || !defaultManifest.author || !defaultManifest.description)) {
        throw new Error("A feature manifest must have filled icon, title, author and description fields.");
    }
    if (!defaultManifest.branch) defaultManifest.branch = "default";

    return defaultManifest;
}

module.exports.deploy = deploy;
module.exports.addSite = addSite;