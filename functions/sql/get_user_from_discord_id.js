module.exports = async (discord_id) => {
    return new Promise( async(success, reject) => {
        let sqlite3 = require('sqlite3').verbose();
        let db = new sqlite3.Database('./data/players.db')

        async function get_user(discord_id){
            return new Promise((on_success, on_reject) => {
                db.get('SELECT * FROM players WHERE discord_id=?', [discord_id], (err, row) => {
                    // on_success(row?.discord_id)

                    on_success(row)
                })
            })
        }
        let user = await get_user(discord_id)
        success(user)
        // console.log(user)
    })
}