const { Client, Events, GatewayIntentBits, Partials, ActivityType } = require('discord.js');

const client = new Client(
  {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildPresences
    ],
    autofetch: [
      'MESSAGE_CREATE',
      'MESSAGE_UPDATE',
      'MESSAGE_REACTION_ADD',
      'MESSAGE_REACTION_REMOVE',
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
  });

// client.commands = new Collection();

client.on(Events.ClientReady, () => {
  console.log(`Execution started...`);

  client.user.setPresence({
    activities: [{ name: `your commands`, type: ActivityType.Listening }],
    status: 'dnd',
  });

  const eventFile = require(`./src/register_commands.js`);
  // But first check if it's an event emitted once
  if (eventFile.once)
    eventFile.invoke(client);

  console.log(`Logged in as ${client.user.tag}!`);

  });


client.on(Events.InteractionCreate, async (interaction) => {

    try {

      if (interaction.isCommand()) { // If the Interaction is a COMMAND
        console.log("Command received...")

        delete require.cache[require.resolve(`./src/commands/interactions/${interaction.commandName}.js`)];

        let commandFile = require(`./src/commands/interactions/${interaction.commandName}.js`);
        var resCode = await commandFile.run(client, interaction);

        if (resCode == 0) { 
          interaction.editReply("Sorry... I have failed :(")
        }
      }/*
      else if (interaction.isButton()) {  // If the Interaction is a BUTTON
        console.log("Button clicked...")
        console.log(interaction.id)
        interaction.reply("It's Dangerous to go Alone... 🛡️ Go into `Interactions/Buttons/Test-Button.js` to edit this text.")
      }*/
      else {
        return;
        // throw new Error('Not a command or button interaction...');
      }
      
      
    } catch (e) {
        console.log("####### ERROR : " + e.name);
        console.log(e.stack);
        
    }
  });

client.login(process.env.TOKEN);
