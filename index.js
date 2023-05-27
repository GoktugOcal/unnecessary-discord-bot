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
  console.log(`Execution started...`);

  const eventFile = require(`./register2.js`);
  // But first check if it's an event emitted once
  if (eventFile.once)
    eventFile.invoke(client);

  console.log(`Logged in as ${client.user.tag}!`);

  });


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    try {
      // delete require.cache[require.resolve(`./commands/interactions/${interaction.commandName}.js`)];

      if (!interaction.isButton()) {
        let commandFile = require(`./commands/interactions/${interaction.commandName}.js`);
        var resCode = await commandFile.run(client, interaction);

        if (resCode == 0) { 
          interaction.editReply("Sorry... I have failed :(")
        }
      }
      else if (interaction.isButton()) {
        console.log("Button clicked...")
      }
      else {
        throw new Error('Not a command or button interaction...');
      }
      
      
    } catch (e) {
        console.log("####### ERROR : " + e.name);
        console.log(e.stack);        
    }
  });

client.login(process.env.TOKEN);
