module.exports = async (client, config) => {

    // let colors = {
    //     "BRONZE": "#a84300",
    //     "SILVER": "#95a5a6",
    //     "GOLD": "#f1c40f",
    //     "DIAMOND": "#9b59b6",
    //     "KYBER": "#1abc9c"
    // }
    let colors = [
        "#ffffff",
        "#0021ff",
        "#7200d2",
        "#7200d2",
        "#de0000",
        "#de0000",
        "#de0000",
        "#13c100",
        "#13c100",
        "#13c100",
        "#13c100",
    ]




    let sqlite3 = require('sqlite3').verbose();
    let Discord = require('discord.js')
    let db = new sqlite3.Database('./data/players.db')

    async function get_info(){
        return new Promise((on_success, on_reject) =>{
            db.all('SELECT * FROM players WHERE overall_league IS NOT NULL ORDER BY overall_BR DESC LIMIT 10', [], (err, rows) => {
                // console.log(row.discord_id)
                on_success(rows)
                // on_success([row.current_origin_name, row.country_emoji])
            })
        })

    }
    let my_embeds = []
    let players = await get_info()
    db.close()
    // console.log(players)
    let c = 1
    let get_pfp = require('./origin/get_origin_pfp_from_origin_id')
    for(let player of players) {
        // console.log(c)
        let embed = new Discord.MessageEmbed().setColor(colors[c])
        let name = player.current_origin_name || player.spreadsheet_name
        let title = `${c}. ${name} ${player.country_emoji}`
        // console.log(player)
        // console.log(title)
        embed.setTitle(title)
        let pfp = await get_pfp(config, player.origin_id)
        embed.setThumbnail(pfp)
        // try{
        //     let user = await client.users.fetch(player.discord_id)
        //     embed.setThumbnail(user.avatarURL())
        // }catch{}

        // console.log(user)
        // console.log(user.avatarURL())
        // embed.setThumbnail(`https://cdn.discordapp.com/avatars/${user.avatar}.png?size=256`)
        embed.addFields(
            {
                name: "League",
                value: player.drop_zone_league,
                inline: true
            },
            {
                name: "Matches Played",
                value: player.drop_zone_played.toString(),
                inline: true
            },
            {
                name: "Brogliee Rating",
                value: player.drop_zone_BR.toString(),
                inline: true
            },
            {
                name: "Wins",
                value: player.drop_zone_won.toString(),
                inline: true
            },
            {
                name: "Losses",
                value: player.drop_zone_lost.toString(),
                inline: true
            },
            {
                name: "Draws",
                value: player.drop_zone_tied.toString(),
                inline: true
            },
        )
        my_embeds.push(embed)
        c++
    }




    let channel = client.channels.cache.get(config.top_10_players_channel)

    // console.log(channel)
    channel.messages.fetch().then( async(messages) => {
        // console.log(messages)
        if(messages.size === 0){
            // await channel.send({content: `Last Updated: <t:${Math.floor(new Date()/1000)}:R>`, embeds: [embed_1, embed_2n3, embed_4_thru_6, embed_7_thru_10]})
            await channel.send({content: `Last Updated: <t:${Math.floor(new Date()/1000)}:R>`, embeds: [...my_embeds]})
        }else{
            // await messages.first().edit({content: `Last Updated: <t:${Math.floor(new Date()/1000)}:R>`, embeds: [embed_1, embed_2n3, embed_4_thru_6, embed_7_thru_10]})
            await messages.first().edit({content: `Last Updated: <t:${Math.floor(new Date()/1000)}:R>`, embeds: [...my_embeds]})
        }
    })

    // let leader_board = await client.channels.cache.get(config.leader_board_channel).send({embeds: [KYBER_embed, DIAMOND_embed, GOLD_embed, SILVER_embed, BRONZE_embed]})
    // console.log(leader_board.id)
}