import chalk from 'chalk';

const tags = {
    b:       (text) => chalk.bold(text),
    i:       (text) => chalk.italic(text),
    success: (text) => chalk.green(text),
    error:   (text) => chalk.red(text),
    warn:    (text) => chalk.yellow(text),
    info:    (text) => chalk.cyan(text),
    dim:     (text) => chalk.dim(text),
};

const MODIFIERS = [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'inverse',
    'dim',
    'hidden',
    'overline',
];
const parseColorTag = (value, isBg = false) => {
    if (!value) return null;

    // Hex color
    if (value.startsWith('#')) {
        return isBg ? chalk.bgHex(value) : chalk.hex(value);
    }

    // RGB color rgb(255,255,255)
    const rgbMatch = value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgbMatch) {
        const [_, r, g, b] = rgbMatch;
        return isBg ? chalk.bgRgb(r, g, b) : chalk.rgb(r, g, b);
    }

    // Named chalk color
    if (isBg) {
        const bgColor = 'bg' + value.charAt(0).toUpperCase() + value.slice(1);
        return chalk[bgColor] ?? null;
    }
    return chalk[value] ?? null;
};

const parseFontTag = (attrs, content) => {
    const colorMatch = attrs.match(/color="([^"]+)"/);
    const bgMatch    = attrs.match(/bg="([^"]+)"/);

    let result = chalk;

    if (colorMatch) {
        const value = colorMatch[1];
        if (value.startsWith('#')) {
            result = result.hex(value);
        } else if (value.startsWith('rgb')) {
            const rgbMatch = value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            if (rgbMatch) {
                result = result.rgb(rgbMatch[1], rgbMatch[2], rgbMatch[3]);
            }
        } else {
            result = result[value] ?? result;
        }
    }

    if (bgMatch) {
        const value = bgMatch[1];
        if (value.startsWith('#')) {
            result = result.bgHex(value);
        } else if (value.startsWith('rgb')) {
            const rgbMatch = value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            if (rgbMatch) {
                result = result.bgRgb(rgbMatch[1], rgbMatch[2], rgbMatch[3]);
            }
        } else {
            const bgColor = 'bg' + value.charAt(0).toUpperCase() + value.slice(1);
            result = result[bgColor] ?? result;
        }
    }

    for (const modifier of MODIFIERS) {
        if (new RegExp(`\\b${modifier}\\b`).test(attrs)) {
            result = result[modifier] ?? result;
        }
    }

    return result !== chalk ? result(content) : content;
};

const parsePadTag = (attrs, content) => {
    const sizeMatch = attrs.match(/size="(\d+)"/);
    const charMatch = attrs.match(/char="([^"]+)"/);

    const size = sizeMatch ? parseInt(sizeMatch[1]) : 0;
    const char = charMatch ? charMatch[1] : ' ';

    return content.padEnd(size, char);
};

const parseTabTag = (attrs) => {
    const repeatMatch = attrs.match(/repeat="(\d+)"/);
    const repeat = repeatMatch ? parseInt(repeatMatch[1]) : 1;
    return '  '.repeat(repeat);
};

export const format = (line) => {
    // Handle <font> tag
    line = line.replace(/<font([^>]*)>(.*?)<\/font>/g, (_, attrs, content) => {
        return parseFontTag(attrs, content);
    });

    // Handle <pad> tag
    line = line.replace(/<pad([^>]*)>(.*?)<\/pad>/g, (_, attrs, content) => {
        return parsePadTag(attrs, content);
    });

    // Handle <tab> tag (self-closing)
    line = line.replace(/<tab([^>]*)\/?>/g, (_, attrs) => {
        return parseTabTag(attrs);
    });

    // Handle other tags
    line = line.replace(/<([\w:]+)>(.*?)<\/\1>/g, (_, tag, content) => {
        const formatter = parseColorTag(tag);
        return formatter ? formatter(content) : content;
    });

    return line;
};

export const print = (lines) => {
    if (Array.isArray(lines)) {
        lines.forEach(line => console.log(format(line)));
        return;
    }
    console.log(format(lines));
};