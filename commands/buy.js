const Discord = require('discord.js');
const error = require('../Discord.js/error.js');
const sqlite3 = require('sqlite3')
const path = require('path');
const dbPath = path.resolve(__dirname, './databases/item_list.db');
const dbPath_2 = path.resolve(__dirname, './databases/user_info.db');
const config = require('../config/bot_info.json');

module.exports.run = async (client, message) => {
    let gold = message.content.split(' ')
    var member = message.guild.member(message.author)
    let nickname = member ? member.displayName : null;
    const user_info = new sqlite3.Database(dbPath_2, sqlite3.OPEN_READWRITE, (error_u) => {
        const item = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (error_i) => {
            if(error_u) {
                let embed = new (Discord.MessageEmbed)()
                embed.setColor("#FF0000")
                embed.setTitle("오류 발생")
                embed.setAuthor(nickname, message.author.avatarURL())
                embed.setDescription("```js\n" + error_u.message + "\n```")
                message.channel.send({ embed: embed })
            }
            if(error_i) {
                let embed2 = new (Discord.MessageEmbed)()
                embed2.setColor("#FF0000")
                embed2.setTitle("오류 발생")
                embed2.setAuthor(nickname, message.author.avatarURL())
                embed2.setDescription("```js\n" + error_i.message + "\n```")
                message.channel.send({ embed: embed2 })
            }
            if(gold[1] == undefined) {
                return error.wrongcmd(message, "!구매 상품이름")
            } else {
                user_info.serialize();
                user_info.all(`SELECT user_money, user_black FROM user_info WHERE user_id = '${message.author.id}'`, function(error_user, rows) {
                    item.serialize();
                    item.all(`SELECT item_name, item_price FROM item_list WHERE item_name = '${gold[1]}'`, function(error_item, rows2) {
                        try {
                            console.log(rows[0].user_black)
                        } catch (e) {
                            return message.channel.send(`<@${message.author.id}> 먼저 가입해주세요.`)
                        }
                        try {
                            console.log(rows2[0].item_price)
                        } catch (e) {
                            return message.channel.send(`<@${message.author.id}> 없는 상품입니다.`)
                        }
                        if(rows[0].user_black == "TRUE") {
                            return message.channel.send(`<@${message.author.id}>님은 관리자로부터 차단되어, 자판기 기능을 이용하실 수 없습니다.`)
                        } else {
                            if(rows[0].user_money < rows2[0].item_price) {
                                return message.channel.send(`<@${message.author.id}> 현재 소지하고 계신 금액이 부족합니다.\n${rows2[0].item_price - rows[0].user_money}원이 더 필요합니다.`)
                            } else {
                                user_info.run(`UPDATE user_info SET user_money = user_money - ${rows2[0].item_price} WHERE user_id = '${message.author.id}'`)
                                message.react("✅")
                                client.channels.cache.get(config.buylog_ch).send(`<@${message.author.id}> 님이 ${gold[1]} 상품을 구매하였습니다.`)
								item.run(`DELETE FROM item_list WHERE item_name = '${gold[1]}'`)
                                client.users.fetch(message.author.id).then((player) => {
                                    try {
                                        player.send(`${rows2[0].item_name} 물건의 구매가 완료되었습니다.`, { files: [`./item/${rows2[0].item_name}.zip`]})
                                    } catch (error) {
                                        message.channel.send(`<@${message.author.id}> 구매는 완료되었으나 어떠한 이유에서인지 DM 전송에 실패하였습니다.\n수동으로 관리자에게 파일을 요청하세요.`)
                                    }
                                })
                                client.users.fetch(config.owners).then((owner) => {
                                    let succ_embed = new (Discord.MessageEmbed)
                                    succ_embed.setTitle(`${message.author.tag} 님이 ${gold[1]} 상품을 구매하셨습니다.`)
                                    succ_embed.setColor("#FF0000")
                                    owner.send({ embed: succ_embed })
                                })
                            }
                        }
                    })
                    
                })

            }
        })
    });
}

module.exports.help = {
    name: "구매"
}