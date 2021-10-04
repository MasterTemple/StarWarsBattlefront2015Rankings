module.exports = async (bf_name) => {
    return new Promise( async(success, reject) => {
        let sqlite3 = require('sqlite3').verbose();
        let db = new sqlite3.Database('./data/players.db')

        async function get_user(bf_name){
            return new Promise((on_success, on_reject) => {
                db.get('SELECT * FROM players WHERE current_origin_name=?', [bf_name], (err, row) => {
                    // on_success(row?.discord_id)

                    on_success(row)
                })
            })
        }
        let user = await get_user(bf_name)
        success(user)
        // console.log(user)
    })
}