module.exports = async (number_of_players, max_lobby_size, players, client) => {
    // let user = await client.users.fetch(player.discord_id)
    let options = []

    for(let player of players) {
        let user = await client.users.fetch(player.discord_id)
        options.push({
            "label": player.current_origin_name.substring(0, 24),
            "value": player.current_origin_name.toString(),
            "description": `${user.username}#${user.discriminator}`,
            "emoji": {
                "name": player.country_emoji,
                "id": null
            }
        })
    }
    let start_is_disabled = true
    if(number_of_players >= 8 && number_of_players % 2 === 0) {
        start_is_disabled = false
    }
        let comps =  [
        {
            "type": 1,
            "components": [
                {
                    "type": 2,
                    "label": "Join PUG",
                    "style": 3,
                    "custom_id": "join_pug[join]",
                },
                {
                    "type": 2,
                    "label": "Leave PUG",
                    "style": 4,
                    "custom_id": "join_pug[leave]",
                },
                {
                    "type": 2,
                    "label": "Start PUG",
                    "style": 1,
                    "custom_id": "start_pug",
                    "disabled": start_is_disabled
                }
            ]
        }
    ]
    if(options.length > 0){
        comps.unshift({
            "type": 1,
            "components": [
                {
                    "type": 3,
                    "custom_id": "join_pug[remove]",
                    "options": options,
                    "placeholder": "Select all players to remove",
                    "min_values": 1,
                    "max_values": 1
                }
            ]
        })
    }
    // console.log(comps)
    // console.log(number_of_players, max_lobby_size)
    // if(number_of_players >= 8 && number_of_players % 2 === 0) {
    //     comps[1].components.push({
    //                 "type": 2,
    //                 "label": "Start PUG",
    //                 "style": 1,
    //                 "custom_id": "start_pug",
    //             })
    // }
    return comps
}
