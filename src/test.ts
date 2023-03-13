import { Client, GatewayIntentBits, Interaction, Message } from 'discord.js';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ] 
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

fromEvent(client, 'interactionCreate')
  .pipe(
    filter((interaction: Interaction) => interaction.isCommand())
  )
  .subscribe(async (interaction) => {
    if (interaction.commandName === 'ping') {
      await interaction.reply('Pong!');
    }
  });

fromEvent(client, 'messageCreate')
  .subscribe((message) => {
    console.log('The message object is: ', message);
    console.log(`${client.user?.username} say: `, message.content);
    console.log(`The client id is: ${client.user?.id}`);
  });

client.login(process.env.DISCORD_BOT_TOKEN);