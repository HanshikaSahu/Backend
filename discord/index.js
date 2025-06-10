import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({ intents: [
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith("create")){
    const url = message.content.split("create")[1];
    return message.reply({
      content: "Generating short URL for: " + url,
    })
   }

  message.reply({
    content: "Hello, I am bot!"
  })
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
});

client.login(process.env.TOKEN);