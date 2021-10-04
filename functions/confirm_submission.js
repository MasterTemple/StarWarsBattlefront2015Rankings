module.exports = async (interaction, params, config) => {
    // let eph_embed = interaction.message.embeds[0]
    // console.log(interaction.reply)

    // console.log(params[0])
    let og_message = await interaction.channel.messages.fetch(params[0])
    // console.log(og_message)
    const random_hex = () => {
        let n = (Math.random() * 0xfffff * 1000000).toString(16);
        return n.slice(0, 8);
    };
    let match_id = `Match ID: [S3_${random_hex().toUpperCase()}]`
    await interaction.client.channels.cache.get(config.results_channel).send({content: match_id,embeds: og_message.embeds})

    //temporarily commented as i dont want to resend scoreboards over and over each time i test
    // await og_message.edit({embeds: og_message.embeds, components: []})




    //im reusing this embed code cause i cant seem to get the other embeds from the ephemeral
    let Discord = require('discord.js')
    let embed = new Discord.MessageEmbed().setTitle("Please Verify The Following Information Is Correct").setColor("#3BA55D")
    let outcome_description
    if(og_message.embeds[0].author.name === 'Win'){
        outcome_description = '🟦 **Team 1  beat  🟥 Team 2**'
    }else if(og_message.embeds[0].author.name === 'Loss'){
        outcome_description = '🟥 **Team 2  beat  🟦 Team 1**'
    }else if(og_message.embeds[0].author.name === 'Draw'){
        outcome_description = '🟦 **Team 1  tied  🟥 Team 2**'
    }

    embed.fields[0] = {name: "Outcome:", value: outcome_description, inline: false}
    embed.fields[1] = {name: config.invis_char, value: "🟨 **With the following Partner Compensations:**", inline: false}
    embed.fields[2] = og_message.embeds[2].fields[0]
    embed.fields[3] = og_message.embeds[2].fields[1]
    
    await interaction.update({embeds: [embed], components: [
            {
                "type": 1,
                "components": [
                    {
                        "type": 2,
                        "label": "Submitted",
                        "style": 3,
                        "custom_id": `confirm_submission[${interaction.message.id}]`,
                        "disabled": true
                    },
                ]
            }
        ]
    })

    let team_1_names = og_message.embeds[0].fields[0].value.replace(/[^A-Za-z_\-0-9(\n)]/g, '').split('\n')
    let team_1_scores = og_message.embeds[0].fields[2].value.replace(/[, ]/g, '').split('\n')
    let team_2_names = og_message.embeds[1].fields[0].value.replace(/[^A-Za-z_\-0-9(\n)]/g, '').split('\n')
    let team_2_scores = og_message.embeds[1].fields[2].value.replace(/[, ]/g, '').split('\n')
    

}