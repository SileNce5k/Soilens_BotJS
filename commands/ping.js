module.exports = {
	name: 'ping', // Keep it to one word
	description: 'Just ping.',
	execute({message, client}) { //parameters you can use for netload: message, args, client, prefix 
		message.channel.send(`Pong.\n${client.ws.ping}ms`)
	}
};