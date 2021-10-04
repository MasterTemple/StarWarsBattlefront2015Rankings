module.exports = async (player,client) => {
    let user = await client.users.fetch(player.discord_id)
    return [
        {
            "type": 1,
            "components": [
                {
                    "type": 3,
                    "custom_id": "join_pug[remove]",
                    "options": [
                        {
                            "label": player.current_origin_name.substring(0, 24),
                            "value": player.current_origin_name,
                            "description": `${user.username}#${user.discriminator}`,
                            "emoji": {
                                "name": player.country_emoji,
                                "id": null
                            }
                        }
                    ],
                    "placeholder": "Select all players to remove",
                    "min_values": 1,
                    "max_values": 1
                }
            ]
        },
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
                }
            ]
        }
    ]
}
