module.exports = async (interaction, params, config) => {
    let Discord = require('discord.js')
    let embed = new Discord.MessageEmbed().setTitle("Please Verify The Following Information Is Correct").setColor("#3BA55D")
    let outcome_description
    // console.log(interaction.message.embeds[0])
    if(interaction.message.embeds[0].author === null){
        interaction.reply({content: "**You have not chosen an outcome for this match!** [Win / Loss / Draw]", ephemeral: true})
        return
    }
    if(interaction.message.embeds[0].author.name === 'Win'){
        outcome_description = '🟦 **Team 1  beat  🟥 Team 2**'
    }else if(interaction.message.embeds[0].author.name === 'Loss'){
        outcome_description = '🟥 **Team 2  beat  🟦 Team 1**'
    }else if(interaction.message.embeds[0].author.name === 'Draw'){
        outcome_description = '🟦 **Team 1  tied  🟥 Team 2**'
    }else{
        interaction.reply({content: "**You have not chosen an outcome for this match!** [Win / Loss / Draw]", ephemeral: true})
        return
    }

    embed.fields[0] = {name: "Outcome:", value: outcome_description, inline: false}
    embed.fields[1] = {name: config.invis_char, value: "🟨 **With the following Partner Compensations:**", inline: false}
    embed.fields[2] = interaction.message.embeds[2].fields[0]
    embed.fields[3] = interaction.message.embeds[2].fields[1]

    let components = [
        {
            "type": 1,
            "components": [
                {
                    "type": 2,
                    "label": "Confirm Submission",
                    "style": 3,
                    "custom_id": `confirm_submission[${interaction.message.id}]`
                },
            ]
        }
    ]

    interaction.reply({embeds: [embed], components: components, ephemeral: true})

}