module.exports = async (client, config) => {
    return new Promise( async(fully_done, failed) => {
        // let champRoleId = '806196589461897243'
        // let members = await client.guilds.cache.get("803718842793984020").members.fetch()
        // for(let [id, each_member] of members) {            
        //     if(each_member._roles.includes(champRoleId)){
        //         await each_member.roles.remove(champRoleId)
        //     }
        // }
        // let chan = await client.channels.cache.get("805780298443784202")
        // let {MessageEmbed} = require("discord.js")
        // let embed = new MessageEmbed().setTitle("Registration Process").setColor(config.color).setThumbnail(config.bot_icon_url)
        // embed.addField("`/register` or `/link`", "When someone **is** on the spreadsheet, use `/link`. If they are **not** on the spreadsheet use `/register`\n**PLEASE NOTE YOUR SPREADSHEET NAME IS CASE SENSITIVE**", false)
        // embed.addField("`/register`", "**Usage:**\n`/register <your battlefront name> <your spreadsheet name> <your country>`\n**Example:**\n`/register Inchawea_2 Inchawea South America`", false)
        // embed.addField("`/link`", "**Usage:**\n`/link <your battlefront name> <your spreadsheet name>`\n**Example:**\n`/link Inchawea_2 Inchawea`", false)
        // embed.addField("HOWEVER", "`/register` DOES NOT add someone to the spreadsheet cause i couldnt get that to work and im done spending time on it. so a ranked supervisor will have to add you manually, which in that case `/register` is pointless and you should just have the supervisor add you to the spreadsheet, and once they do that, you (the player) will use `/link`", false)
        // let msg = await chan.send({embeds: [embed]})
        // await msg.pin()
        // fully_done()
        // let role = await client.guilds.cache.get('803718842793984020').roles.fetch('861678603166548018')
        // await role.edit({color: '#ff8c00'})
        // client.guilds.cache.get('803718842793984020').emojis.cache.get('866018407756464148').setName("jedi")
        // await get_overall_br_from_google_sheets(client, config)
        // let update_all_origin_names = require('./functions/update_all_origin_names')
        // await update_all_origin_names(config)
        // let roles_to_add = [
        //     "noLimit",
        //     "Sentinels",
        //     "Power RanGers",
        //     "NSG",
        //     "Jedi Fire",
        //     "Vice Tigers",
        //     "Ventum X",
        //     "Ventum Zeta",
        //     "Raid",
        //     "Kopter",
        //     "NTR",
        //     "NEO",
        //     "Ventum",
        //     "Fallen Order",
        //     "Qi",
        //     "TTG",
        //     "ArG",
        //     "Order 66",
        //     "Jedi",
        //     "VG",
        // ]
        // let roles = {}
        // for(let role of roles_to_add){
        //     // client.guilds.cache.get('803718842793984020')
        //     let created_role = await client.guilds.cache.get('803718842793984020').roles.create({
        //         // data:{
        //         //     name: 'test_team_role',
        //         //     // color: ,
        //         // },
        //         name: role,
        //         permissions: [],
        //         reason: `Adding a role for ${role}`
        //     })
        //     let role_id = created_role.id
        //     roles[role] = role_id
        // }
        // let fs = require('fs')
        // // console.log(roles)
        // fs.writeFileSync('./team_roles.json', JSON.stringify(roles, null, 2))
        // console.log(created_role)
        // await created_role.setPermissions([])
        // let msg = await client.guilds.cache.get('803718842793984020').channels.cache.get('803718842793984023').messages.fetch("869044205564084286")
        // await msg.pin()
        // console.log(msg)
        fully_done()
    })
}