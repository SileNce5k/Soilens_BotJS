const fs = require('fs')
const commandPath = 'commands/'
const utilPath = 'util/'


module.exports = function (client) {
	let utilFiles = fs.readdirSync(utilPath).filter(file => file.endsWith('.js'));
	let subdir = fs.readdirSync(commandPath)//.filter(file => file.endsWith('.js'));
	let commandFiles = [];
	subdir.forEach(item => {
		if(fs.statSync(commandPath+item).isDirectory()){
			let subdirFiles = fs.readdirSync(commandPath+item).filter(file => file.endsWith('.js'))
			subdirFiles.forEach(file => {
				commandFiles.push(commandPath+item+"/"+file)
			});
		}
	});
	if (client.commands.size != 0) {
		for (const i of commandFiles) {
			delete require.cache[require.resolve(`../${commandPath}${i}`)];
		}
		for (const i of utilFiles){
			delete require.cache[require.resolve(`../${utilPath}${i}`)]
		}
	}
	client.commands.clear()
	for (const file of commandFiles) {
		const command = require(`../${file}`);
		client.commands.set(command.name, command);
	}
}

