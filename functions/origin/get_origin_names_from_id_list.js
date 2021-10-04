module.exports = async (config, origin_ids) => {
    async function get_ids(ids) {
        return new Promise(async (resolve, reject) => {
            const axios = require('axios')
            let url = `https://api2.origin.com/atom/users?userIds=${ids.join(',')}`


            await axios({
                url: url,
                method: 'GET',
                headers: {
                    authtoken: config.auth_token
                }
            }).then(res => {
                // console.log(res.data.users)
                resolve(res.data.users)

            }).catch(async (e) => {
                // console.log(e)
                console.log(e.response.status)
                if (e.response.data?.rootCause?.cause === "invalid_token") {
                    let auto_refresh_token = require('../auto_refresh_token')
                    await auto_refresh_token(config)
                    module.exports(config, ids)
                    // interaction.reply({content: "The auth token has expired! (It only lasts 4 hours) I have not learned how to automatically generate one so I have to manually generate one until then. :(", ephemeral: true})
                }
            })

        })
    }
    return new Promise(async(success, fail) => {
        let users = []
        while(origin_ids.length !== 0){

            let batch_of_users = await get_ids(origin_ids.splice(0, 5))
            users = [...users, ...batch_of_users]
        }
        success(users)
    })


}