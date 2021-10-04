module.exports = async (config, origin_ids) => {
    return new Promise( async(resolve, reject) => {
        let get_names = require('./get_origin_names_from_id_list')
        // console.log("getting names...")
        let users = await get_names(config, origin_ids)
        // console.log("names gotten, updating sql")
        let sqlite3 = require('sqlite3').verbose()
        let db = new sqlite3.Database('./data/players.db')

        // console.table(users)

        async function update_info(userId, eaId){
            return new Promise((on_success, on_reject) =>{
                // db.get('SELECT overall_BR FROM players WHERE spreadsheet_name=?', [spreadsheet_name], (err, row) => {
                //     // console.log(row.discord_id)
                //     on_success([row.current_origin_name, row.country_emoji])
                // })
                let query = `UPDATE players SET current_origin_name="${eaId}" WHERE origin_id=${userId}`
                // console.log(query)
                db.run(query, [],  function(err) {
                    on_success()
                })
            })
        }



        for(let i in users){
            await update_info(users[i].userId, users[i].eaId)
        }
        db.close()
        // console.log("sql updated")
        resolve()
        // console.log('done')
    })
}
