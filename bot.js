const Discord = require("discord.js");
const https = require("https");

const wow = "https://worldofwarcraft.com/en-us/character/us/";

var parseName = function(str) {
	var info = str.split("-");
	var name = info[0];
	var realm = info[1];
	var realmDash = realm.replace(" ", "-");
	var url = wow+realmDash+"/"+name;
	
	https.get(url, (result) => {
		if (result.statusCode !== 200) {
			console.log("Failure: "+name+", "+realm);
			return name, realm;
		} else {
			console.log("Success: "+name+", "+realm+", "+url);
			return name, realm, url;
		}
	});
}

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
		/*if (typeof newUsers.get(userID).get(name) == 'string' && typeof newUsers.get(userID).get(realm) == 'string') {
			if (message.content.startsWith("Yes")) {
				
			} else if (message.content.startsWith("No")) {
				delete newUsers.get(userID).delete(name);
				delete newUsers.get(userID).delete(realm);
				
				message.author.send("Let's try again. What is your character name and realm? IE: Lexara-Wyrmrest Accord");
			} else {
				message.author.send("I'm sorry, I don't understand. Is that your character? Type Yes or No.");
			}
		} else {*/
			var name, realm, url = await parseName(message.content);
			console.log(name, realm, url);
			/*
			if (typeof url === "string") {
				newUsers.get(userID).set("name", name);
				newUsers.get(userID).set("realm", realm);
				message.author.send(url+"\nIs this your character? Type Yes or No.");
			} else {
				message.author.send("I can't seem to find "+name+" on "+realm+". Let's try again. What is your character name and realm? IE: Lexara-Wyrmrest Accord");
			}
		}*/
	} else {
		if (message.content.startsWith("!new")) {
			console.log(userID);
			newUsers.set(userID, new Map());
			message.author.send("Welcome to the Lex Raid Discord! To access our Discord, please provide your character name and realm. IE: Lexara-Wyrmrest Accord");
		}
	}
});

client.login(process.env.BOT_TOKEN);