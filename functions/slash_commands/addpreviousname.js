module.exports = async (interaction, params, config) => {
    let allowedIds = ["746258107046559847", "366551487775506444"]
    if(!allowedIds.includes(interaction.user.id)){
        await interaction.reply({content: `You do not have permission to use this command!`, ephemeral: true})
        return
    }
    let id = interaction.options.get('origin_id').value
    let previousName = interaction.options.get('name').value

    let previousNamesList = require('./../../data/BFPlayerList.json')
    previousNamesList[id].push(previousName)
    let previousNames = previousNamesList[id]
    if(!previousNames) previousNamesList[id] = [];

    let fs = require('fs')

    fs.writeFileSync("./data/BFPlayerList.json", JSON.stringify(previousNamesList, null, 2))


    let get_name = require('./../origin/get_origin_name_from_id')
    let get_pfp = require('./../origin/get_origin_pfp_from_origin_id')

    let name = await get_name(config, id)
    if(name === undefined){
        await interaction.reply({content: `There is no user with the Origin ID \`${id}\`!`, ephemeral: true})
        return
    }

    let pfp = await get_pfp(config, id)
    let {MessageEmbed} = require('discord.js')
    let embed = new MessageEmbed()
    embed.setColor(config.color)
    embed.setTitle(`Player: ${name}`)
    embed.addField("Current Name", `\`${name}\``, true)
    embed.addField("Origin ID", `\`${id.toString()}\``, true)
    embed.addField("Previous Names", `\`${previousNames.join("\`, \`")}\``, false)

    embed.setThumbnail(pfp)
    await interaction.reply({embeds:[embed]})


}