const fs = require('fs')

exports.once = true;
exports.name = 'ready';

exports.invoke = async (client) => {
    const commands = fs
        .readdirSync('./src/commands/interactions')
        .filter((file) => file.endsWith('.js'));

    const commandsArray = [];

    for (let command of commands) {
        const commandFile = require(`./commands/interactions/${command}`);
        commandsArray.push(commandFile.create());
    }

    client.application.commands.set(commandsArray);

    console.log(`Commands are succesfully created...`);
}
