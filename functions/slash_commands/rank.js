module.exports = async (interaction, params, config) => {
    let user = interaction.options.get('player')?.value || interaction.user.id
    let get_user = require('./../sql/get_user_from_discord_id')
    let player = await get_user(user)
    // let discord_user = await interaction.client.users.fetch(user) || interaction.user
    // console.log(discord_user)
    // console.log(player)
    // let [id, name_with_case] = await get_id(config, name)
    // if(id === undefined){
    //     await interaction.reply({content: `There is no user with the name \`${name}\`!`, ephemeral: true})
    // }
    // let pfp = await get_pfp(config, id)
    let colors = {
        "BRONZE": "#a84300",
        "SILVER": "#95a5a6",
        "GOLD": "#f1c40f",
        "DIAMOND": "#9b59b6",
        "KYBER": "#1abc9c",
        "S3: Unranked": "#",
    }
    let {MessageEmbed} = require('discord.js')
    let embed = new MessageEmbed()
    try{

        embed.setColor(colors[player.overall_league])

    // embed.setColor(config.color)
    // embed.addField("Current Name", `\`${name_with_case}\``, true)
    // embed.addField("Origin ID", `\`${id.toString()}\``, true)
    // embed.setThumbnail(pfp)

        if(player.overall_ranking) {
            embed.setTitle(`#${player.overall_ranking}. ${player.current_origin_name}`)
        }else{
            embed.setTitle(player.current_origin_name)

        }
        let get_pfp = require('./../origin/get_origin_pfp_from_origin_id')
        let pfp = await get_pfp(config, player.origin_id)
        embed.setThumbnail(pfp)
        embed.addField("Games Played", player?.drop_zone_played.toString(), true)
        embed.addField("BR", player?.drop_zone_BR.toString(), true)
        embed.addField("League", player?.drop_zone_league, true)
        embed.addField("Wins", player?.drop_zone_won.toString(), true)
        embed.addField("Losses", player?.drop_zone_lost.toString(), true)
        embed.addField("Draws", player?.drop_zone_tied.toString(), true)
        embed.addField("Country", `${player?.country_emoji} ${player?.country}`, true)
        embed.addField("Team", (player?.team || "No team"), true)
        embed.addField("Origin ID", player?.origin_id.toString(), true)
        await interaction.reply({embeds: [embed]})
    }catch{
        await interaction.reply({content:"The user selected is unranked for this season.", ephemeral:true})
    }
}