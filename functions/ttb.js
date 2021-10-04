module.exports = async() => {
    return new Promise(async(success, fail) => {
        const axios = require("axios")
        const { ttb_token, ttb_channel_id } = require('./../data/config.json')
        // const ttb_token = ""
        // const ttb_channel_id = "725055794755665930"
        const ttb_info = await get_ttb_info(axios)
        ttb_info.download_url = await get_download_url(axios, ttb_info)
        const channel_is_up_to_date = await check_channel_day(axios, ttb_info, ttb_token, ttb_channel_id)
        if(!channel_is_up_to_date) {
            const discord_data = await send_embed(axios, ttb_info, ttb_token, ttb_channel_id)
            await add_check_reaction(axios, discord_data, ttb_token, ttb_channel_id)
            await update_channel_topic(axios, ttb_info, ttb_token, ttb_channel_id)
        }
        success()
    })
    async function get_ttb_info(axios) {
        return new Promise( (resolve, reject) => {
            const jsdom = require("jsdom");
            const { JSDOM } = jsdom
            const ttb_url = "https://www.oneplace.com/ministries/thru-the-bible-with-j-vernon-mcgee/listen/"

            axios({
                url: ttb_url,
                method: "GET",
            }).then( (res) => {
                const { document } = (new JSDOM(res.data)).window;
                let date = document.querySelector("#accordion > ul:nth-child(2) > li:nth-child(1) > a > div.description > div.date").textContent
                let url = document.querySelector("#accordion > ul:nth-child(2) > li:nth-child(1) > a").toString()
                let scripture_reference = document.querySelector("#accordion > ul:nth-child(2) > li:nth-child(1) > a > div.description > div.title.dotdotdot").textContent
                // console.log(res.data)
                resolve({
                    date: date,
                    url: url,
                    scripture: scripture_reference,
                    // download_url: res.data.match(/https:\/\/zcast\.swncdn\.com\/episodes\/zcast\/thru\-the\-bible\-with\-j\-vernon\-mcgee[^(\.mp)]+\.mp3/g)[0]
                })
            }).catch( (error) => {
                console.log(error)
            })
        })
    }
    async function get_download_url(axios, ttb_info) {
        return new Promise( (resolve, reject) => {
            const jsdom = require("jsdom");
            const { JSDOM } = jsdom

            axios({
                url: ttb_info.url,
                method: "GET",
            }).then( (res) => {
                resolve(res.data.match(/https:\/\/zcast.swncdn.com\/episodes\/zcast\/thru\-the\-bible\-with\-j\-vernon\-mcgee[^(mp)]+mp3/g)[0])
            }).catch( (error) => {
                console.log(error)
            })
        })
    }
    async function send_embed(axios, ttb_info, ttb_token, ttb_channel_id) {
        return new Promise( (resolve, reject) => {
            let base_url = "https://discord.com/api/v9/"
            let mcgee_pfp = "https://content.swncdn.com/zcast/oneplace/host-images/thru-the-bible-with-j-vernon-mcgee/80x80.webp"
            let ttb_logo = "https://ttb.org/img/ttb-logo-2018-with-sig-2x.png"
            let ttb_thumbnail = "https://play-lh.googleusercontent.com/TN_Qd0i7WJ-AmZWc7ZmIVDEL6hjc1BxUtinH6Nc8mLnPJ436X3WvP_DKVNR6LhBhDA=s180-rw"
            axios({
                url: `${base_url}channels/${ttb_channel_id}/messages`,
                method: "POST",
                withCredentials: true,
                headers: {
                    Authorization: `Bot ${ttb_token}`,
                    "Content-Type": "application/json",
                },
                data: {
                    embeds: [{
                        author: {
                            name: "Dr. J. Vernon McGee",
                            icon_url: mcgee_pfp
                        },
                        title: `Thru the Bible - ${ttb_info.date}`,
                        // url: ttb_info.url,
                        // image: {url:ttb_logo},
                        thumbnail: {url:ttb_thumbnail},
                        fields: [{
                            name: "Today's Scripture",
                            value: ttb_info.scripture,
                            inline: false
                        }],
                        // description: ttb_info.scripture,
                        color: parseInt("0080ff", 16)
                    }],
                    components:[
                        {
                            "type": 1,
                            "components": [
                                {
                                    "type": 2,
                                    "label": "Listen Online!",
                                    "style": 5,
                                    "url": ttb_info.url
                                    // "custom_id": "click_one"
                                },
                                {
                                    "type": 2,
                                    "label": "Download Here!",
                                    "style": 5,
                                    "url": ttb_info.download_url
                                    // "custom_id": "click_one"
                                }
                            ]
                        }
                    ]
                }
            }).then((res) => {
                // console.log(res.data)
                resolve(res.data)
            }).catch( (error) => {
                console.log(error)
            })

        })
    }
    async function add_check_reaction(axios, discord_data, ttb_token, ttb_channel_id) {
        return new Promise((resolve, reject) => {
            let base_url = "https://discord.com/api/v9/"
            let check_emoji = "\xE2\x9C\x85"
            axios({
                url: `${base_url}/channels/${ttb_channel_id}/messages/${discord_data.id}/reactions/${check_emoji}/@me`,
                method: "PUT",
                headers: {
                    Authorization: `Bot ${ttb_token}`,
                    "Content-Type": "application/json",
                },
            }).then( () => {
                resolve()
            }).catch(() => {resolve()})
        })
    }
    async function update_channel_topic(axios, ttb_info, ttb_token, ttb_channel_id) {
        return new Promise((resolve, reject) => {
            let base_url = "https://discord.com/api/v9/"
            axios({
                url: `${base_url}/channels/${ttb_channel_id}`,
                method: "PATCH",
                headers: {
                    Authorization: `Bot ${ttb_token}`,
                    "Content-Type": "application/json",
                },
                data:{
                    topic: ttb_info.scripture
                }
            }).then( () => {
                resolve()
            }).catch(() => {resolve()})
        })
    }
    async function check_channel_day(axios, ttb_info, ttb_token, ttb_channel_id) {
        return new Promise((resolve, reject) => {
            let base_url = "https://discord.com/api/v9/"
            axios({
                url: `${base_url}/channels/${ttb_channel_id}`,
                method: "GET",
                headers: {
                    Authorization: `Bot ${ttb_token}`,
                    "Content-Type": "application/json",
                }
            }).then( (res) => {
                // console.log(res.data)
                if(res.data.topic === ttb_info.scripture){
                    resolve(true)
                }else{
                    resolve(false)
                }

            }).catch(() => {resolve()})
        })
    }
}
