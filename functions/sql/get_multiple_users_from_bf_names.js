module.exports = async (bf_names) => {
    return new Promise( async(success, reject) => {
        let users = []
        let sqlite3 = require('sqlite3').verbose();
        let db = new sqlite3.Database('./data/players.db')
        // for(let bf_name of bf_names) {
        //     let sqlite3 = require('sqlite3').verbose();
        //     let db = new sqlite3.Database('./data/players.db')
        //
        //     async function get_user(bf_name) {
        //         return new Promise((on_success, on_reject) => {
        //             db.get('SELECT * FROM players WHERE current_origin_name=?', [bf_name], (err, row) => {
        //                 // on_success(row?.discord_id)
        //
        //                 on_success(row)
        //             })
        //         })
        //     }
        //
        //     let user = await get_user(bf_name)
        //     users.push(user)
        // }
        success(users)
        async function get_user(bf_name) {
            return new Promise((on_success, on_reject) => {
                let question_marks = '?'
                for(let i=0; i < bf_names; i++){
                    question_marks = question_marks + ",?"
                }
                let query = `SELECT * FROM players WHERE current_origin_name IN (${question_marks})`
                db.all(query, [...bf_names], (err, rows) => {
                    // on_success(row?.discord_id)
                    console.log(rows)
                    on_success(rows)
                })
            })
        }
        // console.log(user)
    })
}