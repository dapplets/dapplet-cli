const fs = require('fs');
const {
    saveToStorage,
    saveToSwarmStorage,
    addModuleToRegistry,
    addSiteBinding
} = require('./api');

const MANIFEST_FILE_NAME = "manifest.json";
const MANIFEST_TEMP_FILE_NAME = "manifest.json.temp";
const ARCHIVE_DIRECTORY_NAME = "archive";

async function deploy(registry, account, key, options) {
    const dirs = [];

    if (options.archive === true) {
        const versions = fs.readdirSync(ARCHIVE_DIRECTORY_NAME);
        const archiveDirs = versions.map(v => ARCHIVE_DIRECTORY_NAME + '/' + v);
        dirs.unshift(...archiveDirs);
    } else {
        dirs.push('build');
    }

    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];
        
        try {
            await _deployFromDirectory(registry, account, key, dir, options);
        } catch (err) {
            console.error(err.message);
        }
    }
}

async function addSite(registry, account, key, hostname) {
    const {
        name,
        branch
    } = _getManifestFromDirectory();
    await addSiteBinding(registry, name, branch, hostname, account, key);
    console.log(`${name}#${branch} is binded to ${hostname}.`);
}

function _getManifestFromDirectory(dir) {
    const manifestPath = ((!dir) ? '' : dir + '/') + MANIFEST_FILE_NAME;

    if (!fs.existsSync(manifestPath)) throw new Error(manifestPath + " is not found.");
    const json = fs.readFileSync(manifestPath, "utf8");
    let manifest = {};

    // Manifest validity checking
    try {
        manifest = JSON.parse(json);
    } catch {
        throw new Error("Invalid manifest.");
    }
    if (!manifest.name || !manifest.version || !manifest.type || !manifest.dist) {
        throw new Error("A module manifest must have filled name, version, type and dist fields.");
    }
    if (manifest.type === "FEATURE" && (!manifest.icon || !manifest.title || !manifest.author || !manifest.description)) {
        throw new Error("A feature manifest must have filled icon, title, author and description fields.");
    }
    if (!manifest.branch) manifest.branch = "default";

    return manifest;
}

async function _deployFromDirectory(registry, account, key, dir, options) {
    const defaultManifest = _getManifestFromDirectory(dir);
    const { name, branch, version } = defaultManifest;

    console.warn(`[${name}#${branch}@${version}] from "${dir}" directory`);

    // Dist file publishing
    const distPath = ((!dir) ? '' : dir + '/') + defaultManifest.dist;
    if (!fs.existsSync(distPath)) throw new Error(distPath + " is not found.");
    const distStream = fs.createReadStream(distPath);
    const distUri = options.swarm ? await saveToSwarmStorage(distStream) : await saveToStorage(registry, distStream, account);
    console.log(`Dist URI: ${distUri}`);

    // Manifest editing
    defaultManifest.dist = distUri;

    // Manifest publishing
    const tempManifestPath = ((!dir) ? '' : dir + '/') + MANIFEST_TEMP_FILE_NAME;
    const tempManifestJson = JSON.stringify(defaultManifest);
    fs.writeFileSync(tempManifestPath, tempManifestJson);
    const tempManifestStream = fs.createReadStream(tempManifestPath);
    const manifestUri = options.swarm ? await saveToSwarmStorage(tempManifestStream) : await saveToStorage(registry, tempManifestStream, account);
    console.log(`Manifest URI: ${manifestUri}`);
    fs.unlinkSync(tempManifestPath);

    await addModuleToRegistry(registry, manifestUri, account, key);
    console.log("Deployed successfully.");
}

module.exports.deploy = deploy;
module.exports.addSite = addSite;