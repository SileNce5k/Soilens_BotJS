const Discord = require('discord.js');
const parseMention = require("../util/parseMention.js")
const creationJoinDates = require("../util/creationJoinDates")

module.exports = {
    name: 'userinfo',
    description: 'Displays information about the user(not done)',
    execute(message, client, args) {
        let info;
        if (!args[0]) {
            info = message.author;
        } else {
            info = parseMention(args[0], message.guild);
        }
        
        let user = message.guild.members.cache.get(info.id);
        var nickname = "";
        if (user.nickname) {
          nickname = `<:aka:572089580925485058> ${user.nickname} `;
        }

        var roleColor = 15788778;

        if (user.roles.color.color) {
            roleColor = user.roles.color.color;
        }
        
        var createJoin = creationJoinDates(user.user)

        const embed = new Discord.MessageEmbed()
            .setThumbnail(user.user.avatarURL({ format: 'png', dynamic: true, size: 2048 }))
            .setColor(roleColor)
            .setTimestamp()
            .setAuthor(info.username, user.user.avatarURL)
            .addField("Username", `**${user.user.username}#${user.user.discriminator}**${nickname}`)
            //.addField("Joined", createJoin.joindate, true)
            .addField("Creation date", createJoin.creation, true)

        message.channel.send(embed);
    }
};