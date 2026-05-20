import fs from 'fs-extra';
import path from 'path';
import { tplToCode } from '../../utils/template.js';
import { toPascalCase } from '../../utils/utils.js';

/**
 * Create a feature folder structure
 *
 * @param {string} dest        - Project root directory
 * @param {string} featureName - Feature name in kebab-case (e.g. 'auth', 'user-profile')
 *
 * @example
 * await createFeatureStructure('/my-app', 'auth')
 *
 * Generates:
 * src/features/auth/
 * ├── components/
 * ├── services/
 * │   └── AuthService.js
 * ├── utils/
 * └── index.js
 */
export const createFeatureStructure = async (dest, featureName) => {
    const serviceName  = `${toPascalCase(featureName)}Service`;
    const featureDir   = path.join(dest, 'src', 'features', featureName);

    // Create folder structure
    await fs.ensureDir(path.join(featureDir, 'components'));
    await fs.ensureDir(path.join(featureDir, 'services'));
    await fs.ensureDir(path.join(featureDir, 'utils'));

    // Generate service file
    await fs.writeFile(
        path.join(featureDir, 'services', `${serviceName}.js`),
        await tplToCode('feature/service.js.tpl', { serviceName })
    );

    // Generate feature index — public API gate
    await fs.writeFile(
        path.join(featureDir, 'index.js'),
        await tplToCode('feature/index.js.tpl', { featureName, serviceName })
    );
};