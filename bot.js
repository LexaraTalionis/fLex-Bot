const Discord = require("discord.js");
const https = require("https");

const wow = "https://worldofwarcraft.com/en-us/character/us/";

function parseName(str) {
	var info = str.split("-");
	var name = info[0];
	var realm = info[1];
	var realmDash = realm.replace(" ", "-");
	var url = wow+realmDash+"/"+name;
	
	https.get(url, (result) => {
		if (result.statusCode !== 200) {
			return name, realm;
		} else {
			return name, realm, url;
		}
	});
}

const client = new Discord.Client();

var newUsers = {};

client.on("ready", () => {
    console.log("Logged in as "+client.user.tag+"!");
});

client.on("guildMemberAdd", user => {
	newUsers[user.id] = {};
	user.send("Welcome to the Lex Raid Discord! To access our Discord, please provide your character name and realm. IE: Lexara-Wyrmrest Accord");
});

client.on("message", message => {
	var userID = message.author.id;
	
	if (message.channel.type == "dm") {
		if (typeof newUsers[userID].name == 'string' && typeof newUsers[userID].realm == 'string') {
			if (message.content.startsWith("Yes")) {
				
			} else if (message.content.startsWith("No")) {
				delete newUsers[userID].name;
				delete newUsers[userID].realm;
				
				message.author.send("Let's try again. What is your character name and realm? IE: Lexara-Wyrmrest Accord");
			} else {
				message.author.send("I'm sorry, I don't understand. Is that your character? Type Yes or No.");
			}
		} else {
			var name, realm, url = parseName(message.content);
			
			if (typeof url === "string") {
				newUsers[userID].name = name;
				newUsers[userID].realm = realm;
				message.author.send(url+"\nIs this your character? Type Yes or No.");
			} else {
				message.author.send("I can't seem to find "+name+" on "+realm+". Let's try again. What is your character name and realm? IE: Lexara-Wyrmrest Accord");
			}
		}
	} else if (!message.author.bot) {
		if (message.content.startsWith("!new")) {
			newUsers[userID] = {};
			message.author.send("Welcome to the Lex Raid Discord! To access our Discord, please provide your character name and realm. IE: Lexara-Wyrmrest Accord");
		}
	}
});

client.login(process.env.BOT_TOKEN);