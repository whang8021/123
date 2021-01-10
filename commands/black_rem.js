const Discord = require('discord.js');
const error = require('../Discord.js/error.js');
const config = require('../config/bot_info.json');
const sqlite3 = require('sqlite3')
const path = require('path');
const dbPath = path.resolve(__dirname, './databases/user_info.db');

module.exports.run = async (client, message) => {
    if(message.author.id == config.owners) {
        let msg = message.content.substring(6, 27)
        msg = msg.replace(/[^0-9]/g, "")
        var member = message.guild.member(message.author)
        let nickname = member ? member.displayName : null;
        const user_info = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (error_u) => {
            if(error_u) {
                let embed = new (Discord.MessageEmbed)()
                embed.setColor("#FF0000")
                embed.setTitle("오류 발생")
                embed.setAuthor(nickname, message.author.avatarURL())
                embed.setDescription("```js\n" + error_u.message + "\n```")
                message.channel.send({ embed: embed })
            } else {
                if(msg == "") {
                    return error.wrongcmd(message, "!블랙제거 유저멘션/유저아이디")
                } else {
                    user_info.serialize();
                    user_info.run(`UPDATE user_info SET user_black = 'FALSE' WHERE user_id = '${msg}'`)
                    message.react("✅")
                }
            }
        })
    } else {
        return error.noPerms(message, "BOT OWNER")
    }
}

module.exports.help = {
    name: "블랙제거"
}