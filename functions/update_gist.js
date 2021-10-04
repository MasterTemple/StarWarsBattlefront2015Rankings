module.exports = async (config) => {
    return new Promise(async(success, fail) => {
        const GitHub = require('github-base');
        let sqlite = require('sqlite3').verbose()
        let db = new sqlite.Database('./data/players.db')
        async function get_all_users() {
            return new Promise( (resolve, reject) => {
                db.all("SELECT * FROM players", [], (err, rows) => {
                    resolve(rows)
                })
            })
        }
        let new_data = {}
        new_data['data'] = await get_all_users()
        new_data['auth_token'] = config.auth_token
        // console.log(new_data)
        // let me = new_data.find(e => e.discord_id === '746258107046559847')
        // console.log(me)
        // return
        const github = new GitHub({token: config.github_auth});
        const options = { files: { 'battlefront_ranking_test_1.json': { content: JSON.stringify(new_data, null, 2) } } };
        github.patch('/gists/d019eb0bd992fde5e4124a03213c03ef', options)
            .then(res => {
                // console.log('RESPONSE:', res)
            }).catch(e => {
            console.log(e)
        })
        success()
    })
}
