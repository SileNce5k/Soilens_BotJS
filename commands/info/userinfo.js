const Discord = require('discord.js');
const getCreationDate = require('../../util/getCreationDate.js');
const getJoinDate = require('../../util/getJoinDate.js');
const getNickname = require('../../util/getNickname.js');
const morePresence = require('../../util/morePresence.js');
const parseMention = require("../../util/parseMention.js")

module.exports = {
	name: 'userinfo',
	description: 'Displays information about the user',
	moreHelp: ["Example: <prefix>userinfo <some_username>","It works with username, nickname, userid, and mention"],
	execute({message, args}) {
		let info;
		if (!args[0]) {
			info = message.author.id;
		} else {
			info = parseMention(args[0], message.guild);
		}
		let user = message.guild.members.cache.get(info);

		let nickname = ""
		let _nick = getNickname(user, message.guild)
		if (_nick != null) {
			nickname = ` <:aka:572089580925485058>${nickname}`;
		}

		let roleColor = 15788778;
		if (user.roles.color) {
			roleColor = user.roles.color.color;
		}
		let presenceDetails = 0;
		let isPresence = false;
		
		if(user.user.presence.activities.length != 0){
			presenceDetails = morePresence(user);
			isPresence = true;
		}
		let roles = "";
		user.roles.cache.each(role => {
			if (role.name != "@everyone")
				roles = roles+"<@&"+role.id+">\n";
		});
		const embed = new Discord.MessageEmbed()
			.setThumbnail(user.user.avatarURL({ format: 'png', dynamic: true, size: 2048 }))
			.setColor(roleColor)
			.setTimestamp()
			.setAuthor(user.user.username, user.user.avatarURL({ format: 'png', dynamic: true, size: 2048 }))
			.addField("Username", `**${user.user.username}#${user.user.discriminator}**${nickname}`)
			.addField("Status", user.user.presence.status.charAt(0).toUpperCase()+user.user.presence.status.slice(1), true)
			if(isPresence)
				embed.addField("Presence", user.user.presence.activities[0].name, true)
			if(presenceDetails != 0)
				embed.addField("Details", presenceDetails, false)
			embed.addField("Creation date", getCreationDate(user), true)
			embed.addField("Join date", getJoinDate(user, message.guild), true)
			if(roles != ""){
				embed.addField("Roles", roles)
			}

		message.channel.send(embed);
	}
};