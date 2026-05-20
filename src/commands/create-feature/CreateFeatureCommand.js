import fs from 'fs-extra';
import path from 'path';
import { print } from '../../utils/format.js';
import { tplToCode } from '../../utils/template.js';
import { Context } from '../../context/Context.js';
import { createFeatureHelp } from './help.js';
import {toKebabCase, toPascalCase} from '../../utils/utils.js';

const CreateFeatureCommand = {
    name: 'create:feature',
    description: 'Create a new feature',
    runIn: 'project',
    signature: '{featureName}',

    help: createFeatureHelp,

    async run({ params }) {
        const featureName = toKebabCase(params.featureName);

        const serviceName  = toPascalCase(featureName)+'Service';
        const featureDir   = path.join(Context.features, featureName);
        const servicesDir  = path.join(featureDir, 'services', toKebabCase(featureName));

        if (!Context.features || !fs.existsSync(Context.features)) {
            print('<font color="red" bold>✖ Feature mode is not enabled</font>');
            process.exit(1);
        }

        if (fs.existsSync(featureDir)) {
            print(`<font color="red" bold>✖ Feature "${featureName}" already exists</font>`);
            process.exit(1);
        }

        // Create folder structure
        await fs.ensureDir(path.join(featureDir, 'components'));
        await fs.ensureDir(servicesDir);
        await fs.ensureDir(path.join(featureDir, 'utils'));

        // Generate service file
        await fs.writeFile(
            path.join(servicesDir, `${serviceName}.js`),
            await tplToCode('feature/service.js.tpl', { serviceName })
        );

        // Generate feature index — public API gate
        await fs.writeFile(
            path.join(featureDir, 'index.js'),
            await tplToCode('feature/index.js.tpl', { featureName, serviceName })
        );

        print('');
        print(`<font color="green" bold>✔ Feature "${featureName}" created successfully!</font>`);
        print('');
        print('<font color="cyan" bold>Generated files:</font>');
        print(`<tab/><font color="gray">src/features/${featureName}/components/</font>`);
        print(`<tab/><font color="gray">src/features/${featureName}/services/${serviceName}/${serviceName}.js</font>`);
        print(`<tab/><font color="gray">src/features/${featureName}/utils/</font>`);
        print(`<tab/><font color="gray">src/features/${featureName}/index.js</font>`);
        print('');
        print('<font color="cyan" bold>Next steps:</font>');
        print(`<tab/><font color="gray">import { ${serviceName} } from '@/features/${featureName}';</font>`);
        print('');
    }
};

export default CreateFeatureCommand;