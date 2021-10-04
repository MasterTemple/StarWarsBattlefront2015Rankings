module.exports = async (interaction, params, config) => {
    let name = interaction.options.get('name').value
    let get_id = require('./../origin/get_origin_id_and_name_from_name')
    let get_pfp = require('./../origin/get_origin_pfp_from_origin_id')
    let [id, name_with_case] = await get_id(config, name)
    if(id === undefined || id == 0){
        await interaction.reply({content: `There is no user with the name \`${name}\`!`, ephemeral: true})
        return
    }
    let pfp = await get_pfp(config, id)
    let {MessageEmbed} = require('discord.js')
    let embed = new MessageEmbed()
    embed.setColor(config.color)
    embed.setTitle(`Player: ${name_with_case}`)
    embed.addField("Current Name", `\`${name_with_case}\``, true)
    embed.addField("Origin ID", `\`${id.toString()}\``, true)
    embed.setThumbnail(pfp)
    await interaction.reply({embeds:[embed]})
}