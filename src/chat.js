const { Configuration, OpenAIApi } = require("openai");


async function chat () {
    const configuration = new Configuration({
        apiKey: "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",
      });
      const openai = new OpenAIApi(configuration);
      
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Hello world",
      });
      console.log(completion.data.choices[0].text);
}

chat();
