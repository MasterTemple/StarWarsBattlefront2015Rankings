module.exports = async (users, config, interaction, mode) => {
    return new Promise(async(done, not_done) => {
    let get_user = require('./sql/get_user_from_bf_name')
    let players_stats = []
    for(let user of users){
        let player = await get_user(user)
        players_stats.push(player)
    }
    //possible optimization??
    // let get_users = require('./sql/get_multiple_users_from_bf_names')
    // let players_stats = await get_users(users)
    //     console.log(players_stats)
    // console.log(players)

    players_stats.sort(function(a, b) {
        return b[`${mode}_BR`] - a[`${mode}_BR`]
    })

    let players = []
    players_stats.forEach((p) => {
        players.push({
            [`${mode}_BR`]: p[`${mode}_BR`],
            country_emoji: p.country_emoji,
            current_origin_name: p.current_origin_name
        })
    })
        // console.log(players)
    // console.table(players)
    // console.log(mode)

    if(players.length === 1){
        let balanced_teams = {
            team1_BR: players[0][`${mode}_BR`],
            team2_BR: 0,
            team1: [players[0]],
            team2: [],
            difference: 0
        }
        done([balanced_teams, players_stats])
    }


    function calculate_br(this_team_assignment){
        let team1_br = 0
        let team2_br = 0
        this_team_assignment["1"].forEach((each_teammate) => {
            team1_br = team1_br + parseInt(each_teammate[`${mode}_BR`])
        })
        this_team_assignment["2"].forEach((each_teammate) => {
            team2_br = team2_br + parseInt(each_teammate[`${mode}_BR`])
        })
        let difference = Math.abs(team2_br - team1_br)
        if(difference < most_balanced_teams.difference){
            most_balanced_teams = {
                "1": [...this_team_assignment["1"]],
                "2": [...this_team_assignment["2"]],
                "difference": difference
            }
        }

    }

    function increment_teams(team_assignments){
        let still_increment = true
        let counter = 0
        while(still_increment){
            team_assignments[counter]++
            if(team_assignments[counter] === 3){
                team_assignments[counter] = 1
            }
            if(team_assignments[counter] === 2){
                still_increment = false
            }
            counter++
        }
    }

    let team_assignments = []
    for (let i = 0; i < players.length; i++) {
        team_assignments.push(1)
    }

    let most_balanced_teams = {
        "1": [],
        "2": [],
        "difference": 2000
    }
    while(team_assignments.includes(1)){
        let this_team_assignment = {
            "1": [],
            "2": []
        }
        team_assignments.forEach( (each_team_number, counter) => {
            this_team_assignment[each_team_number].push(players[counter])
        } )

        calculate_br(this_team_assignment)
        increment_teams(team_assignments)
    }

    most_balanced_teams['team1_br'] = 0
    most_balanced_teams['team2_br'] = 0
    most_balanced_teams['1'].forEach((each_teammate) => {
        most_balanced_teams['team1_br'] = most_balanced_teams['team1_br'] + parseInt(each_teammate[`${mode}_BR`])
    })
    most_balanced_teams['2'].forEach((each_teammate) => {
        most_balanced_teams['team2_br'] = most_balanced_teams['team2_br'] + parseInt(each_teammate[`${mode}_BR`])
    })
    most_balanced_teams['1'].sort(function(a, b) {
        return b[`${mode}_BR`] - a[`${mode}_BR`]
    })
    most_balanced_teams['2'].sort(function(a, b) {
        return b[`${mode}_BR`] - a[`${mode}_BR`]
    })
    let balanced_teams = {
        team1_BR: Math.round(most_balanced_teams['team1_br'] / most_balanced_teams['1'].length) || 0,
        team2_BR: Math.round(most_balanced_teams['team2_br'] / most_balanced_teams['2'].length) || 0,
        team1: [...most_balanced_teams['1']],
        team2: [...most_balanced_teams['2']],
        difference: Math.abs(most_balanced_teams['team1_br'] - most_balanced_teams['team2_br'])
        //return country emojis
    }

    done([balanced_teams, players_stats])
    })
}
