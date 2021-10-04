module.exports = async (client) => {
    return new Promise(async (success, reject) => {
        let commands = [
            {
                name: 'link',
                description: 'Link your Discord Account with your Battlefront account',
                default_permission: true,
                options: [
                    {
                        name: "battlefront_name",
                        description: "Enter your name in Star Wars Battlefront 2015 / Origin.",
                        type: 'STRING',
                        required: true
                    },
                    {
                        name: "spreadsheet_name",
                        description: "Enter your name as it appears on the Spreadsheet to inherit previous rankings.",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            // {
            //     name: 'register',
            //     description: 'Register if you are brand new to Ranked PUGs!',
            //     default_permission: true,
            //     options: [
            //         {
            //             name: "battlefront_name",
            //             description: "Enter your name in Star Wars Battlefront 2015 / Origin.",
            //             type: 'STRING',
            //             required: true
            //         },
            //         {
            //             name: "spreadsheet_name",
            //             description: "Enter what you would like your spreadsheet name to be (community nickname).",
            //             type: "STRING",
            //             required: true
            //         },
            //         {
            //             name: "country",
            //             description: "Select the country you are from.",
            //             type: 3,
            //             required: true,
            //             choices: [
            //                 {
            //                     name: 'United States of America',
            //                     value: 'USA'
            //                 },
            //                 {
            //                     name: 'Germany',
            //                     value: 'GER'
            //                 },
            //                 {
            //                     name: 'Poland',
            //                     value: 'POL'
            //                 },
            //                 {
            //                     name: 'France',
            //                     value: 'FRA'
            //                 },
            //                 {
            //                     name: 'United Kingdom',
            //                     value: 'UK'
            //                 },
            //                 {
            //                     name: 'Norway',
            //                     value: 'NOR'
            //                 },
            //                 {
            //                     name: 'Finland',
            //                     value: 'FIN'
            //                 },
            //                 {
            //                     name: 'Denmark',
            //                     value: 'DEN'
            //                 },
            //                 {
            //                     name: 'Sweden',
            //                     value: 'SWE'
            //                 },
            //                 {
            //                     name: 'Netherlands',
            //                     value: 'NED'
            //                 },
            //                 {
            //                     name: 'Czechia',
            //                     value: 'CZE'
            //                 },
            //                 {
            //                     name: 'Argentina',
            //                     value: 'ARG'
            //                 },
            //                 // {
            //                 //     name: 'Scotland',
            //                 //     value: 'SCO'
            //                 // },
            //                 {
            //                     name: 'Italy',
            //                     value: 'ITA'
            //                 },
            //                 {
            //                     name: 'Russia',
            //                     value: 'RUS'
            //                 },
            //                 {
            //                     name: 'Belgium',
            //                     value: 'BEL'
            //                 },
            //                 {
            //                     name: 'Hungary',
            //                     value: 'HUN'
            //                 },
            //                 {
            //                     name: 'Brazil',
            //                     value: 'BRA'
            //                 },
            //                 {
            //                     name: 'Portugal',
            //                     value: 'POR'
            //                 },
            //                 {
            //                     name: 'Lebanon',
            //                     value: 'LBN'
            //                 },
            //                 {
            //                     name: 'Canada',
            //                     value: 'CAN'
            //                 },
            //                 {
            //                     name: 'Croatia',
            //                     value: 'CRO'
            //                 },
            //                 {
            //                     name: 'Austria',
            //                     value: 'AUT'
            //                 },
            //                 {
            //                     name: 'South Africa',
            //                     value: 'SAF'
            //                 },
            //                 {
            //                     name: 'Switzerland',
            //                     value: 'CHE'
            //                 },
            //                 // {
            //                 //     name: 'Luxembourg',
            //                 //     value: 'LUX'
            //                 // },
            //                 {
            //                     name: 'Australia',
            //                     value: 'AUS'
            //                 },

            //             ]
            //         }
            //     ]
            // },
            {
                name: 'pug',
                description: 'Create a pug!',
                default_permission: true,
                options: [
                    {
                        "name": "mode",
                        "description": "What game mode is this pug?",
                        "type": 3,
                        "required": true,
                        "choices": [
                            {
                                "name": "Drop Zone",
                                "value": "drop_zone"
                            },
                            {
                                "name": "Cargo",
                                "value": "cargo"
                            }
                        ]
                    },
                    {
                        "name": "lobby",
                        "description": "Would you like a player limit?",
                        "type": 3,
                        "required": false,
                        "choices": [
                            {
                                "name": "4v4",
                                "value": "4v4"
                            },
                            {
                                "name": "5v5",
                                "value": "5v5"
                            },
                            {
                                "name": "6v6",
                                "value": "6v6"
                            }
                        ]
                    }
                ]
            },
            {
                name: 'getname',
                description: 'Get the current Battlefront Name from an Origin ID!',
                default_permission: true,
                options: [
                    {
                        name: "id",
                        description: "Enter their Battlefront ID.",
                        type: 'INTEGER',
                        required: true
                    }
                ]
            },
            {
                name: 'getid',
                description: 'Get the Origin ID of a Battlefront Player!',
                default_permission: true,
                options: [
                    {
                        name: "name",
                        description: "Enter their Battlefront Name.",
                        type: 'STRING',
                        required: true
                    }
                ]
            },
            {
                name: 'rank',
                description: 'Get the rank of a player!',
                default_permission: true,
                options: [
                    {
                        name: "player",
                        description: "Enter a player. Leave blank for your own rank.",
                        type: 6,
                        required: false
                    }
                ]
            },
            {
                name: 'setking',
                description: 'Set the 1v1 King.',
                options: [
                    {
                        name: "king",
                        description: "Enter the next 1v1 King.",
                        type: 6,
                        required: true
                    }
                ],
                default_permission: true,
                // default_permission: false,
                // permissions: [
                //     {
                //         id: "804020705548566528",
                //         type: 1,
                //         permission: true
                //     }
                // ]
            },
            {
                "name": "Get Rank",
                "type": 2
            }
        ]
        for(let [i, j] of client.guilds.cache){
            await client.guilds.cache.get(i).commands.set([])
        }
        await client.application.commands.set(commands)
        // await delete_old_commands()

        // for(let com of commands){
        //     // console.log(c, com)
        //     await create_new_commands(com)
        // }
        // Object.entries(commands).forEach((each_command) => {
        //     client.guilds.cache.forEach(async(each_guild) => {
        //         await client.guilds.cache.get(each_guild.id).commands.create(each_command[1])
        //     })
        // })
        success()
    })
}