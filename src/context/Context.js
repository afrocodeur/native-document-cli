import fs from 'fs-extra';
import path from 'path';

const findProjectRoot = (dir) => {
    const ndConfig = path.join(dir, 'nd.config.json');
    if (fs.existsSync(ndConfig)) {
        return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
        return null;
    }
    return findProjectRoot(parent);
};

const loadNdConfig = (root) => {
    if (!root) return null;
    try {
        const content = fs.readFileSync(path.join(root, 'nd.config.json'), 'utf-8');
        return JSON.parse(content);
    } catch {
        return null;
    }
};

const loadPackageJson = (root) => {
    if (!root) return null;
    try {
        const content = fs.readFileSync(path.join(root, 'package.json'), 'utf-8');
        return JSON.parse(content);
    } catch {
        return null;
    }
};

const root        = findProjectRoot(process.cwd());
const ndConfig    = loadNdConfig(root);
const packageJson = loadPackageJson(root);

const resolve = (...segments) => root ? path.join(root, ...segments) : null;
const fromConfig = (key, fallback) => resolve(ndConfig?.[key] || fallback);

export const Context = {

    // Directories
    cwd:         process.cwd(),
    root,

    // src
    src:         fromConfig('src',         'src'),

    // pages
    pages:       fromConfig('pages',       'src/pages'),

    // components
    components:  fromConfig('components',  'src/components'),

    // features (only available in feature mode)
    features:    ndConfig?.features ? resolve(ndConfig.features) : null,

    // services (business logic)
    services:    fromConfig('services',    'src/services'),

    // core
    core:        fromConfig('core',        'src/core'),

    // core/services (framework-level)
    coreServices: fromConfig('coreServices', 'src/core/services'),

    // core/utils
    utils:       fromConfig('utils',       'src/core/utils'),

    // core/lang
    lang:        fromConfig('lang',        'src/core/lang/locales'),

    // core/middlewares
    middlewares: fromConfig('middlewares', 'src/core/middlewares'),

    // routes
    routes:      fromConfig('routes',      'src/routes/routes.js'),

    // routes/layouts
    layouts:     fromConfig('layouts',     'src/routes/layouts'),

    // Project details
    name:        packageJson?.name        ?? null,
    version:     packageJson?.version     ?? null,
    description: packageJson?.description ?? null,

    // NativeDocument config
    config:      ndConfig,

    // Helpers
    isNdProject() {
        return !!ndConfig;
    },
    resolve(...segments) {
        return path.join(root, ...segments);
    },
    relativeTo(absolutePath) {
        return path.relative(root, absolutePath);
    }
};