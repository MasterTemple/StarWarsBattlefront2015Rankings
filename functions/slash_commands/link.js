module.exports = async (interaction, params, config) => {

    let battlefront_name = interaction.options.get('battlefront_name').value
    let spread_sheet_name = interaction.options.get('spreadsheet_name').value

    let get_origin_id_from_name = require('../origin/get_origin_id_from_name')

    let origin_id = await get_origin_id_from_name(config, battlefront_name)
    let get_origin_pfp_from_origin_id = require('../origin/get_origin_pfp_from_origin_id')
    let pfp = await get_origin_pfp_from_origin_id(config, origin_id)
    let sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('./data/players.db')



    async function check_availability_of_sheet_name(){
        return new Promise((on_success, on_reject) => {
            db.get('SELECT discord_id FROM players WHERE spreadsheet_name=?', [spread_sheet_name], (err, row) => {
                // on_success(row?.discord_id)
                let name_is_valid = false
                if(row !== undefined){
                    name_is_valid = true
                }
                on_success([row?.discord_id, name_is_valid])
            })
        })
    }
    async function check_if_already_has_account(user_discord_id){
        return new Promise((on_success, on_reject) => {
            db.get('SELECT discord_id FROM players WHERE discord_id=?', [user_discord_id], (err, row) => {
                on_success(row)
            })
        })
    }

    async function check_availability_of_battlefront_name(){
        return new Promise((on_success, on_reject) => {
            db.get('SELECT discord_id FROM players WHERE current_origin_name=?', [battlefront_name], (err, row) => {
                on_success(row?.discord_id)

            })
        })
    }

    async function update_info_if_existing(userId, eaId, discord_id, sheet_name){
        return new Promise((on_success, on_reject) =>{
            let query = `UPDATE players SET current_origin_name="${eaId}", origin_id=${userId}, discord_id="${discord_id}" WHERE spreadsheet_name=?`
            db.run(query, [sheet_name],  function(err) {
                on_success()
            })
        })
    }
    let origin_name_is_valid = false
    if(origin_id){
        origin_name_is_valid = true
    }

    let Discord = require('discord.js')
    let title = "Account Link Failure!"
    let embed = new Discord.MessageEmbed().setColor("#6d5f04").setTitle(title)

    let already_has_account = await check_if_already_has_account(interaction.user.id)
    if(already_has_account){
        embed.setTitle("Your account is already linked!")
        interaction.reply({embeds: [embed]})
        return
    }
    let current_user_of_battlefront_name = await check_availability_of_battlefront_name()

    let [current_user_of_sheet_name, sheet_name_is_valid] = await check_availability_of_sheet_name()

    let bf_name_valid = '**invalid**'
    let bf_name_taken = ''
    if(origin_id){
        bf_name_valid = '**valid**'
    }
    if(current_user_of_battlefront_name){
        bf_name_taken = ` but is already registered by <@${current_user_of_battlefront_name}>`
    }
    let sheet_name_valid = '**invalid**'
    let sheet_name_taken = ''
    if(sheet_name_is_valid){
        sheet_name_valid = '**valid**'
    }
    if(current_user_of_sheet_name){
        sheet_name_taken = ` but is already registered by <@${current_user_of_sheet_name}>`
    }
    let get_registered_string = ''
    if(sheet_name_is_valid === false || current_user_of_battlefront_name === undefined){
        get_registered_string = `\n**NOTE:**\nIf you are new to Ranked PUGs, please use the \`/register\` command. If you are a returning Ranked PUG played, please double check the name you are registered as on the spreadsheet.`
    }
    if(!origin_id || !pfp || !sheet_name_is_valid || current_user_of_battlefront_name || current_user_of_sheet_name) {
        let desc = `**1.** The Battlefront Name \`${battlefront_name}\` is ${bf_name_valid}${bf_name_taken}.\n**2.** The Spreadsheet Name \`${spread_sheet_name}\` is ${sheet_name_valid}${sheet_name_taken}.${get_registered_string}`
        embed.setDescription(desc)
        await interaction.reply({embeds: [embed], ephemeral: true})
        return
    }

    await update_info_if_existing(origin_id, battlefront_name, interaction.user.id, spread_sheet_name)

    title = "Account Successfully Linked!"
    embed.setTitle(title)
    embed.setThumbnail(pfp)
    embed.addField("Battlefront Name", battlefront_name, true)
    embed.addField("Origin ID", origin_id, true)
    embed.addField("Spreadsheet Name", spread_sheet_name, true)

    await interaction.reply({embeds:[embed], ephemeral: false})

}