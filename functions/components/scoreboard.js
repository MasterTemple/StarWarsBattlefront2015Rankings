module.exports = async (scores, client) => {
    let team1 = []
    let team2 = []
    let ranked_pug_discord_id = "803718842793984020"

    for(let c in scores.team_1_names){
        // let member = await client.guilds.cache.get(ranked_pug_discord_id).members.fetch(scores.team_1_discord_ids[c])
        let user = await client.users.fetch(scores.team_1_discord_ids[c])
        // let name = `${member.user.username}#${member.user.discriminator}` || 'unknown'
        let name = `${user.username}#${user.discriminator}` || 'unknown'

        // console.log(member)
        // console.log(user)
        team1.push({
            "label": scores.team_1_igns[c],
            "value": scores.team_1_discord_ids[c],
            "description": name,
            "emoji": {
                "name": scores.team_1_emoji_ids[c],
                "id": null
        }
        })
    }

    for(let c in scores.team_2_names){
        // let member = await client.guilds.cache.get(ranked_pug_discord_id).members.fetch(scores.team_2_discord_ids[c])
        console.log(scores.team_2_discord_ids[c])
        let user = await client.users.fetch(scores.team_2_discord_ids[c])
        // let name = `${member.user.username}#${member.user.discriminator}` || 'unknown'
        let name = `${user.username}#${user.discriminator}` || 'unknown'

        // console.log(member)
        // console.log(user)
        team2.push({
            "label": scores.team_2_igns[c],
            "value": scores.team_2_discord_ids[c],
            "description": name,
            "emoji": {
                "name": scores.team_2_emoji_ids[c],
                "id": null
            }
        })
    }

    let components = [
        {
            "type": 1,
            "components": [
                {
                    "type": 3,
                    "custom_id": "partner_compensation[1]",
                    "options": team1,
                    "placeholder": "Select Team 1 Partner Compensation",
                    "min_values": 0,
                    "max_values": 1
                }
            ]
        },
        {
            "type": 1,
            "components": [
                {
                    "type": 3,
                    "custom_id": "partner_compensation[2]",
                    "options": team2,
                    "placeholder": "Select Team 2 Partner Compensation",
                    "min_values": 0,
                    "max_values": 1
                }
            ]
        },
        {
            "type": 1,
            "components": [
                {
                    "type": 2,
                    "label": "Team 1 Win",
                    "style": 1,
                    "custom_id": "win[1]"
                },
                {
                    "type": 2,
                    "label": "Draw",
                    "style": 2,
                    "custom_id": "win[3]"
                },
                {
                    "type": 2,
                    "label": "Team 2 Win",
                    "style": 4,
                    "custom_id": "win[2]"
                }
            ]
        },
        {
            "type": 1,
            "components": [
                {
                    "type": 2,
                    "label": "Submit!",
                    "style": 3,
                    "custom_id": "submit"
                },
            ]
        }
    ]

    return components
}