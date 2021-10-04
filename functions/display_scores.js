module.exports = async (message, config, scores) => {
    let Discord = require('discord.js')

    let sqlite3 = require('sqlite3').verbose();

    let db = new sqlite3.Database('./data/players.db')

    async function get_discord_id(name){
        return new Promise((on_success, on_reject) =>{
            db.get('SELECT discord_id, country_emoji FROM players WHERE current_origin_name=?', [name], (err, row) => {
                // console.log(row.discord_id)
                on_success([row.discord_id, row.country_emoji])
            })
        })
    }

    async function get_origin_names(){
        return new Promise(async (on_success, on_reject) =>{

            let query = `SELECT current_origin_name FROM players WHERE current_origin_name IS NOT NULL`
            db.all(query, [], (err, rows) => {

                // let matches = rows.every(row => {
                //
                // })
                // console.log(rows)
                on_success(rows)

            })
        })
    }

    let origin_names = await get_origin_names()
    scores.team_1_igns = []
    scores.team_1_discord_ids = []
    scores.team_1_emoji_ids = []

    scores.team_2_igns = []
    scores.team_2_discord_ids = []
    scores.team_2_emoji_ids = []
    scores.team_1_names.forEach((team_name) => {
        let re = new RegExp(team_name.replace(/[\.\-_O01lI ]/g, '.?'))

        dance:
            for(let i in origin_names) {
                let each_name = origin_names[i]
                // console.log(each_name)
                // console.log(each_name.current_origin_name.match(re))
                if(each_name.current_origin_name.match(re)){
                    // console.log('matched', each_name.current_origin_name)
                    scores.team_1_igns.push(each_name.current_origin_name)
                    break dance
                }
            }

    })
    scores.team_2_names.forEach((team_name) => {
        let re = new RegExp(team_name.replace(/[\.\-_O01lI ]/g, '.?'))

        dance:
            for(let i in origin_names) {
                let each_name = origin_names[i]
                // console.log(each_name)
                // console.log(each_name.current_origin_name.match(re))
                if(each_name.current_origin_name.match(re)){
                    // console.log('matched', each_name.current_origin_name)
                    scores.team_2_igns.push(each_name.current_origin_name)
                    break dance
                }
            }

    })



    async function get_discord_ids() {
        return new Promise(async(on_succes, fail) => {
            for (let i in scores.team_1_igns) {
                let [discord_id, emoji_id] = await get_discord_id(scores.team_1_igns[i])
                scores.team_1_discord_ids.push(discord_id)
                scores.team_1_emoji_ids.push(emoji_id)
            }
            for (let i in scores.team_2_igns) {
                let [discord_id, emoji_id] = await get_discord_id(scores.team_2_igns[i])
                scores.team_2_discord_ids.push(discord_id)
                scores.team_2_emoji_ids.push(emoji_id)
            }
            // scores.team_1_igns.forEach(async (each_name) => {
            //     scores.team_1_discord_ids.push(await get_discord_id(each_name))
            // })

            // scores.team_2_igns.forEach(async (each_name) => {
            //     scores.team_2_discord_ids.push(await get_discord_id(each_name))
            // })
            on_succes()
        })
    }
    await get_discord_ids()
    console.table(scores)
    let embed_team_1 = new Discord.MessageEmbed().setTitle("Team 1").setColor("#235AE2")
    let embed_team_2 = new Discord.MessageEmbed().setTitle("Team 2").setColor("#C61212")
    let igns = ''
    let discord_names = ''
    let scores_string = ''

    let team_1_total_score = 0
    let team_2_total_score = 0
    scores.team_1_igns.forEach((ign, c) => {
        igns = `${igns}${scores.team_1_emoji_ids[c]} ${scores.team_1_igns[c]}\n`
        discord_names = `${discord_names}<@${scores.team_1_discord_ids[c]}>\n`
        scores_string = `${scores_string}${scores.team_1_scores[c]}\n`
        team_1_total_score = team_1_total_score + parseInt(scores.team_1_scores[c].replace(/,? ?/g, ''))
    })
    // embed_team_1.setTitle(`${embed_team_1.title}\t Total Score: ${team_1_total_score.toString().replace(/(?<=\d{1,2})(?=\d{3})/g, ',')}`)
    embed_team_1.setTitle(`${embed_team_1.title}\t\t\t\t Total Score: ${team_1_total_score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`)
    embed_team_1.addField("IGN", igns, true)
    embed_team_1.addField("Discord", discord_names, true)
    embed_team_1.addField("Score", scores_string, true)

    igns = ''
    discord_names = ''
    scores_string = ''

    scores.team_2_igns.forEach((ign, c) => {
        igns = `${igns}${scores.team_2_emoji_ids[c]} ${scores.team_2_igns[c]}\n`
        discord_names = `${discord_names}<@${scores.team_2_discord_ids[c]}>\n`
        scores_string = `${scores_string}${scores.team_2_scores[c]}\n`
        team_2_total_score = team_2_total_score + parseInt(scores.team_2_scores[c].replace(/,? ?/g, ''))
    })
    // embed_team_2.setTitle(`${embed_team_2.title}\t Total Score: ${team_2_total_score.toString().replace(/(?<=(\d{1}|\d{2}))(?=\d{3})/g, ',')}`)
    embed_team_2.setTitle(`${embed_team_2.title}\t\t\t\t Total Score: ${team_2_total_score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`)
    embed_team_2.addField("IGN", igns, true)
    embed_team_2.addField("Discord", discord_names, true)
    embed_team_2.addField("Score", scores_string, true)

    let partner_embed = new Discord.MessageEmbed().setColor("#ffde0f").setTitle("Partner Compensation")
    // partner_embed.addField("Team 1", config.invis_char, true)
    // partner_embed.addField("IGN", config.invis_char, true)
    // partner_embed.addField("Discord", config.invis_char, true)
    // // partner_embed.addField("Score", config.invis_char, true)
    //
    // partner_embed.addField("Team 2", config.invis_char, true)
    // partner_embed.addField("IGN", config.invis_char, true)
    // partner_embed.addField("Discord", config.invis_char, true)
    // // partner_embed.addField("Score", config.invis_char, true)
    partner_embed.addField("Team 1", config.invis_char, true)
    partner_embed.addField("Team 2", config.invis_char, true)

    let components_function = require('./components/scoreboard')
    let components = await components_function(scores, message.client)

    message.channel.send({embeds:[embed_team_1, embed_team_2, partner_embed], components: components})
}