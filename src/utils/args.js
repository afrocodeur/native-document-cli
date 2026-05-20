/**
 * Parse a command signature string into structured positional, params and flags definitions.
 *
 * @param {string} signature
 * @returns {{ positional: Object[], params: Object[], flags: Object[] }}
 *
 * @example
 * parseSignature('{projectName} {--template=} {--verbose}')
 * // {
 * //   positional : [{ name: 'projectName', required: true }],
 * //   params     : [{ name: 'template', default: null }],
 * //   flags      : [{ name: 'verbose' }]
 * // }
 */
const parseSignature = (signature) => {
        const result = {
            positional: [],
            params:     [],
            flags:      [],
        };

        const tokens = signature.match(/\{[^}]+\}/g) ?? [];

        for (const token of tokens) {
            const inner = token.slice(1, -1).trim();

            if (inner.startsWith('--')) {
                const content = inner.slice(2);

                // Param with value: --name= or --name=default
                if (content.includes('=')) {
                    const [name, defaultValue] = content.split('=');
                    result.params.push({ name, default: defaultValue || null });
                    continue;
                }

                // Boolean flag: --name
                result.flags.push({ name: content });
                continue;
            }

            // Optional positional: name?
            if (inner.endsWith('?')) {
                result.positional.push({ name: inner.slice(0, -1), required: false });
                continue;
            }

            // Required positional: name
            result.positional.push({ name: inner, required: true });
        }

        return result;
    };

/**
 * Parse CLI arguments against a command signature.
 * Supports both --param value and --param=value syntaxes.
 *
 * @param {string} signature
 * @param {string[]} args
 * @returns {{ params: Object, flags: Object }}
 *
 * @example
 * // nd create MyApp --template saas --verbose
 * // nd create MyApp --template=saas --verbose
 * parseArgs('{projectName} {--template=} {--verbose}', ['MyApp', '--template', 'saas', '--verbose'])
 * // {
 * //   params : { projectName: 'MyApp', template: 'saas' },
 * //   flags  : { verbose: true }
 * // }
 */
export const parseArgs = (signature, args) => {
    const parsed = parseSignature(signature);

    const result = {
        params: {},
        flags:  {},
    };

    // Set param defaults from signature
    for (const { name, default: defaultValue } of parsed.params) {
        result.params[name] = defaultValue ?? null;
    }

    // Set flag defaults
    for (const { name } of parsed.flags) {
        result.flags[name] = false;
    }

    let positionalIndex = 0;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        // --param=value syntax
        if (arg.startsWith('--') && arg.includes('=')) {
            const [key, value] = arg.slice(2).split('=');
            result.params[key] = value;
            continue;
        }

        // --flag or --param value syntax
        if (arg.startsWith('--')) {
            const name  = arg.slice(2);
            const next  = args[i + 1];
            const isParam = parsed.params.some(p => p.name === name);

            if (isParam && next && !next.startsWith('--')) {
                result.params[name] = next;
                i++;
                continue;
            }

            result.flags[name] = true;
            continue;
        }

        // Positional argument — match to signature name
        const positional = parsed.positional[positionalIndex];
        if (positional) {
            result.params[positional.name] = arg;
            positionalIndex++;
        }
    }

    // Check required positional arguments
    for (const { name, required } of parsed.positional) {
        if (required && !result.params[name]) {
            return { error: `Missing required argument "${name}"` };
        }
    }

    return result;
};