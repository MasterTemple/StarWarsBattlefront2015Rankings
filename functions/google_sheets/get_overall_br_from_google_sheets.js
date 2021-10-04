module.exports = async (client, config) => {
    console.log("Updating Players...")
    const { GoogleSpreadsheet } = require('google-spreadsheet')
    const creds = require('../../data/creds.json')
    let sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('./data/players.db')
    const fs = require('fs')
    const doc = new GoogleSpreadsheet('1GKUnQBgtXPLrjP8vqRPwOA8-zRUEz4fmYjm7Pc3ODPA')
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
    });
    await doc.loadInfo()

    async function update_info(spreadsheet_name, new_BR, new_league){
        return new Promise((on_success, on_reject) =>{
            // db.get('SELECT overall_BR FROM players WHERE spreadsheet_name=?', [spreadsheet_name], (err, row) => {
            //     // console.log(row.discord_id)
            //     on_success([row.current_origin_name, row.country_emoji])
            // })
            let query = `UPDATE players SET overall_BR=${new_BR}, overall_league="${new_league}" WHERE spreadsheet_name="${spreadsheet_name}"`
            // console.log(query)
            db.run(query, [],  function(err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`Row(s) updated: ${this.changes}`);
                on_success()
            })
        })
    }

    let sheet = await doc.sheetsByTitle['Overall Rankings']
    await sheet.loadCells()
    let row = 3
    do {

        // {
        //     name: sheet.getCell(row, 0)._rawData.formattedValue,
        //     nation: sheet.getCell(row, 1)._rawData.formattedValue || "No country.",
        //     team: sheet.getCell(row, 2)._rawData.formattedValue || "No team.",
        //     BR: sheet.getCell(row, 3)._rawData.formattedValue,
        //     games_played: sheet.getCell(row, 5)._rawData.formattedValue,
        //     wins: sheet.getCell(row, 6)._rawData.formattedValue,
        //     losses: sheet.getCell(row, 7)._rawData.formattedValue,
        //     draws: sheet.getCell(row, 8)._rawData.formattedValue
        // }
        // console.log(sheet.getCell(row, 0)._rawData.formattedValue, sheet.getCell(row, 3)._rawData.formattedValue)
        await update_info(sheet.getCell(row, 4)._rawData.formattedValue, sheet.getCell(row, 9)._rawData.formattedValue, sheet.getCell(row, 0)._rawData.formattedValue)
        row++
    }while((sheet.getCell(row, 0)._rawData.formattedValue != null))
    console.log("Complete")
    await db.close()

}