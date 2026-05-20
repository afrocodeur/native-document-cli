import fs from 'fs-extra';
import path from 'path';
import { print } from '../../utils/format.js';
import { tplToCode } from '../../utils/template.js';
import { Context } from '../../context/Context.js';
import { createServiceHelp } from './help.js';
import {toKebabCase, toPascalCase} from '../../utils/utils.js';
import { resolveRelativePath, resolveDestination } from "./utils.js";

const CreateServiceCommand = {
    name: 'create:service',
    description: 'Create a new service',
    runIn: 'project',
    signature: '{serviceName} {--feature=}',

    help: createServiceHelp,

    async run({ params, flags }) {
        const serviceName = toKebabCase(params.serviceName);
        const { feature }     = flags;

        const name = `${toPascalCase(serviceName)}Service`;
        const dest = resolveDestination(serviceName, feature);
        const file = path.join(dest, `${name}.js`);

        if (fs.existsSync(dest)) {
            print(`<font color="red" bold>✖ Service "${name}" already exists</font>`);
            process.exit(1);
        }

        // Check feature exists if --feature flag is set
        if (feature) {
            const featureDir = path.join(Context.features, feature);
            if (!fs.existsSync(featureDir)) {
                print(`<font color="red" bold>✖ Feature "${feature}" does not exist</font>`);
                print(`<tab/><font color="gray">Run nd create:feature ${feature} first</font>`);
                process.exit(1);
            }
        }

        await fs.ensureDir(dest);

        // Generate service file from template
        await fs.writeFile(
            file,
            await tplToCode('service/service.js.tpl', { serviceName: name })
        );

        print('');
        print(`<font color="green" bold>✔ Service "${name}" created successfully!</font>`);
        if (feature) {
            print(`<tab/><font color="gray">Inside feature: ${feature}</font>`);
        }
        print('');
        print('<font color="cyan" bold>Generated files:</font>');
        print(`<tab/><font color="gray">${resolveRelativePath(serviceName, name, feature)}</font>`);
        print('');
    }
};

export default CreateServiceCommand;