const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const eventFile = require(`./register2.js`);
    // But first check if it's an event emitted once
    if (eventFile.once)
      console.log("hello")
      eventFile.invoke(client);
  });


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    try {
      delete require.cache[require.resolve(`./commands/interactions/${interaction.commandName}.js`)];

      let commandFile = require(`./commands/interactions/${interaction.commandName}.js`);
      commandFile.run(client, interaction);

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
