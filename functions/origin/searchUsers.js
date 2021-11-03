const getOriginNames = require('./get_origin_names_from_id_list')
module.exports = async(config, input) => {
  return new Promise(async (resolve, reject) => {
      const axios = require('axios')
    //   const my_id = 1010647254402
      let url = `https://api2.origin.com/xsearch/users?userId=${config.account_id}&searchTerm=${input}&start=0`

      await axios({
          url: url,
          method: 'GET',
          headers: {
              authtoken: config.auth_token
          }
      }).then(async(res) => {
          // console.log(res.data)
          let ids = res.data.infoList.map(e=>e.friendUserId)
          ids = ids.slice(0, 15)
          let results = await getOriginNames(config, ids)
          // console.log(results);
          let options = []
          results.forEach(({userId, eaId}) => options.push({name: eaId, value: userId}))
          resolve(options)

      }).catch(async (e) => {
          // // console.log(e)
          // // console.log(e.response.status)
          // if (e.response?.data?.rootCause?.cause === "invalid_token") {
          //     let auto_refresh_token = require('../auto_refresh_token')
          //     await auto_refresh_token(config)
          //     module.exports(config, origin_id)
          // }else{
              resolve()
          // }
      })

  })

}