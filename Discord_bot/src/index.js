import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
import handler from './handler.js';
import sendEvent from './sendEvent.js';

dotenv.config();

const client = new Client({ intents: [
  GatewayIntentBits.Guilds ,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildInvites,
  ]
});


client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    client.guildInvites = await handler.fetchGuildInvites(guild);
  } catch (err) {
    console.log(err);
  }
});

// Whenever a new invite is created, we refresh our cache
client.on('inviteCreate', async (invite) => {
  try {
    const server = await invite.guild.fetch();
    client.guildInvites = await handler.fetchGuildInvites(invite.guild);
    console.log(`Invite created for server ${server.name} (${server.id}) with URL: ${invite.url}`);
  } catch (err) {
    console.log(err);
  }
});

// we retrieve the new Invites values and compare them with  their previous values.
client.on('guildMemberAdd', async (member) => {
  try {
    const userData = await handler.onNewUser(member, client);
    console.log('New User: ', userData);
    await sendEvent(userData.userId, userData.code);
  } catch(err) {
    console.log(err);
  }

});

setTimeout(function() {}, 5000)

// Log our bot to discord API.
client.login(process.env.DISCORD_BOT_TOKEN);
