module.exports = async (interaction, params, config) => {
    // console.log(interaction.values, params)


    let sqlite3 = require('sqlite3').verbose();

    let db = new sqlite3.Database('./data/players.db')
    let discord_id = interaction.values[0]

    async function get_info(discord_id){
        return new Promise((on_success, on_reject) =>{
            db.get('SELECT country_emoji, current_origin_name FROM players WHERE discord_id=?', [discord_id], (err, row) => {
                // console.log(row.discord_id)
                on_success([row.current_origin_name, row.country_emoji])
            })
        })

    }
    let [current_origin_name, country_emoji] = await get_info(discord_id)
    if(params[0] === '1'){
        interaction.message.embeds[2].fields[0].value = `${country_emoji} ${current_origin_name}`
        // interaction.message.embeds[2].fields[2].value = `<@${discord_id}>`
    }else{
        interaction.message.embeds[2].fields[1].value = `${country_emoji} ${current_origin_name}`
        // interaction.message.embeds[2].fields[5].value = `<@${discord_id}>`
    }


    interaction.update({embeds: interaction.message.embeds, components: interaction.message.components})

}