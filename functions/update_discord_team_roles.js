module.exports = async (client, config) => {
    return new Promise( async(fully_done, failed) => {
        let members = await client.guilds.cache.get('803718842793984020').members
        let get_user_from_discord_id = require('./sql/get_user_from_discord_id')

        let sqlite3 = require('sqlite3').verbose();
        let db = new sqlite3.Database('./data/players.db')

        async function get_info() {
            return new Promise((on_success, on_reject) => {
                db.all('SELECT discord_id, team, spreadsheet_name FROM players WHERE discord_id IS NOT NULL AND TEAM IS NOT NULL', [], (err, rows) => {
                    on_success(rows)
                })
            })
        }

        /*
        check if user has the role, if they do continue
        if they dont, remove all season 3 roles, => add current role
         */
        let team_roles = require('./../data/team_roles.json')
        let team_role_list = Object.keys(team_roles)

        let players = await get_info()
        // console.log(players[0])
        // fully_done()

        for (let player of players){
            try{
                let member = await members.fetch(player.discord_id)
                let roles = member._roles
                let team_role = team_roles[player.team]
                if(!team_role) continue;
                if(roles.every(r => r !== team_role)){
                    // console.log(`${player.spreadsheet_name} doesnt have ${team_role}`)

                    // if(roles.every(r => !team_role_list.includes(r))){
                    //     console.log(player.spreadsheet_name)
                    // console.log('doesnt have role')
                    // console.log(roles)
                    // let new_roles = roles.filter(r => !team_role_list.includes(r))
                    for(let each_role of roles){
                        if(team_role_list.includes(each_role)){
                            await member.roles.remove(each_role)
                        }
                    }
                    // new_roles.push(team_role)
                    // console.log(new_roles)
                    await member.roles.add(team_role)

                }else{
                    // console.log(`${player.spreadsheet_name} has ${team_role}`)

                    //console.log('has role')
                }

            }catch{
                // console.log(`The member ${player.spreadsheet_name} is not in Ranked PUGs 2021`)
            }
        }

        // await members.fetch(players[0].discord_id).roles.add(champion_role)


        fully_done()
    })
}