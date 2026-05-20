import fs from 'fs-extra';
import path from 'path';
import { print } from '../../utils/format.js';
import { tplToCode } from '../../utils/template.js';
import { Context } from '../../context/Context.js';
import { createPageHelp } from './help.js';
import {toPageName, toCssClass, toKebabCase} from '../../utils/utils.js';

const CreatePageCommand = {
    name: 'create:page',
    description: 'Create a new page',
    runIn: 'project',
    signature: '{pageName}',

    help: createPageHelp,

    async run({ params }) {
        const pageName = toKebabCase(params.pageName);

        const componentName = toPageName(pageName);
        const cssClass      = toCssClass(pageName);
        const dest          = path.join(Context.pages, pageName);

        if (fs.existsSync(dest)) {
            print(`<font color="red" bold>✖ Page "${pageName}" already exists</font>`);
            process.exit(1);
        }

        await fs.ensureDir(dest);

        // Generate .js file from template
        await fs.writeFile(
            path.join(dest, `${componentName}.js`),
            await tplToCode('page/page.js.tpl', { componentName, cssClass })
        );

        // Generate .css file from template
        await fs.writeFile(
            path.join(dest, `${cssClass}.css`),
            await tplToCode('page/page.css.tpl', { cssClass })
        );

        print('');
        print(`<font color="green" bold>✔ Page "${pageName}" created successfully!</font>`);
        print('');
        print('<font color="cyan" bold>Generated files:</font>');
        print(`<tab/><font color="gray">src/pages/${pageName}/${componentName}.js</font>`);
        print(`<tab/><font color="gray">src/pages/${pageName}/${cssClass}.css</font>`);
        print('');
    }
};

export default CreatePageCommand;