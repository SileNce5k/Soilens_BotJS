const calculateReloaded = require("../util/calculateReloaded");
const reloadCommands = require("../util/reloadCommands");

module.exports = {
	name: 'update',
	description: 'pull changes from remote and reload commands with git',
	admin: true,
	execute({message, client}) { 
		let cmd = "git pull --ff-only";
		const exec = require("child_process").exec;
		exec(cmd, (err, stdout, stderr) => {
			process.stdout.write(stdout);
			if(stdout.startsWith("Already up to date.")){
				message.channel.send("Already up to date.\nNo updating needed.")
			}else{
				let beforeSize = client.commands.size;
				reloadCommands(client)
				let sendText = `${stdout}\nBot updated, and\n${calculateReloaded(beforeSize, client)}`
				message.channel.send(sendText).then(function(msg){
					let regex = /(.{0,7}\.\..{0,7})/
					let commits = stdout.match(regex)[0]
					cmd = `git log --oneline ${commits}`;
					exec(cmd, (err, stdout, stderr) =>{
						process.stdout.write(stdout)
						msg.edit(`${sendText}\n\nLatest commits:\n${stdout}`)
						if (err) console.log(stderr)
					})
				})
			}
			if (err) {
				message.channel.send("Something went wrong...");
				console.log(stderr);
			}
		});
		
	}
};