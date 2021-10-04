module.exports = async (config) => {
    return new Promise( async(done, fail) => {
        let sqlite3 = require('sqlite3').verbose()
        let db = new sqlite3.Database('./data/players.db')

        async function get_origin_ids() {
            return new Promise((on_success, on_reject) => {
                db.all('SELECT origin_id FROM players WHERE origin_id IS NOT NULL', [], (err, rows) => {
                    on_success(rows)
                })
            })
        }

        let update_origin_name_from_id = require('./update_origin_name_from_id')
        let results = await get_origin_ids()
        db.close()
        let origin_ids = []
        results.forEach((e) => origin_ids.push(e.origin_id))
        await update_origin_name_from_id(config, origin_ids)
        done()
    })

}
