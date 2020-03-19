const Discord = require("discord.js");
const https = require("https");

const wow = "https://worldofwarcraft.com/en-us/character/us/";
const client = new Discord.Client();

var newUsers = new Map();

client.on("ready", () => {
    console.log("Logged in as "+client.user.tag+"!");
});

client.on("guildMemberAdd", user => {
	newUsers.set(user.id, new Map());
	user.send("Welcome to the Lex Raid Discord! To access our Discord, please provide your character name and realm. IE: Lexara-Wyrmrest Accord");
});

client.on("message", message => {
	if (message.author.bot) {
		return;
	}
	
	var userID = message.author.id;
	
	if (message.channel.type == "dm") {
		var info = newUsers.get(userID);
		
		if (info.has("name") && info.has("realm")) {
			if (message.content.startsWith("Yes")) {
				message.author.setNickname(info.get("name")+"-"+info.get("realm"));
				message.author.roles.set(["First Raid"]);
				message.author.send("You're all set up!");
			} else if (message.content.startsWith("No")) {
				newUsers.get(userID).delete("name");
				newUsers.get(userID).delete("realm");
				
				message.author.send("Let's try again. What is your character name and realm? IE: Lexara-Wyrmrest Accord");
			} else {
				message.author.send("I'm sorry, I don't understand. Is that your character? Type Yes or No.");
			}
		} else {
			var info = message.content.split("-");
			var name = info[0];
			var realm = info[1];
			var realmDash = realm.replace(" ", "-");
			var url = wow+realmDash+"/"+name;
			
			https.get(url, (result) => {
				if (result.statusCode !== 200) {
					console.log("Failure: "+name+", "+realm);
					message.author.send("I can't seem to find "+name+" on "+realm+". Let's try again. What is your character name and realm? IE: Lexara-Wyrmrest Accord");
				} else {
					console.log("Success: "+name+", "+realm+", "+url);
					newUsers.get(userID).set("name", name);
					newUsers.get(userID).set("realm", realm);
					message.author.send(url+"\nIs this your character? Type Yes or No.");
				}
			});
		}
	} else {
		if (message.content.startsWith("!new")) {
			newUsers.set(userID, new Map());
			message.author.send("Welcome to the Lex Raid Discord! To access our Discord, please provide your character name and realm. IE: Lexara-Wyrmrest Accord");
		}
	}
});

client.login(process.env.BOT_TOKEN);