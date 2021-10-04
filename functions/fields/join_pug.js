module.exports = async (interaction, embed, config, params, max_lobby_size, mode) => {

    let team1 = interaction?.message?.embeds?.[0]?.fields?.[0]?.value?.replace(/\[\d+]|[^A-Za-z_\-0-9(\n)]/g, '').split('\n') || []
    let team2 = interaction?.message?.embeds?.[0]?.fields?.[1]?.value?.replace(/\[\d+]|[^A-Za-z_\-0-9(\n)]/g, '').split('\n') || []

    let get_user = require('../sql/get_user_from_discord_id')
    let user = await get_user(interaction.user.id)

    let users = [...team1, ...team2]
    // let other_players = [
    //     "-veN-purpoz",
    //     "-NTR-Sierra",
    //     "NSG-Shrowdy",
    //     "Cov1dPlagueDoc",
    //     "NTR-Starlita",
    //     "NotRodzyne",
    //     "TTG_Rowdy"
    // ]
    // users = [...users, ...other_players]

    users = users.filter((u) => u !== "")
    // console.log('users', users)
    if(users.length === max_lobby_size){
        interaction.reply({content: "This PUG is full!", ephemeral: true})
        return
    }
    if(params.includes('join')) {
        if (users.includes(user.current_origin_name)) {
            interaction.reply({content: "You are already in this PUG!", ephemeral: true})
            return
        } else {
            users.push(user.current_origin_name)
        }
    }
    else if(params.includes('leave')) {
        // console.log({users, user})
        if (!users.includes(user.current_origin_name)) {
            interaction.reply({content: "You aren't even in this PUG!", ephemeral: true})
            return
        } else {
            users = users.filter(e => e !== user.current_origin_name)
        }
    }
    else if(params.includes('remove')) {
        interaction.values.forEach(v => {
            users = users.filter(e => e !== v)
        })
    }


    let get_balanced_teams_from_ids = require('./../balance_teams.js')
    // console.log({users})
    let [balanced_teams, players] = await get_balanced_teams_from_ids(users, config, interaction, mode)
    // console.log({balanced_teams})
    let team1_description = ''
    let team2_description = ''



    balanced_teams.team1.forEach( (each_player) => {

        team1_description = `${team1_description}${each_player['country_emoji']} ${each_player['current_origin_name']} [${each_player[`${mode}_BR`]}]\n`
    })
    balanced_teams.team2.forEach( (each_player) => {
        team2_description = `${team2_description}${each_player['country_emoji']} ${each_player['current_origin_name']} [${each_player[`${mode}_BR`]}]\n`
    })
    if(team1_description === ''){
        team1_description = config.invis_char
    }
    if(team2_description === ''){
        team2_description = config.invis_char
    }

    // console.log(team1_description)
    // console.log(team2_description)
    // embed.setTitle("Starting Ranked PUG")
    embed.fields[0]= {name: `Team 1 [${balanced_teams.team1_BR}]`, value: team1_description, inline: true }
    // embed.addField(config.invis_char, config.invis_char, true)
    embed.fields[1]= {name: `Team 2 [${balanced_teams.team2_BR}]`, value: team2_description, inline: true }
    return [users.length, [...balanced_teams['team1'], ...balanced_teams['team2']], players]
}