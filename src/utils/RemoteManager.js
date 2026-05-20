import fs from 'fs-extra';
import path from 'path';
import os from 'os';

const ND_DIR       = path.join(os.homedir(), '.nd');
const REMOTES_FILE = path.join(ND_DIR, 'remotes.json');

const DEFAULT_REMOTES = {
    'vite':    'afrocodeur/nd-vite-template',
};

const load = async () => {
    await fs.ensureDir(ND_DIR);
    if (!fs.existsSync(REMOTES_FILE)) {
        return {};
    }
    return fs.readJson(REMOTES_FILE);
};

const save = async (remotes) => {
    await fs.ensureDir(ND_DIR);
    await fs.writeJson(REMOTES_FILE, remotes, { spaces: 4 });
};

export const RemoteManager = {

    async add(name, url) {
        const remotes = await load();
        remotes[name] = url;
        await save(remotes);
    },

    async remove(name) {
        const remotes = await load();
        delete remotes[name];
        await save(remotes);
    },

    async get(name) {
        const remotes = await load();
        return remotes[name] ?? DEFAULT_REMOTES[name] ?? null;
    },

    async list() {
        const remotes = await load();
        return { ...DEFAULT_REMOTES, ...remotes };
    },

    async has(name) {
        const remotes = await load();
        return !!(remotes[name] ?? DEFAULT_REMOTES[name]);
    },

    async resolve(template) {
        // Direct URL
        if (template.startsWith('https://') || template.startsWith('http://')) {
            return template;
        }
        // User remotes first, then default remotes
        const remotes = await load();
        return remotes[template] ?? DEFAULT_REMOTES[template] ?? null;
    }
};