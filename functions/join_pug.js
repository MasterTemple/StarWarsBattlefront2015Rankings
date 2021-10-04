module.exports = async (interaction, params, config) => {
    let check_user = require('./check_user')
    if(await check_user(interaction, interaction.user.id)){
        return
    }
    let team_size = interaction.message.embeds[0].title.match(/\d(?=v)/g)?.[0] || 6
    let mode = interaction.message.embeds[0].title.match(/(?<=Ranked ).*(?= PUG)/g)?.[0] || "Drop Zone"
    let modes = {
        "Drop Zone": "drop_zone",
        "Cargo": "cargo"
    }
    mode = modes[mode]
    let max_lobby_size = team_size * 2
    // console.log('here')
    let fields_function = require('./../functions/fields/join_pug')

    let [number_of_users, teams, players] = await fields_function(interaction, interaction.message.embeds[0], config, params, max_lobby_size, mode)
    // console.log('fin')
    // console.log({number_of_users, teams})
    let components_function = require('./../functions/components/join_pug')
    let components = await components_function(number_of_users, max_lobby_size, players, interaction.client)
    interaction.update({embeds:interaction.message.embeds, components: components})

}