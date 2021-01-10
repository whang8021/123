const Discord = require('discord.js');
const sqlite3 = require('sqlite3')
const path = require('path');
const dbPath = path.resolve(__dirname, './databases/item_list.db');

module.exports.run = async (client, message) => {
    const item = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if(err) {
            var member = message.guild.member(message.author)
            let nickname = member ? member.displayName : null;

            let embed = new (Discord.MessageEmbed)()
            embed.setColor("#FF0000")
            embed.setTitle("오류 발생")
            embed.setAuthor(nickname, message.author.avatarURL())
            embed.setDescription("```js\n" + err.message + "\n```")
            message.channel.send({ embed: embed })
        } else {
            try {
                item.serialize();
                item.all(`SELECT item_name, item_price FROM item_list`, function(err, rows) {
                    if(err) console.log(err)
                    let list = new (Discord.MessageEmbed)()
                    let text = ""
                    list.setColor("#FF0000")
                    list.setTitle("도움말")
                    rows.forEach(function (row) {
                    })
                    message.channel.send(`<@${message.author.id}> > 관리자 명령어
                    !충전 멘션/유저아이디 금액 
                    (멘션 혹은 유저아이디에게 금액 만큼 캐쉬를 충전합니다.)
                    
                    !블랙추가 멘션/유저아이디
                    (멘션한 유저를 블랙으로 등록합니다. 등록 시 구매가 불가능해집니다.)
                    
                    !블랙제거 멘션/유저아이디
                    (멘션한 유저를 블랙에서 제거합니다.)
                    
                    !파일추가 파일이름 가격
                    (파일이름 파일을 가격으로 자판기에 올립니다.)
                    
                    !파일제거 파일이름
                    (파일이름 파일을 자판기에서 제거합니다.)
                    
                    > 유저명령어
                    
                    !목록
                    (자판기 목록을 확인합니다.)
                    
                    !구매 파일이름
                    (파일이름 파일을 구매합니다.)
                    
                    !가입
                    (자판기 시스템에 가입합니다.)
                    
                    !충전신청 금액(숫자만) 할말들(문상일경우 핀코드 적으시면 됩니다.)
                    (관리자에게 (금액)만큼 충전신청을 합니다.)
                    (할말엔 어떤 방식으로 돈을 줄것인지 설명하면 좋습니다.(계좌일 경우만 ))
                    (개인 DM으로 할 것을 추천합니다.
                    MADE BY WhiteKJ#0001 (Discord & Made Modified by !앨리스#1111))`)
                    });
            } catch (db_err) {
                let embed = new (Discord.MessageEmbed)()
                embed.setColor("#FF0000")
                embed.setTitle("오류 발생")
                embed.setAuthor(nickname, message.author.avatarURL())
                embed.setDescription("```js\n" + db_err.message + "\n```")
                message.channel.send({ embed: embed })
            }
        }
    });
}

module.exports.help = {
    name: "도움말"
}