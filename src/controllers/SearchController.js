const Dev = require ('../models/Dev');


module.exports = {
    async index(request, response){
        const {latitude , longitude , techs} = request.query;
        const techArray = techs.split(`,`).map( tech => tech.trim());
        const devs = await Dev.find({
            techs: {
                $in: techArray,
            },
            location:{
                $near:{
                    $geometry:{
                        type:'Point',
                        coordinates:[longitude,latitude],
                    },
                    $maxDistance: 100000,
                    // distance in meters - update later for variable distance
                }
            }

        }); 

        return response.json(devs);
    }
}