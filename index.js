const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

const options = [
    '🐭',
    'https://media.giphy.com/media/wJZTbXayokOgbCfyQe/giphy.gif',
    'https://media.giphy.com/media/QXh9XnIJetPi0/giphy.gif',
    '🐁',
];

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
  
    if (interaction.commandName === 'randomice') {
      await interaction.reply(
        options[Math.floor(Math.random() * options.length)]
      );
    }

    else if (interaction.commandName === 'ping') {
        await interaction.reply(
            JSON.stringify({
                "content": "this `supports` __a__ **subset** *of* ~~markdown~~ 😃 ```js\nfunction foo(bar) {\n  console.log(bar);\n}\n\nfoo(1);```",
                "embed": {
                  "title": "title ~~(did you know you can have markdown here too?)~~",
                  "description": "this supports [named links](https://discordapp.com) on top of the previously shown subset of markdown. ```\nyes, even code blocks```",
                  "url": "https://discordapp.com",
                  "color": 2353370,
                  "timestamp": "2023-05-21T14:00:36.603Z",
                  "footer": {
                    "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
                    "text": "footer text"
                  },
                  "thumbnail": {
                    "url": "https://cdn.discordapp.com/embed/avatars/0.png"
                  },
                  "image": {
                    "url": "https://cdn.discordapp.com/embed/avatars/0.png"
                  },
                  "author": {
                    "name": "author name",
                    "url": "https://discordapp.com",
                    "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
                  },
                  "fields": [
                    {
                      "name": "🤔",
                      "value": "some of these properties have certain limits..."
                    },
                    {
                      "name": "😱",
                      "value": "try exceeding some of them!"
                    },
                    {
                      "name": "🙄",
                      "value": "an informative error should show up, and this view will remain as-is until all issues are fixed"
                    },
                    {
                      "name": "<:thonkang:219069250692841473>",
                      "value": "these last two",
                      "inline": true
                    },
                    {
                      "name": "<:thonkang:219069250692841473>",
                      "value": "are inline fields",
                      "inline": true
                    }
                  ]
                }
              })
        )
    }

  });

client.login(process.env.TOKEN);
