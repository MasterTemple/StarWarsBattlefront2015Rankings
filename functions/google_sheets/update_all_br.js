module.exports = async () => {
    return new Promise ( async(all_done, failed) => {
        // console.log("Updating Players...")
        const {GoogleSpreadsheet} = require('google-spreadsheet')
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

        async function update_overall_info(spreadsheet_name, new_BR, new_league, team, rank) {
            return new Promise((on_success, on_reject) => {
                // db.get('SELECT overall_BR FROM players WHERE spreadsheet_name=?', [spreadsheet_name], (err, row) => {
                //     // console.log(row.discord_id)
                //     on_success([row.current_origin_name, row.country_emoji])
                // })
                let query = `UPDATE players SET overall_BR=${new_BR}, overall_ranking=${rank}, overall_league="${new_league}", team="${team}" WHERE spreadsheet_name="${spreadsheet_name}"`
                // console.log(query)
                db.run(query, [], function (err) {
                    if (err) {
                        return console.error(err.message);
                    }
                    // console.log(`Row(s) updated: ${this.changes}`);
                    on_success()
                })
            })
        }

        async function update_drop_zone_info(spreadsheet_name, new_drop_zone_BR, new_drop_zone_league, played, won, lost, tied) {
            return new Promise((on_success, on_reject) => {
                // db.get('SELECT overall_BR FROM players WHERE spreadsheet_name=?', [spreadsheet_name], (err, row) => {
                //     // console.log(row.discord_id)
                //     on_success([row.current_origin_name, row.country_emoji])
                // })
                let query = `UPDATE players SET drop_zone_BR=${new_drop_zone_BR}, drop_zone_league="${new_drop_zone_league}", drop_zone_played=${played}, drop_zone_won=${won}, drop_zone_lost=${lost}, drop_zone_tied=${tied} WHERE spreadsheet_name="${spreadsheet_name}"`
                // let query = `UPDATE players SET drop_zone_BR=${new_drop_zone_BR}, drop_zone_league="${new_drop_zone_league}", cargo_BR="${new_cargo_BR}", cargo_league="${new_cargo_league}" WHERE spreadsheet_name="${spreadsheet_name}"`
                // console.log(query)
                db.run(query, [], function (err) {
                    if (err) {
                        return console.error(err.message);
                    }
                    // console.log(`Row(s) updated: ${this.changes}`);
                    on_success()
                })
            })
        }

        async function update_new_br_from_player_sheet(spreadsheet_name, new_dz_br, new_cargo_br) {
            return new Promise((on_success, on_reject) => {
                // db.get('SELECT overall_BR FROM players WHERE spreadsheet_name=?', [spreadsheet_name], (err, row) => {
                //     // console.log(row.discord_id)
                //     on_success([row.current_origin_name, row.country_emoji])
                // })
                let query = `UPDATE players SET drop_zone_BR=${new_dz_br}, cargo_BR=${new_cargo_br} WHERE spreadsheet_name="${spreadsheet_name}"`
                // let query = `UPDATE players SET drop_zone_BR=${new_drop_zone_BR}, drop_zone_league="${new_drop_zone_league}", cargo_BR="${new_cargo_BR}", cargo_league="${new_cargo_league}" WHERE spreadsheet_name="${spreadsheet_name}"`
                // console.log(query)
                db.run(query, [], function (err) {
                    if (err) {
                        return console.error(err.message);
                    }
                    // console.log(`Row(s) updated: ${this.changes}`);
                    on_success()
                })
            })
        }

        async function update_cargo_info(spreadsheet_name, new_cargo_BR, new_cargo_league, played, won, lost, tied) {
            return new Promise((on_success, on_reject) => {
                let query = `UPDATE players SET cargo_BR=${new_cargo_BR}, cargo_league="${new_cargo_league}", cargo_played=${played}, cargo_won=${won}, cargo_lost=${lost}, cargo_tied=${tied} WHERE spreadsheet_name="${spreadsheet_name}"`
                db.run(query, [], function (err) {
                    if (err) {
                        return console.error(err.message);
                    }
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
            // console.log(sheet.getCell(row, 4)._rawData.formattedValue, sheet.getCell(row, 9)._rawData.formattedValue, sheet.getCell(row, 0)._rawData.formattedValue, sheet.getCell(row, 4)._rawData.formattedValue, sheet.getCell(row, 1)._rawData.formattedValue)

            await update_overall_info(sheet.getCell(row, 4)._rawData.formattedValue, sheet.getCell(row, 9)._rawData.formattedValue, sheet.getCell(row, 0)._rawData.formattedValue, (sheet.getCell(row, 6)._rawData.formattedValue || "No Team"), sheet.getCell(row, 1)._rawData.formattedValue)
            row++
        } while ((sheet.getCell(row, 0)._rawData.formattedValue != null))

        sheet = await doc.sheetsByTitle['Mode Rankings']
        await sheet.loadCells()
        row = 3
        do {
            //(spreadsheet_name, new_drop_zone_BR, new_drop_zone_league, new_cargo_BR, new_cargo_league)
            // console.log(sheet.getCell(row, 4)._rawData.formattedValue, sheet.getCell(row, 7)._rawData.formattedValue, sheet.getCell(row, 0)._rawData.formattedValue, sheet.getCell(row, 19)._rawData.formattedValue, sheet.getCell(row, 12)._rawData.formattedValue)
            await update_drop_zone_info(sheet.getCell(row, 4)._rawData.formattedValue, sheet.getCell(row, 7)._rawData.formattedValue, sheet.getCell(row, 0)._rawData.formattedValue, sheet.getCell(row, 9)._rawData.formattedValue, sheet.getCell(row, 10)._rawData.formattedValue, sheet.getCell(row, 11)._rawData.formattedValue, sheet.getCell(row, 12)._rawData.formattedValue)
            row++
        } while ((sheet.getCell(row, 0)._rawData.formattedValue != null))

        // row = 3
        // let cargo_offset = 12
        // do {
        //     await update_cargo_info(sheet.getCell(row, 4 + cargo_offset)._rawData.formattedValue, sheet.getCell(row, 7 + cargo_offset)._rawData.formattedValue, sheet.getCell(row, 0 + cargo_offset)._rawData.formattedValue, sheet.getCell(row, 9 + cargo_offset)._rawData.formattedValue, sheet.getCell(row, 10)._rawData.formattedValue, sheet.getCell(row, 11 + cargo_offset)._rawData.formattedValue, sheet.getCell(row, 12 + cargo_offset)._rawData.formattedValue)
        //     row++
        // } while ((sheet.getCell(row, 0 + cargo_offset)._rawData.formattedValue != null))

        sheet = await doc.sheetsByTitle['PlayerSheet']
        await sheet.loadCells()
        row = 1
        do {
            //(spreadsheet_name, new_drop_zone_BR, new_drop_zone_league, new_cargo_BR, new_cargo_league)
            // console.log(sheet.getCell(row, 4)._rawData.formattedValue, sheet.getCell(row, 7)._rawData.formattedValue, sheet.getCell(row, 0)._rawData.formattedValue, sheet.getCell(row, 19)._rawData.formattedValue, sheet.getCell(row, 12)._rawData.formattedValue)
            // console.log(sheet.getCell(row, 0)._rawData.formattedValue, sheet.getCell(row, 4)._rawData.formattedValue, sheet.getCell(row, 22)._rawData.formattedValue)
            await update_new_br_from_player_sheet(sheet.getCell(row, 0)._rawData.formattedValue, sheet.getCell(row, 4)._rawData.formattedValue, sheet.getCell(row, 22)._rawData.formattedValue)
            row++
        } while ((sheet.getCell(row, 0)._rawData.formattedValue != null))

        //console.log("Complete")
        await db.close()
        // console.log("Update successful")
        all_done()
    })
}
