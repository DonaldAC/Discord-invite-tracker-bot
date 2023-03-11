import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
import handler from './handler.js';

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

  const guild = client.guilds.cache.get(process.env.GUILD_ID);

  client.guildInvites = await handler.fetchGuildInvites(guild);
});

// Whenever a new invite is created, we refresh our cache
client.on('inviteCreate', async (invite) => {
  const server = await invite.guild.fetch();

  client.guildInvites = await handler.fetchGuildInvites(invite.guild);

  console.log(`Invite created for server ${server.name} (${server.id}) with URL: ${invite.url}`);
});

// we retrieve the new Invites values and compare them with  their previous values.
client.on('guildMemberAdd', async (member) => {
  await handler.onNewUser(member, client);
});

// Log our bot to discord API.
client.login(process.env.DISCORD_BOT_TOKEN);
