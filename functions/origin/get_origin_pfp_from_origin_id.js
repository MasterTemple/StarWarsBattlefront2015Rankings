module.exports = async(config, origin_id) => {
    return new Promise(async (resolve, reject) => {
        const axios = require('axios')
        let url = `https://api1.origin.com/avatar/user/${origin_id}/avatars?size=2`

        await axios({
            url: url,
            method: 'GET',
            headers: {
                authtoken: config.auth_token
            }
        }).then(res => {
            // console.log(res.data.users)
            resolve(res.data.users[0].avatar.link)

        }).catch(async (e) => {
            // console.log(e)
            // console.log(e.response.status)
            if (e.response?.data?.rootCause?.cause === "invalid_token") {
                let auto_refresh_token = require('../auto_refresh_token')
                await auto_refresh_token(config)
                module.exports(config, origin_id)
            }else{
                resolve()
            }
        })

    })

}