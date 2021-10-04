module.exports = async (client, config) => {
    return new Promise( async(fully_done, failed) => {
        let members = await client.guilds.cache.get('803718842793984020').members
        let get_user_from_discord_id = require('./sql/get_user_from_discord_id')

        let sqlite3 = require('sqlite3').verbose();
        let db = new sqlite3.Database('./data/players.db')

        async function get_info() {
            return new Promise((on_success, on_reject) => {
                db.all('SELECT discord_id, overall_league, spreadsheet_name FROM players WHERE discord_id IS NOT NULL AND overall_league IS NOT NULL ORDER BY overall_BR DESC', [], (err, rows) => {
                    on_success(rows)
                })
            })
        }

        /*
        check if user has the role, if they do continue
        if they dont, remove all season 3 roles, => add current role
         */
        let season_3_roles = {
            KYBER: "864315424052871218",
            DIAMOND: "864315560024211486",
            GOLD: "864315614537711636",
            SILVER: "864315731055476778",
            BRONZE: "864315782388383785",
            champion_role: "806196589461897243"
        }
        let champion_role = '806196589461897243'
        let s3_role_list = Object.values(season_3_roles)

        let players = await get_info()
        // console.log(players[0])
        // fully_done()

        for (let player of players){
            try{
                let member = await members.fetch(player.discord_id)
                let roles = member._roles
                let ranking_role = season_3_roles[player.overall_league]

                if(roles.every(r => r !== ranking_role)){
                    // console.log(`${player.spreadsheet_name} doesnt have ${ranking_role}`)

                    // if(roles.every(r => !s3_role_list.includes(r))){
                //     console.log(player.spreadsheet_name)
                    // console.log('doesnt have role')
                    // console.log(roles)
                    // let new_roles = roles.filter(r => !s3_role_list.includes(r))
                    for(let each_role of roles){
                        if(s3_role_list.includes(each_role)){
                            await member.roles.remove(each_role)
                        }
                    }
                    // new_roles.push(ranking_role)
                    // console.log(new_roles)
                    await member.roles.add(ranking_role)

                }else{
                    // console.log(`${player.spreadsheet_name} has ${ranking_role}`)

                    //console.log('has role')
                }

            }catch{
                console.log(`The member ${player.spreadsheet_name} is not in Ranked PUGs 2021`)
            }
        }
        try{
            let champRoleId = '806196589461897243'
            let members = await client.guilds.cache.get("803718842793984020").members.fetch()
            for(let [id, each_member] of members) {            
                if(each_member._roles.includes(champRoleId)){
                    await each_member.roles.remove(champRoleId)
                }
                if(id === players[0].discord_id){
                    await each_member.roles.add(champion_role)

                }
            }
            // let champion = await members.fetch(players[0].discord_id)
            // champion.roles.add(champion_role)
        }catch(e){
            console.log(e)
            console.log(players[0])
        }

        fully_done()
    })
}
