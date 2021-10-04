module.exports = async (client, config) => {
    return new Promise( async(fully_done, failed) => {
        let members = await client.guilds.cache.get('803718842793984020').members
        let get_user_from_discord_id = require('./sql/get_user_from_discord_id')

        let sqlite3 = require('sqlite3').verbose();
        let db = new sqlite3.Database('./data/players.db')

        async function get_info() {
            return new Promise((on_success, on_reject) => {
                db.all('SELECT current_origin_name, discord_id, overall_league, spreadsheet_name FROM players WHERE discord_id IS NOT NULL AND current_origin_name IS NOT NULL', [], (err, rows) => {
                    on_success(rows)
                })
            })
        }

        let players = await get_info()

        for (let player of players){
            try{
                let member = await members.fetch(player.discord_id)
                // let nick_name = await get_user_from_discord_id(player.discord_id)
                if (member.nickname !== player.current_origin_name) {
                    try {
                        await member.setNickname(player.current_origin_name)
                    } catch {
                        console.log(`Could not change nickname of ${player.spreadsheet_name}`)
                    }

                }
            }catch{
                console.log(`The member ${player.spreadsheet_name} is not in Ranked PUGs 2021`)
            }
        }


        fully_done()
    })
}