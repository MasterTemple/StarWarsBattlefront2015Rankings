module.exports = async (interaction, params, config) => {
    let {MessageEmbed} = require('discord.js')
    // let embed = new MessageEmbed().setColor(config.color).setTitle("Click Me!").setURL(config.invite_url)
    let embed = new MessageEmbed().setColor(config.color).setTitle(`Invite ${interaction.client.user.username} to your server!`)//.setDescription("")
    let components = [
        {
            "type": 1,
            "components": [
                {
                    "type": 2,
                    "label": "Invite",
                    "style": 5,
                    "url": "https://discord.com/api/oauth2/authorize?client_id=863164170227810325&permissions=2147601408&scope=bot+applications.commands",
                    // "custom_id": "invite"
                }
            ]

        }
    ]
    interaction.reply({embeds: [embed], components: components})
}