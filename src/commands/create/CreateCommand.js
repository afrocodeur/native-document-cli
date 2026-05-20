import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import degit from 'degit';
import { print } from '../../utils/format.js';
import { Context } from '../../context/Context.js';
import { createHelp } from './help.js';
import { resolveTemplate } from './template.js';
import { createFeatureStructure } from './feature.js';

const CreateCommand = {
    name: 'create',
    description: 'Create a new NativeDocument project',
    runIn: 'anywhere',
    signature: '{projectName} {--template=} {--feature} {--verbose}',

    help: createHelp,

    async run({ params, flags }) {
        const { projectName, template } = params;
        const { verbose, feature }      = flags;

        if (!projectName) {
            print('<font color="red" bold>✖ Please provide a project name</font>');
            print('<tab/><font color="gray">Example: nd create MyApp</font>');
            process.exit(1);
        }

        const dest = path.join(Context.cwd, projectName);

        if (fs.existsSync(dest)) {
            print(`<font color="red" bold>✖ Directory "${projectName}" already exists</font>`);
            process.exit(1);
        }

        const templateUrl = await resolveTemplate(params);

        print('');
        print(`<font color="cyan">Creating project </font><font color="green" bold>${projectName}</font>`);
        print(`<tab/><font color="gray">Template : ${templateUrl}</font>`);
        print(`<tab/><font color="gray">Mode     : ${feature ? 'feature-based' : 'layer-based'}</font>`);
        print('');

        // Clone template with degit
        try {
            print('<font color="cyan">Cloning template...</font>');
            const emitter = degit(templateUrl, { cache: false, force: true, verbose });
            await emitter.clone(dest);
        } catch (e) {
            print(`<font color="red" bold>✖ Failed to clone template</font>`);
            print(`<tab/><font color="gray">${e.message}</font>`);
            process.exit(1);
        }

        // Update package.json with project name
        const packageJsonPath = path.join(dest, 'package.json');
        const packageJson     = await fs.readJson(packageJsonPath);
        packageJson.name      = projectName.toLowerCase();
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 4 });

        // Update index.html title with project name
        const indexHtmlPath = path.join(dest, 'index.html');
        const indexHtml     = await fs.readFile(indexHtmlPath, 'utf-8');
        await fs.writeFile(indexHtmlPath, indexHtml.replace('NativeDocument App', projectName));

        // Generate nd.config.json
        await fs.writeJson(path.join(dest, 'nd.config.json'), {
            src:          'src',
            pages:        'src/pages',
            components:   'src/components',
            services:     'src/services',
            features:     feature ? 'src/features' : null,
            core:         'src/core',
            coreServices: 'src/core/services',
            utils:        'src/core/utils',
            lang:         'src/core/lang/locales',
            middlewares:  'src/core/middlewares',
            routes:       'src/routes/routes.js',
            layouts:      'src/routes/layouts',
        }, { spaces: 4 });

        // Create feature structure if --feature flag is set
        if (feature) {
            print('<font color="cyan">Setting up feature-based architecture...</font>');
            await createFeatureStructure(dest);
        }

        // Install dependencies
        print('<font color="cyan">Installing dependencies...</font>');
        execSync('npm install', { cwd: dest, stdio: 'inherit' });

        print('');
        print(`<font color="green" bold>✔ Project "${projectName}" created successfully!</font>`);
        print('');
        print('<font color="cyan" bold>Next steps:</font>');
        print(`<tab/><font color="gray">cd ${projectName}</font>`);
        print(`<tab/><font color="gray">npm start</font>`);
        if (feature) {
            print('');
            print('<font color="cyan" bold>Feature mode:</font>');
            print(`<tab/><font color="gray">Features live in src/features/</font>`);
            print(`<tab/><font color="gray">Run nd create:feature <FeatureName> to scaffold a new feature</font>`);
        }
        print('');
        process.exit(0);
    }
};

export default CreateCommand;