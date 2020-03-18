const Discord = require('discord.js');
const https = require('https');
const client = new Discord.Client();

const wow = "https://worldofwarcraft.com/en-us/character/us/";

client.on('ready', () => {
    console.log("Logged in as "+client.user.tag+"!");
});

client.on('message', message => {
	var info = message.content.split("-");
	var name = info[0];
	var realm = info[1];
	var realmDash = realm.replace(" ", "-");
	var url = wow+realm+"/"+name;
	
	https.get(url, (result) => {
		if (result.statusCode !== 200) {
			message.channel.send("I can't seem to find "+name+" on "+realm+".");
		} else {
			message.channel.send("Is this your character?\n"+url);
		}
	});
});

client.login(process.env.BOT_TOKEN);