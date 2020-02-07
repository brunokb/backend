const axios  = require('axios');
const Dev = require('../models/Dev');
const bcrypt = require('bcryptjs');
module.exports = {

    async index(request, response){   
        const devs = await Dev.find();
        return response.json(devs);
    },

    async store(request, response) {
    const {github_username , password_hash, latitude , longitude} = request.body;
    let dev = await Dev.findOne({github_username});
    if(!dev){
    const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    const { name = login, avatar_url, bio} = apiResponse.data;
    const apiLanguage = await axios.get(`https://api.github.com/users/${github_username}/repos`);
    let techArray = [];
    //console.log(apiLanguage.data.language);
    var pHash = await bcrypt.hash(password_hash,10)

    apiLanguage.data.forEach(function(list) {
        if(list.language){    
            if(techArray.indexOf(list.language) == -1){
                techArray.push(list.language);
            }
        }
    });
    const location = {
        type: 'Point',
        coordinates:[longitude, latitude]
    }
    dev = await Dev.create({
        name,
        github_username,
        password_hash:pHash,
        bio,
        avatar_url,
        techs: techArray,
        location
    })
    }
    else if(dev){
        bcrypt.compare(password_hash, dev.password_hash, function(err, res) {
            
        });   
    }
   return response.json(dev);
}}