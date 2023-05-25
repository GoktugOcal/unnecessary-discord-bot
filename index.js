const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client(
  {
    intents: [GatewayIntentBits.Guilds],
    autofetch: [
      'MESSAGE_CREATE',
      'MESSAGE_UPDATE',
      'MESSAGE_REACTION_ADD',
      'MESSAGE_REACTION_REMOVE',
    ]
  });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const eventFile = require(`./register2.js`);
    // But first check if it's an event emitted once
    if (eventFile.once)
      eventFile.invoke(client);
  });


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    try {
      delete require.cache[require.resolve(`./commands/interactions/${interaction.commandName}.js`)];

      let commandFile = require(`./commands/interactions/${interaction.commandName}.js`);
      var resCode = await commandFile.run(client, interaction);

      if (resCode == 0) {
        interaction.editReply("I'm sorry, I couldn't achieve that...")
      }

    } catch (e) {
        console.log(e.name);
        if (e.name === "Error") {
            await interaction.reply("Yanlış komut girdin dostum " + "🧐" + "\n`.help` yazarak komutları görebilirsin.")
            console.log(e.stack)
        } else {
            console.log(e.stack)
            await interaction.reply("Bir şeyler ters gitti 😱")
        }
    }
  




    // if (interaction.commandName === 'randomice') {
    //   await interaction.reply(
    //     options[Math.floor(Math.random() * options.length)]
    //   );
    // }

    // else if (interaction.commandName === 'ping') {
    //     await interaction.reply(
    //         "pong!"
    //     )
    // }

  });

client.login(process.env.TOKEN);
