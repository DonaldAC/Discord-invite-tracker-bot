import { EmbedBuilder } from 'discord.js';

/**
 * Compare two objects
 * @param {object} objA - The first object to compare
 * @param {object} objB - The second object to compare
 * @returns {string} 
 */
function compareObjects(objA, objB) {
  let changedCode;
  for (const key in objA) {
    if (objA.hasOwnProperty(key) && objB.hasOwnProperty(key)) {
      if (objA[key] !== objB[key]) {
        changedCode = key;
      }
    }
  }
  return changedCode;
}

/**
 * Fetch all the invites of an Guild and their respectives usage values
 * @param {object} guild - the discord server on which we are working
 * @returns {object}
 */
async function fetchGuildInvites (guild) {
  const inviteCounts = {};

  await guild.invites.fetch()
    .then((invites) => {
      invites.forEach((invite) => {
        inviteCounts[invite.code] = invite.uses;
      });      
    })

  return inviteCounts;
}

/**
 * Get new invite values and check the one which has incremented.
 * @param {object} member - The new member object 
 * @returns 
 */
async function onNewUser(member, client) {
  if(member.user.bot) return;
  
  const guild = member.guild;

  // Get the new guild invite and compare them with their previous values.
  const newInvites = await fetchGuildInvites(guild)

  const usedCode = compareObjects(client.guildInvites, newInvites);
   
   if (usedCode && usedCode.length > 0) {
    const channel = guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
    const serverName = guild.name;
    const message = `User ${member.user.id} joined using code ${usedCode} on server ${serverName}`;
    console.log(message);
    channel.send(message);

    const embedMsg = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('New User Joined!!')
      .setURL(`https://discord.gg/${usedCode}`)
      .setAuthor({ name: `${member.user.tag}`, url: `https://discord.gg/${usedCode}`, icon_url: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`})
      .setTimestamp()
      .setFooter({ text: 'Log By Discord invite Tracker v1.0', iconURL: `${process.env.ICON_URL}` });
      console.log(embedMsg);
      channel.send({ embeds: [embedMsg] });
  } else {
    console.log(`User ${member.user.tag} which has the ID ${member.user.id} joined without using an invite`);
  }
}


export default {
  compareObjects,
  fetchGuildInvites,
  onNewUser
}