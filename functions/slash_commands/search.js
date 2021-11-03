module.exports = async (interaction, params, config) => {
  let id = interaction.options.get('name').value
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
  embed.setThumbnail(pfp)

  let previousNamesList = require('./../../data/BFPlayerList.json')
  let previousNames = previousNamesList[id.toString()]
  if(previousNames){
      embed.addField("Previous Names", `\`${previousNames.join("\`, \`")}\``, false)
  }

  if(!previousNames?.includes(name)){
      if(!previousNames) previousNamesList[id.toString()] = [];
      previousNamesList[id.toString()].push(name)
      let fs = require('fs')
      fs.writeFileSync("./data/BFPlayerList.json", JSON.stringify(previousNamesList, null, 2))
  }

  await interaction.reply({embeds:[embed]})
}