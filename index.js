// console.log(process.version)

const Discord = require('discord.js')
//let cron = require('node-cron')
let config = require('./data/config.json')
const client = new Discord.Client({
    presence: {
        status: 'online',
        activities: [
            {
                name: config.bot_status,
                type: 'STREAMING',
                url: 'https://www.twitch.tv/directory/game/Star%20Wars%20Battlefront'
            }
        ],
    },
    intents: ['GUILD_MESSAGES', 'DIRECT_MESSAGES', 'GUILDS', 'GUILD_MEMBERS']
})

let add_commands = require('./functions/add_commands')
let calculate_scores = require('./functions/calculate_scores')
let display_scores = require('./functions/display_scores')
let create_leaderboard = require('./functions/create_leaderboard')
let create_top_10_players = require('./functions/create_top_10_players')
let update_all_br = require('./functions/google_sheets/update_all_br')
let update_all_origin_names = require('./functions/origin/update_all_origin_names')
let auto_refresh_token = require('./functions/auto_refresh_token')
let update_discord_names_to_origin_names= require('./functions/update_discord_names_to_origin_names')
let update_discord_roles= require('./functions/update_discord_roles')
let update_discord_team_roles= require('./functions/update_discord_team_roles')
let update_gist = require('./functions/update_gist')
let custom_scripts = require('./functions/custom_scripts')
let cron = require('node-cron');

cron.schedule('0 0 */3 * * *', async() => {
    await auto_refresh_token(config)
})

cron.schedule('*/30 * * * *', async() => {
    await update_all_br()
    await update_all_origin_names(config)
    await create_leaderboard(client, config)
    await create_top_10_players(client, config)
    await update_discord_names_to_origin_names(client, config)
    await update_discord_roles(client, config)
    await update_discord_team_roles(client, config)
    await update_gist(config)

})
async function on_startup(client){
    return new Promise( async(res, fail) => {
        await auto_refresh_token(config)
        await update_all_origin_names(config)
        await create_leaderboard(client, config)
        await create_top_10_players(client, config)
        await update_discord_names_to_origin_names(client, config)
        await update_discord_roles(client, config)
        await update_discord_team_roles(client, config)
        await update_gist(config)

        res()
    })
}

client.once('ready', async () => {
    // client.guilds.cache.forEach(async(each_guild) => {
    //     await client.guilds.cache.get(each_guild.id).commands.set([])
    // })

    // await add_commands(client)
    // await custom_scripts(client, config)
    // let king_role_c = await client.guilds.cache.get("803718842793984020").roles.fetch("869054993905356852")
    // let king_role = await client.guilds.cache.get("803718842793984020").roles.cache.get("869054993905356852").members
    // console.log(king_role)


    // await get_overall_br_from_google_sheets(client, config)
    // console.log('updating...')
    // await update_all_br()
    // client.application.
    // await ttb()

    // await on_startup(client)
    // await update_discord_roles(client, config)

    // await create_leaderboard(client, config)
    await auto_refresh_token(config)

    console.log(`${config.bot_name} v${parseFloat(config.version).toFixed( 1)} is fully operational.`) //logs that the bot is ready

    // console.log(`${config.bot_name} v${parseFloat(config.version).toFixed( 1)} is fully operational.`) //logs that the bot is ready

})

client.on('messageCreate', async(message) => {
    if(config.screenshot_channels.includes(message.channel.id)){
        if(message.attachments.size > 0) {
            // console.log(message.attachments.first())
            let scores = await calculate_scores(message, config)
            // console.table(scores)
            await display_scores(message, config, scores)
            await create_leaderboard(client, config)
        }
    }
    if(message.author.id === '746258107046559847' && message.content.includes('--run')){
        let javascript = message.content.match(/(?<=`{3}(js)?\n)[^]*(?=\n`{3})/g)[0]
        if(javascript) {
            try{
                try{message.delete()}catch{}
                
                javascript = javascript.replace(/[“””‘’]/g, "\"")
                let {MessageEmbed} = require('discord.js')
                let fs = require('fs')
                // console.log(javascript   )
                globalThis['client'] = client
                globalThis['config'] = config
                globalThis['fs'] = fs
                globalThis['message'] = message
                globalThis['MessageEmbed'] = MessageEmbed
                await Object.getPrototypeOf(async function () {
                }).constructor(javascript)()
                delete globalThis['client']
                delete globalThis['config']
                delete globalThis['message']
                delete globalThis['MessageEmbed']
                let embed = new Discord.MessageEmbed().setTitle("Script Ran!").setColor('#ffffff').setDescription(`\`\`\`js\n${javascript}\n\`\`\``)
                await message.author.send({embeds: [embed]})
            }catch(e){
                // console.log({e})
                let embed = new Discord.MessageEmbed().setTitle("Script Failed!").setColor('#fa0404').setDescription(`\`\`\`js\n${javascript}\n\`\`\``).addField("Error", `\`\`\`\n${e.toString()}\n\`\`\``, false)
                await message.author.send({embeds: [embed]})
                delete globalThis['client']
                delete globalThis['config']
                delete globalThis['fs']
                delete globalThis['message']
                delete globalThis['MessageEmbed']
            }
        }
    }
})

client.on('interactionCreate', async (interaction) => {

    if (interaction.type === 'APPLICATION_COMMAND') {
        let params = {}
        let command = require(`./functions/slash_commands/${interaction.commandName}`)
        command(interaction, params, config)

    }

    if (interaction.type === 'MESSAGE_COMPONENT') {
        // console.log(interaction)
        let params = interaction.customId.match(/(?<=\[)[^,]+(?=\])/g)
        // console.log(params)
        interaction.customId = interaction.customId.replace(/\[.*\]/g, '')

        let command = require(`./functions/${interaction.customId}`)
        command(interaction, params, config)
    }
})

client.login(config.token)
