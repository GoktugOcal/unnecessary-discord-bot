const Chatbot = require("./helpers/chatbot_bard.js")
// const { hideBin } = require('yargs/helpers');
// const yargs = require('yargs/yargs');

// import yargs from 'yargs/yargs';


async function run () {

  const chatbot = new Chatbot(process.env.Secure1PSID);

  userPrompt = "Where is Istanbul?" + " Make it short in one paragraph."

  const response = await chatbot.ask(userPrompt);
  console.log('Google Bard:',response.content);
}

run()
