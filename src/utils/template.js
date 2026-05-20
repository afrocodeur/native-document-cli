import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Read a template file and replace placeholders with params.
 * Placeholders use the {{key}} syntax.
 *
 * @param {string} tplPath - Path to the template file
 * @param {Object} params  - Key/value pairs to replace
 * @returns {string}       - The generated code
 *
 * @example
 * tplToCode('page/page.js.tpl', { componentName: 'DashboardPage', cssClass: 'dashboard' })
 */
export const tplToCode = async (tplPath, params = {}) => {
    const fullPath = path.resolve(__dirname, '../templates', tplPath);
    let content    = await fs.readFile(fullPath, 'utf-8');

    for (const [key, value] of Object.entries(params)) {
        content = content.replaceAll(`{{${key}}}`, value);
    }

    return content;
};