import { Context } from '../context/Context.js';
import { print } from '../utils/format.js';
import { parseArgs } from '../utils/args.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let VERSION = '0.0.1';
try {
    const pkg = JSON.parse(fs.readFileSync(__dirname+'/../../package.json', 'utf8'));
    VERSION = pkg.version;
} catch (err) {}


export default function CommandRegistry() {
    this.$commands = {};
}

CommandRegistry.prototype.add = function(command) {
    if (!command.name) {
        throw new Error('Command must have a name');
    }
    if (!command.run) {
        throw new Error(`Command "${command.name}" must have a run() method`);
    }
    this.$commands[command.name] = command;
    return this;
};

CommandRegistry.prototype.run = function(name, args) {
    const command = this.$commands[name];
    const parsed  = parseArgs(command.signature, args);

    if (parsed.error) {
        print(`<font color="red" bold>✖ ${parsed.error}</font>`);
        process.exit(1);
    }

    return command.run(parsed);
};

CommandRegistry.prototype.help = function(name, args) {
    if (name) {
        const command = this.$commands[name];
        if (!command) {
            print(`<font color="red" bold>✖ Unknown command "${name}"</font>`);
            return;
        }
        return command.help ? print(command.help(args)) : null;
    }
    for (const command of Object.values(this.$commands)) {
        print(`<info>${command.name}</info> ${''.padEnd(50 - command.name.length, '.')} <gray>${command.description}</gray>`);
    }
};

CommandRegistry.prototype.has = function(name) {
    return !!this.$commands[name];
};

CommandRegistry.prototype.process = function() {
    const [,, commandName, ...args] = process.argv;

    if (!commandName || commandName === '--help' || commandName === '-h') {
        this.help();
        process.exit(0);
    }

    if (args.includes('--help') || args.includes('-h')) {
        this.help(commandName, args);
        process.exit(0);
    }

    if (commandName === '--version' || commandName === '-v') {
        print(`<font color="cyan">@native-document/cli v${VERSION}</font>`);
        process.exit(0);
    }

    if (!this.has(commandName)) {
        print(`<font color="red" bold>✖ Unknown command "${commandName}"</font>`);
        process.exit(1);
    }

    const command = this.$commands[commandName];

    if (command.runIn === 'project' && !Context.isNdProject()) {
        print('<font color="red" bold>✖ This command must be run inside a NativeDocument project</font>');
        process.exit(1);
    }

    this.run(commandName, args);
};