module.exports = async (interaction, params, config) => {
    let team_size = interaction?.message?.embeds?.[0]?.fields?.[0]?.value?.replace(/\[\d+]|[^A-Za-z_\-0-9(\n)]/g, '').split('\n').length
    interaction.message.embeds[0].setTitle(`${team_size}v${team_size} ${interaction.message.embeds[0].title}`)
    interaction.update( {embeds: interaction.message.embeds,
        components: [{
            "type": 1,
            "components": [
                {
                    "type": 2,
                    "label": "Join PUG",
                    "style": 3,
                    "custom_id": "join_pug[join]",
                    "disabled": true
                },
                {
                    "type": 2,
                    "label": "Leave PUG",
                    "style": 4,
                    "custom_id": "join_pug[leave]",
                    "disabled": true
                },
                {
                    "type": 2,
                    "label": "Start PUG",
                    "style": 1,
                    "custom_id": "start_pug",
                    "disabled": true
                }
            ]
        }]
    })
}