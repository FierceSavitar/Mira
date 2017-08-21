// Load up the discord.js library
const Discord = require("discord.js");

//Lets add the music Library to Mira so that we can listen to some of out favorite tunes.
//const music = require('discord.js-music');

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();
//music(client);
// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

const techniques = require('./techniques.json')
var type = ["Wake Induced Lucid Dreaming", "Wake Back to Bed","Out of Body Experience", "The act of being concious and fully aware while dreaming."]



client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".k
  client.user.setGame(`${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    // slice(1) removes the first part, which here should be the user mention!
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the kick!");
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the ban!");
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
    if (command === "getcandy") {
      //This command gives the user virtual currency.
message.reply("You have recieved your daily candy worth 50" + ":candy:")


    }

    if (command === "help") {
      const embed = new Discord.RichEmbed()
      .setTitle('Help')
      .setAuthor('DevSynths Tumblr Profile!', 'https://goo.gl/rHndF5')
      /*
       * Alternatively, use '#00AE86', [0, 174, 134] or an integer number.
       */
      .setColor(0x00AE86)
      .setDescription('Go to DevSynths tumblr profile for my commands at his Mira blog!')
      .setFooter('Message sent at ', 'https://goo.gl/hkFYh0')
      .setImage('https://goo.gl/D3uKk2')
      .setThumbnail('https://goo.gl/lhc6ke')
      /*
       * Takes a Date object, defaults to current date.
       */
      .setTimestamp()
      .setURL('https://devsynth.tumblr.com/mira')
      .addField('Field Title', 'Field Value')
      /*
       * Inline fields may not display as inline if the thumbnail and/or image is too big.
       */
      .addField('Thoughts', 'Hmm 🤔', true)
      /*
       * Blank field, useful to create some space.
       */
      .addField('\u200b', '\u200b', true)
      .addField('I feel like ', 'I\'m in the ZOONE', true);
    
    message.author.send({ embed });

    }

    if (command === "remindme") {
      message.reply("Sorry, DevSynth was too lazy to add that command try asking my friend Tatsumaki, shes here.")
    }

    if (command === "randomeme") {
      
    }

    if (command === "techniques") {
      message.reply(techniques[0], techniques[1], techniques[2], techniques[4])
    
    }
   
    if (command === techniques.WILD ) {
message.reply(type[0]);
    }

    else if (command === techniques.WBTB) {
message.reply(type[1]);
    }

    else if (command === techniques.OOBE) {
      message.reply(type[2])
    }
    else if (command === techniques.Lucid_Dreaming) {
      message.reply(type[3])
    }
  
   /** if (guild.memberCount += 1) {
      message.reply ("A new Synthizen has joined us today. Lets Welcome " + guild.member)
    }
    **/

    if (command === "membercount") {

    }

    if (command === "myavatar") {
      message.reply(message.author.avatarURL)
    }
if (command === "play") {
  var isInVoice = true;
  const ytdl = require('ytdl-core');
  const streamOptions = { seek: 0, volume: 1 };
  const broadcast = client.createVoiceBroadcast();
 let voiceChannel = client.channels.find('name', 'Music');
  voiceChannel.join()
   .then(connection => {
     const stream = ytdl('https://www.youtube.com/watch?v=XAWgeLF9EVQ', { filter : 'audioonly' });
     broadcast.playStream(stream);
     const dispatcher = connection.playBroadcast(broadcast);
   })
   .catch(console.error);
   if (console.error = true) {
     message.reply('Im sorry but this line of code isnt working right now')
   }
if (command === "stop") {
  let voiceChannel = client.channels.find('name', 'Music');
    voiceChannel.leave()
  
}
}


});

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  // Send the message to the guilds default channel (usually #general), mentioning the member
  
  //Main Code from Example
 // member.guild.defaultChannel.send(`Welcome to the server, ${member}!`);

  // If you want to send the message to a designated channel on a server instead
  // you can do the following:
  const channel = member.guild.channels.find('general', 'member-log');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the Synth Base, ${member} remember to take a look at #rules and have a good time!`);
});

//create an event listener for leaving members
/**client.on('guildMemberRemove', member => {
  member.guild.defaultChannel.send(`Were sorry you had to leave, ${member}!. Press F to pay respects`);

  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Im sorry you had to leave, ${member}!`);
});*/
client.login(config.token);