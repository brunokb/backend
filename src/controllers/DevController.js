const axios = require('axios');
const Dev = require('../models/Dev');
const bcrypt = require('bcryptjs');
module.exports = {

    async index(request, response) {
        const devs = await Dev.find();
        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, password_hash, latitude, longitude } = request.body;
        var pHash = await bcrypt.hash(password_hash, 10)
        let dev = await Dev.findOne({ github_username });
        let techArray = [];
        if (!dev) {
            await axios.all([
                axios.get(`https://api.github.com/users/${github_username}`),
                axios.get(`https://api.github.com/users/${github_username}/repos`)
            ])
                .then(axios.spread((user, repos) => {
                    const { name = login, avatar_url, bio } = user.data;
                    repos.data.forEach(function (list) {
                        if (list.language) {
                            if (techArray.indexOf(list.language) == -1) {
                                techArray.push(list.language);
                            }
                        }
                    });
                    const location = {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    }
                    dev = Dev.create({
                        name,
                        github_username,
                        password_hash: pHash,
                        bio,
                        avatar_url,
                        techs: techArray,
                        location
                    })

                })).catch(error => {
                    dev = error.response.statusText;
                  })
            return response.json(dev);
        }
        else if (dev) {
            bcrypt.compare(password_hash, dev.password_hash, function (err, res) {
                if (res) {
                    return response.json(dev.name)
                } else {
                    return response.json('Password wrong')
                }
            });

        }
    }
}