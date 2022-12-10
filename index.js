// https://www.twilio.com/blog/build-gpt-3-discord-chatbot-node-js
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

client.on("messageCreate", function (message) {
  if (message.author.bot) {
    return;
  }

  if (!message.mentions.has(client.user.id)) {
    return;
  }

  console.log("Message received");

  (async () => {
      prompt = message.content.replace(/<@.?[0-9]*?> ?/g, "");
      console.log(`Prompt: ${prompt}`);

      try {
        const gptResponse = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: prompt,
            max_tokens: 150,
            temperature: 0.3,
            top_p: 0.3,
            presence_penalty: 0,
            frequency_penalty: 0.5,
          });
          console.log(`Response: ${gptResponse.data.choices[0].text}`);
          message.reply(`${gptResponse.data.choices[0].text}`);
      } catch (error) {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
        return;
      }
   })();
});

client.login(process.env.BOT_TOKEN);
