module.exports = async (config, spreadSheetName, country) => {
    const { GoogleSpreadsheet } = require('google-spreadsheet')
    const creds = require('../../data/creds.json')
    const doc = new GoogleSpreadsheet('1GKUnQBgtXPLrjP8vqRPwOA8-zRUEz4fmYjm7Pc3ODPA')
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
    });
    await doc.loadInfo()

    let sheet = await doc.sheetsByTitle['PlayerSheet']
    await sheet.loadCells()
    let row = 1
    while((sheet.getCell(row, 0)._rawData.formattedValue != null)){
        // console.log(sheet.getCell(row, 0)._rawData.formattedValue, sheet.getCell(row, 1)._rawData.formattedValue)
        row++
    }
    const { google } = require("googleapis");

    // console.log(Object.getOwnPropertyNames(sheet))
    // console.log(row)
    // console.log(Object.getOwnPropertyNames(sheet.getCell(row, 0)))
    // console.log(Object.getOwnPropertyNames(sheet.getCell(row, 0)._rawData.userEnteredFormat))
    // console.log(Object.getOwnPropertyNames(sheet.getCell(row, 0)._rawData.effectiveFormat))
    // sheet.getCell(row, 0)._rawData.userEnteredFormat = spreadSheetName
    // sheet.getCell(row, 0)._rawData.effectiveFormat = spreadSheetName

    // let cells = await sheet.loadCells({
    //     'min-row': row,
    //     'min-col': 0,
    //     'max-row': row,
    //     'max-col': 1,
    // })
    // console.log(cells)
    // sheet.getCell(row, 0)._rawData = spreadSheetName
    // sheet.getCell(row, 1)._rawData = country

    // const axios = require('axios')
    // let range = `PlayerSheet!A${row+1}:B${row+1}`
    // let myToken = "AC4w5VgmpnlRHBgfr7dWoOh5arNpfat0qg%3A1629395045073"
    // axios({
    //     // Authorization: `Bearer ${creds.private_key}`,
    //     Authorization: `Bearer ${creds.private_key}`,
    //     url: `https://sheets.googleapis.com/v4/spreadsheets/${config.google_sheet_id}/values/${range}`,
    //     method: "PUT",
    //     data: {
    //         "majorDimension": "ROWS",
    //         "values": [
    //             [spreadSheetName],
    //             [country]
    //         ],
    //     }
    // }).then( (res) => {
    //     console.log(res)
    // }).catch( (err) => {
    //     console.log(err)
    // })
    // await 
    // console.log(sheet.getCell(row, 0)._rawData.formattedValue, sheet.getCell(row, 1)._rawData.formattedValue)


}