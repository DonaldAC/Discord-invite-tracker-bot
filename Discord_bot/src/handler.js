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
 * @returns {object} - The list of invites and their respective 
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
 * @returns  {object} Information of the new user.
 */
async function onNewUser(member, client) {
  if(member.user.bot) return;
  
  const guild = member.guild;

  // Get the new guild invite and compare them with their previous values.
  const newInvites = await fetchGuildInvites(guild)

  const usedCode = compareObjects(client.guildInvites, newInvites);

  if (usedCode && usedCode.length > 0) {
  const serverName = guild.name;
  const message = `${member.user.username} with the ID: ${member.user.id} joined using code ${usedCode} on server ${serverName}`;
  console.log(message);
  
    return {
      name: `${member.user.username}`,
      code: `${usedCode}`,
      userId: `${member.user.id}`
    };
  }
}


export default {
  compareObjects,
  fetchGuildInvites,
  onNewUser
}