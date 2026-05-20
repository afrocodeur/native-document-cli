import { print } from '../../utils/format.js';
import { RemoteManager } from '../../utils/RemoteManager.js';

export const OFFICIAL_TEMPLATE = 'afrocodeur/nd-vite-template';

export const resolveTemplate = async (params) => {
    if (!params.template) {
        return OFFICIAL_TEMPLATE;
    }

    const url = await RemoteManager.resolve(params.template);

    if (!url) {
        print(`<font color="red" bold>✖ Template "${params.template}" not found</font>`);
        print('<tab/><font color="gray">Use nd template:add to register a new template</font>');
        print('<tab/><font color="gray">Example: nd template:add saas https://github.com/my/saas-template</font>');
        process.exit(1);
    }

    return url;
};