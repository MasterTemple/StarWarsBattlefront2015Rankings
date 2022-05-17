module.exports = async function (config) {
  return new Promise(async (success, reject) => {
    const axios = require("axios");

    let url = `https://accounts.ea.com/connect/auth?client_id=ORIGIN_JS_SDK&response_type=token&redirect_uri=nucleus:rest&prompt=none&release_type=prod`;

    await axios({
      url: url,
      method: "GET",
      withCredentials: true,
      headers: {
        Cookie: `remid=${config.remid}; sid=${config.sid};`,
        // Cookie: `sid=${config.sid};`,
      },
    })
      .then((res) => {
        // console.log(`New Auth Token: ${res.data.access_token}`);
        console.log(res);
        config.auth_token = res.data.access_token;
        let fs = require("fs");
        fs.writeFileSync("./data/config.json", JSON.stringify(config, null, 2));
        success();
      })
      .catch((err) => {
        console.log(err.response.status);
      });
  });
};
