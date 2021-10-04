module.exports = async (interaction, params, config) => {
    let mode = interaction.options?.get('mode')?.value
    let lobby_size = interaction.options?.get('lobby')?.value || ''
    // console.log(mode)
    // console.log(lobby_size)
    let check_user = require('./../check_user')
    if(await check_user(interaction, interaction.user.id)){
        return
    }
    if(lobby_size.length > 0){
        lobby_size = lobby_size + " "
    }
    let game_mode = 'Drop Zone'
    if (mode === "droid_run"){
        game_mode = "Droid Run"
    }
    if (mode === "cargo"){
        game_mode = "Cargo"
    }
    let Discord = require('discord.js')
    let embed = new Discord.MessageEmbed().setColor("#6d5f04")


    embed.setTitle(`${lobby_size}Ranked ${game_mode} PUG`)

    let sqlite3 = require('sqlite3').verbose()
    let db = new sqlite3.Database('./data/players.db')

    async function get_user(user_discord_id){
        return new Promise((on_success, on_reject) => {
            db.get('SELECT * FROM players WHERE discord_id=?', [user_discord_id], (err, row) => {
                on_success(row)
            })
        })
    }

    let player = await get_user(interaction.user.id)
    db.close()
    // console.log(player)
    embed.addField(`Team 1 [${player[mode+"_BR"]}]`, `${player.country_emoji} ${player.current_origin_name} [${player[mode+"_BR"]}]`, true)
    embed.addField(`Team 2 [0]`, config.invis_char, true)
    embed.setAuthor(config.bot_name, config.bot_icon_url)
    // let fields_function = require('./../fields/pug')
    // await fields_function(interaction, embed, config, game_mode)
    let components_function = require('./../components/pug')
    let components = await components_function(player, interaction.client)

    const old_thread = interaction.channel.threads.cache.find(x => x.name === 'Ranked PUG');
    if(old_thread) {
        await old_thread.delete();
    }

    const thread = await interaction.channel.threads.create({
        name: 'Ranked PUG',
        autoArchiveDuration: 1440,
        // type: 'private_thread',

        reason: 'Join a PUG',
    });
    await thread.members.add(interaction.user.id)
    // console.log(`Created thread: ${thread.name}`)
    await thread.send({embeds: [embed], components: components})
    interaction.reply({content: "Thread for Ranked PUG created!", ephemeral: true})
    // interaction.reply({embeds: [embed], components: components})
}
