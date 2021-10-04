module.exports = async (message, config) => {
    return new Promise(async(success, reject) => {
        let Clipper = require('image-clipper')
        let canvas = require('node-canvas')
        Clipper.configure('canvas', canvas)
        const ocrSpace = require('ocr-space-api-wrapper')
        let key = config.ocr_key


        async function get_cropped_image(link, resolution, key) {
            return new Promise((on_success, on_error) => {
                Clipper(link, async function () {
                    await this.crop(resolution.x_min, resolution.y_min, resolution.x_max - resolution.x_min, resolution.y_max - resolution.y_min)
                        .toDataURL(async function(url){
                            const res = await ocrSpace(url, {apiKey: key, language: 'eng', OCREngine: 2, isTable: true})
                            let text_array = []
                            res['ParsedResults'][0]['TextOverlay']['Lines'].forEach(each_line => {
                                text_array.push(each_line['LineText'])
                            })
                            on_success(text_array)
                        })
                })
            })
        }

        let pic = await message.attachments.first()
        let link = pic.attachment
        let height = pic.height
        let width = pic.width

        let allowed_resolutions = [
            {
                width: 1920,
                height: 1080
            },
            {
                width: 1919,
                height: 1079
            },
            // {
            //     width: 1400,
            //     height: 1050
            // },
            // {
            //     width: 1600,
            //     height: 900
            // },
            // {
            //     width: 1920,
            //     height: 1200
            // },
        ]

        let used_resolution = allowed_resolutions.find( (each_res) => each_res.height === height && each_res.width === width)
        if(!used_resolution){
            let resolutions_string = ''
            allowed_resolutions.forEach((r) => {
                resolutions_string = `${resolutions_string}${r.height}x${r.width}, `
            })
            message.channel.send(`Please use one of the following resolutions: ${resolutions_string}`)
        }

        let resolutions = {
            team_1_names: {
                x_min: 140,
                x_max: 460,
                y_min: 344,
                y_max: 530,
            },
            team_1_scores: {
                x_min: 492,
                x_max: 580,
                y_min: 344,
                y_max: 530,
            },
            team_2_names: {
                x_min: 990,
                x_max: 1312,
                y_min: 344,
                y_max: 530,
            },
            team_2_scores: {
                x_min: 1340,
                x_max: 1430,
                y_min: 344,
                y_max: 530,
            }
        }

        async function get_values(){
            let team_1_names = await get_cropped_image(link, resolutions['team_1_names'], key)
            let team_1_scores = await get_cropped_image(link, resolutions['team_1_scores'], key)
            let team_2_names = await get_cropped_image(link, resolutions['team_2_names'], key)
            let team_2_scores = await get_cropped_image(link, resolutions['team_2_scores'], key)

            return {
                team_1_names: team_1_names,
                team_1_scores: team_1_scores,
                team_2_names: team_2_names,
                team_2_scores: team_2_scores,
            }

        }
        get_values().then( obj => {
            console.table(obj)
            obj.team_1_scores.forEach((e, c) => obj.team_1_scores[c] = e.replace(' ', ''))
            obj.team_2_scores.forEach((e, c) => obj.team_2_scores[c] = e.replace(' ', ''))
            success(obj)
        })
    })
}
