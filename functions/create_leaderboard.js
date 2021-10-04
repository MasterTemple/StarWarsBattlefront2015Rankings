module.exports = async (client, config) => {
    return new Promise(async(accept, reject) => {
        let colors = {
            "BRONZE": "#a84300",
            "SILVER": "#95a5a6",
            "GOLD": "#f1c40f",
            "DIAMOND": "#9b59b6",
            "KYBER": "#1abc9c"
        }

        let descriptions = {
            KYBER: "",
            DIAMOND: "",
            GOLD: "",
            SILVER: "",
            BRONZE: ""
        }
        let fields = {
            KYBER: {
                "0": "",
                "1": "",
                "2": ""
            },
            DIAMOND: {
                "0": "",
                "1": "",
                "2": ""
            },
            GOLD: {
                "0": "",
                "1": "",
                "2": ""
            },
            SILVER: {
                "0": "",
                "1": "",
                "2": ""
            },
            BRONZE: {
                "0": "",
                "1": "",
                "2": ""
            },
        }

        let sqlite3 = require('sqlite3').verbose();
        let Discord = require('discord.js')
        let db = new sqlite3.Database('./data/players.db')

        async function get_info() {
            return new Promise((on_success, on_reject) => {
                db.all('SELECT country_emoji, current_origin_name, discord_id, overall_league, overall_ranking, overall_BR, drop_zone_league, spreadsheet_name FROM players WHERE overall_league IS NOT NULL ORDER BY drop_zone_BR DESC', [], (err, rows) => {
                    // console.log(row.discord_id)
                    on_success(rows)
                    // on_success([row.current_origin_name, row.country_emoji])
                })
            })

        }

        let players = await get_info()
        db.close()
        // console.log(players)
        players.forEach((player, c) => {
            descriptions[player.drop_zone_league] = `${descriptions[player.drop_zone_league]}**${c + 1}.** ${player.country_emoji} ${player.current_origin_name || ("__" + player.spreadsheet_name + "__")}: ${player.overall_BR}\n`
            // fields[player.overall_league][c%2] = `${fields[player.overall_league][c%2]}**${c+1}.** ${player.country_emoji} ${player.current_origin_name || ("__"+player.spreadsheet_name+"__")}: ${player.overall_BR}\n`
            // fields[player.overall_league][c%3] = `${fields[player.overall_league][c%3]}**${c+1}.** ${player.country_emoji} ${player.current_origin_name || ("__"+player.spreadsheet_name+"__")}: ${player.overall_BR}\n`

        })

        let KYBER_embed = new Discord.MessageEmbed().setTitle('KYBER').setColor(colors['KYBER']).setDescription(descriptions["KYBER"]).setThumbnail('https://cdn.discordapp.com/emojis/805830589978378270.png?v=1')
        let DIAMOND_embed = new Discord.MessageEmbed().setTitle('DIAMOND').setColor(colors['DIAMOND']).setDescription(descriptions["DIAMOND"]).setThumbnail("https://cdn.discordapp.com/emojis/805830590070128650.png?v=1")
        let GOLD_embed = new Discord.MessageEmbed().setTitle('GOLD').setColor(colors['GOLD']).setDescription(descriptions["GOLD"]).setThumbnail("https://cdn.discordapp.com/emojis/805830590132912208.png?v=1")
        let SILVER_embed = new Discord.MessageEmbed().setTitle('SILVER').setColor(colors['SILVER']).setDescription(descriptions["SILVER"]).setThumbnail("https://cdn.discordapp.com/emojis/805830590158340156.png?v=1")
        let BRONZE_embed = new Discord.MessageEmbed().setTitle('BRONZE').setColor(colors['BRONZE']).setDescription(descriptions["BRONZE"]).setThumbnail("https://cdn.discordapp.com/emojis/805830590158209044.png?v=1")

        // let KYBER_embed = new Discord.MessageEmbed().setTitle('KYBER').setColor(colors['KYBER']).setThumbnail('https://cdn.discordapp.com/emojis/805830589978378270.png?v=1').addFields({name: config.invis_char, value: fields.KYBER['0'], inline: true}, {name: config.invis_char, value: fields.KYBER['1'], inline: true})
        // let DIAMOND_embed = new Discord.MessageEmbed().setTitle('DIAMOND').setColor(colors['DIAMOND']).setThumbnail("https://cdn.discordapp.com/emojis/805830590070128650.png?v=1").addFields({name: config.invis_char, value: fields.DIAMOND['0'], inline: true}, {name: config.invis_char, value: fields.DIAMOND['1'], inline: true})
        // let GOLD_embed = new Discord.MessageEmbed().setTitle('GOLD').setColor(colors['GOLD']).setThumbnail("https://cdn.discordapp.com/emojis/805830590132912208.png?v=1").addFields({name: config.invis_char, value: fields.GOLD['0'], inline: true}, {name: config.invis_char, value: fields.GOLD['1'], inline: true})
        // let SILVER_embed = new Discord.MessageEmbed().setTitle('SILVER').setColor(colors['SILVER']).setThumbnail("https://cdn.discordapp.com/emojis/805830590158340156.png?v=1").addFields({name: config.invis_char, value: fields.SILVER['0'], inline: true}, {name: config.invis_char, value: fields.SILVER['1'], inline: true})
        // let BRONZE_embed = new Discord.MessageEmbed().setTitle('BRONZE').setColor(colors['BRONZE']).setThumbnail("https://cdn.discordapp.com/emojis/805830590158209044.png?v=1").addFields({name: config.invis_char, value: fields.BRONZE['0'], inline: true}, {name: config.invis_char, value: fields.BRONZE['1'], inline: true})

        // let KYBER_embed = new Discord.MessageEmbed().setTitle('KYBER').setColor(colors['KYBER']).setThumbnail('https://cdn.discordapp.com/emojis/805830589978378270.png?v=1').addFields({name: config.invis_char, value: fields.KYBER['0'], inline: true}, {name: config.invis_char, value: fields.KYBER['1'], inline: true}, {name: config.invis_char, value: fields.KYBER['2'], inline: true})
        // let DIAMOND_embed = new Discord.MessageEmbed().setTitle('DIAMOND').setColor(colors['DIAMOND']).setThumbnail("https://cdn.discordapp.com/emojis/805830590070128650.png?v=1").addFields({name: config.invis_char, value: fields.DIAMOND['0'], inline: true}, {name: config.invis_char, value: fields.DIAMOND['1'], inline: true}, {name: config.invis_char, value: fields.DIAMOND['2'], inline: true})
        // let GOLD_embed = new Discord.MessageEmbed().setTitle('GOLD').setColor(colors['GOLD']).setThumbnail("https://cdn.discordapp.com/emojis/805830590132912208.png?v=1").addFields({name: config.invis_char, value: fields.GOLD['0'], inline: true}, {name: config.invis_char, value: fields.GOLD['1'], inline: true}, {name: config.invis_char, value: fields.GOLD['2'], inline: true})
        // let SILVER_embed = new Discord.MessageEmbed().setTitle('SILVER').setColor(colors['SILVER']).setThumbnail("https://cdn.discordapp.com/emojis/805830590158340156.png?v=1").addFields({name: config.invis_char, value: fields.SILVER['0'], inline: true}, {name: config.invis_char, value: fields.SILVER['1'], inline: true}, {name: config.invis_char, value: fields.SILVER['2'], inline: true})
        // let BRONZE_embed = new Discord.MessageEmbed().setTitle('BRONZE').setColor(colors['BRONZE']).setThumbnail("https://cdn.discordapp.com/emojis/805830590158209044.png?v=1").addFields({name: config.invis_char, value: fields.BRONZE['0'], inline: true}, {name: config.invis_char, value: fields.BRONZE['1'], inline: true}, {name: config.invis_char, value: fields.BRONZE['2'], inline: true})


        let channel = client.channels.cache.get(config.leader_board_channel)

        // console.log(channel)
        channel.messages.fetch().then(async (messages) => {
            // console.log(messages)
            if (messages.size === 0) {
                await channel.send({
                    content: `Last Updated: <t:${Math.floor(new Date() / 1000)}:R>`,
                    embeds: [KYBER_embed, DIAMOND_embed, GOLD_embed, SILVER_embed, BRONZE_embed]
                })
            } else {
                await messages.first().edit({
                    content: `Last Updated: <t:${Math.floor(new Date() / 1000)}:R>`,
                    embeds: [KYBER_embed, DIAMOND_embed, GOLD_embed, SILVER_embed, BRONZE_embed]
                })
            }
        })

        // let leader_board = await client.channels.cache.get(config.leader_board_channel).send({embeds: [KYBER_embed, DIAMOND_embed, GOLD_embed, SILVER_embed, BRONZE_embed]})
        // console.log(leader_board.id)
        accept()
    })
}
