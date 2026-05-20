import fs from 'fs-extra';
import path from 'path';
import { print } from '../../utils/format.js';
import { tplToCode } from '../../utils/template.js';
import { Context } from '../../context/Context.js';
import { createComponentHelp } from './help.js';
import {toPascalCase, toCssClass, toKebabCase} from '../../utils/utils.js';
import { resolveRelativePath, resolveDestination } from "./utils.js";

const CreateComponentCommand = {
    name: 'create:component',
    description: 'Create a new UI component',
    runIn: 'project',
    signature: '{componentName} {--feature=}',

    help: createComponentHelp,

    async run({ params, flags }) {
        const componentName = toKebabCase(params.componentName);
        const { feature }       = flags;

        const name          = toPascalCase(componentName);
        const cssClass      = toCssClass(componentName);
        const dest          = resolveDestination(componentName, feature);
        const relativePath  = resolveRelativePath(componentName, feature);

        if (fs.existsSync(dest)) {
            print(`<font color="red" bold>✖ Component "${componentName}" already exists</font>`);
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

        // Generate .js file from template
        await fs.writeFile(
            path.join(dest, `${name}.js`),
            await tplToCode('component/component.js.tpl', { componentName: name, cssClass })
        );

        // Generate .css file from template
        await fs.writeFile(
            path.join(dest, `${cssClass}.css`),
            await tplToCode('component/component.css.tpl', { cssClass })
        );

        print('');
        print(`<font color="green" bold>✔ Component "${name}" created successfully!</font>`);
        if (feature) {
            print(`<tab/><font color="gray">Inside feature: ${feature}</font>`);
        }
        print('');
        print('<font color="cyan" bold>Generated files:</font>');
        print(`<tab/><font color="gray">${relativePath}/${name}.js</font>`);
        print(`<tab/><font color="gray">${relativePath}/${cssClass}.css</font>`);
        print('');
    }
};

export default CreateComponentCommand;