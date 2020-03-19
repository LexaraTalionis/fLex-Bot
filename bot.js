const Discord = require("discord.js");
const https = require("https");

const wow = "https://worldofwarcraft.com/en-us/character/us/";
const client = new Discord.Client();

function parseName(str) {
	var clean = str.trim().toLowerCase();
	var words = clean.match(/[a-z]+/g);
	var name = words[0];
	words.shift();
	var realm = words.join(" ");
	var realmDash = words.join("-");
	var url = wow+realmDash+"/"+name;
	
	return name, realm, url;
}

var newUsers = new Map();

client.on("ready", () => {
    console.log("Logged in as "+client.user.tag+"!");
});

client.on("guildMemberAdd", member => {
	newUsers.set(member.id, new Map());
	
	const channel = member.guild.channels.cache.find(ch => ch.name === "general");
	
	if (!channel) return;
	
	channel.send("Welcome to the Lex Raid Discord, <@"+member.id+">! To access our Discord, please provide your character name and realm. IE: Lexara-Wyrmrest Accord");
});

client.on("message", message => {
	if (message.author.bot) {
		return;
	}
	
	var userID = message.author.id;
	
	if (message.content.startsWith("!new")) {
		newUsers.set(userID, new Map());
		message.channel.send("Welcome to the Lex Raid Discord <@"+userID+">! To access our Discord, please provide your character name and realm. IE: Lexara-Wyrmrest Accord");
	} else {
		var info = newUsers.get(userID);
		
		if (info.has("name") && info.has("realm")) {
			if (message.content.startsWith("Yes")) {
				message.member.setNickname(info.get("name")+"-"+info.get("realm")).catch(e=>console.log("Set Nickname: "+e));
				message.member.roles.set(["First Raid"]).catch(e=>console.log("Set Roles: "+e));
				message.channel.send("You're all set up, <@"+userID+">!");
			} else if (message.content.startsWith("No")) {
				newUsers.get(userID).delete("name");
				newUsers.get(userID).delete("realm");
				
				message.channel.send("Let's try again, <@"+userID+">. What is your character name and realm? IE: Lexara-Wyrmrest Accord");
			} else {
				message.channel.send("I'm sorry, <@"+userID+">, I don't understand. Is that your character?\nType __**Yes**__ or __**No**__.");
			}
		} else {
			var name, realm, url = parseName(message.content);
			
			https.get(url, (result) => {
				if (result.statusCode !== 200) {
					message.channel.send("I can't seem to find "+name+" on "+realm+", <@"+userID+">. Let's try again. What is your character name and realm? IE: Lexara-Wyrmrest Accord");
				} else {
					newUsers.get(userID).set("name", name);
					newUsers.get(userID).set("realm", realm);
					message.channel.send("Is this your character, <@"+userID+">?\nType __**Yes**__ or __**No**__.\n"+url);
				}
			});
		}
	}
});

client.login(process.env.BOT_TOKEN);