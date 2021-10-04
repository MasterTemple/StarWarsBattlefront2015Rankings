module.exports = async (interaction, discord_id) => {
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
        if(user === undefined){
            interaction.reply({content: "You must be registered to use this command. Please try the `/register` command if you are new to Ranked PUGS or the `/link` command to link your Discord account to previous Ranked PUG scores.", ephemeral: true})
            success(true)
        }
        success(false)
        // console.log(user)
    })
}