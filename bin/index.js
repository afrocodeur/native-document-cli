#!/usr/bin/env node
import CommandRegistry from "../src/commands/CommandRegistry.js";
import CreateServiceCommand from "../src/commands/create-service/CreateServiceCommand.js";
import CreateCommand from "../src/commands/create/CreateCommand.js";
import CreatePageCommand from "../src/commands/create-page/CreatePageCommand.js";
import CreateComponentCommand from "../src/commands/create-component/CreateComponentCommand.js";
import CreateFeatureCommand from "../src/commands/create-feature/CreateFeatureCommand.js";




(new CommandRegistry())
    .add(CreateCommand)
    .add(CreateServiceCommand)
    .add(CreatePageCommand)
    .add(CreateComponentCommand)
    .add(CreateServiceCommand)
    .add(CreateFeatureCommand)
    .process();