module.exports = async(config, id) => {
    return new Promise(async (resolve, reject) => {
        const axios = require('axios')
        let url = `https://api3.origin.com/atom/users?userIds=${id}`

        await axios({
            url: url,
            method: 'GET',
            headers: {
                authtoken: config.auth_token
            }
        }).then(res => {
            // console.log(res.data)
            resolve(res.data.users[0].eaId)

        }).catch(async (e) => {
            // console.log(e)
            console.log(e.response?.status)
            if (e.response?.data?.rootCause?.cause === "invalid_token") {
                let auto_refresh_token = require('../auto_refresh_token')
                await auto_refresh_token(config)
                await module.exports(config, id)
            }else{
                resolve()
            }
        })

    })

}