const fs = require('fs');
const createInitialConfig = require("./util/createInitialConfig")
if(!fs.existsSync("./data/config.json")) {
	createInitialConfig();
}
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
const {
	globalPrefix,
	token,
	loginMessage,
	loginChannel,
	enableLoginMessage,
	owners,
	presenceText,
	presenceType
} = require('./data/config.json');

client.commands = new Discord.Collection();
client.serverPrefixes = new Discord.Collection();
client.netmodules = new Discord.Collection();

var reloadCommands = require("./util/reloadCommands.js");
const loadServerPrefixes = require('./util/loadServerPrefixes');
const reloadNetModules = require('./util/reloadNetModules');
const onMessage = require('./server/message');
const updatePresence = require('./util/updatePresence');
reloadCommands(client)
reloadNetModules(client)

client.once('ready', () => {
	console.clear();
	updatePresence(client)
	console.log('Ready!');
	if(presenceType && presenceText){
		let regex = /<prefix>/g
		client.user.setActivity(presenceText.replace(regex, globalPrefix), { type: presenceType });
	}
	else 
		client.user.setActivity(globalPrefix, {type : "WATCHING"});
	if (enableLoginMessage === true)
		try{
		client.channels.cache.get(loginChannel).send(loginMessage)
		}catch(err){
			console.log("Failed trying to send a message on login.\n")
		}
	loadServerPrefixes(client)
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});

client.on('message', async message => {
	onMessage(client, owners, message, globalPrefix);
});


client.login(token);