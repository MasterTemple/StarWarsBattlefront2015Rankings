module.exports = async (interaction, params, config) => {

    let king = interaction.options.get('king')?.value
    let roles = interaction.guild.members.cache.get(interaction.user.id)._roles
    let king_role = "869054993905356852"
    let ranked_supervisor_role = "804020705548566528"

    if(!roles.includes(ranked_supervisor_role) && !roles.includes(king_role)){
        interaction.reply({content: "You are not allowed to use this command.", ephemeral: true})
    }else{
        let new_king = await interaction.guild.members.cache.get(king)
        await new_king.roles.add(king_role)
        let {MessageEmbed} = require('discord.js')
        let embed = new MessageEmbed().setColor(config.color)
        embed.setTitle('👑 New 1v1 King 👑')
        // console.log(new_king)
        let url = `https://cdn.discordapp.com/avatars/${new_king.user.id}/${new_king.user.avatar}.webp`
        // console.log(url)
        embed.setThumbnail(url)
        let old_king_id = config.king_id

        embed.setDescription(`<@${king}> has taken <@${old_king_id}>'s throne!`)
        interaction.reply({embeds: [embed], ephemeral: false})

        let fs = require('fs')
        let old_king = await interaction.guild.members.fetch(old_king_id)
        await old_king.roles.remove(king_role)

        config.king_id = king
        fs.writeFileSync('./data/config.json', JSON.stringify(config, null, 2))
        // await member.roles.remove(each_role)

    }
    // console.log(roles)

}