const { Router } = require ('express');
const cors = require('cors')
const DevController = require ('./controllers/DevController');
const SearchController = require ('./controllers/SearchController');

const routes = Router();

routes.use(cors());

routes.get('/users', DevController.index);
routes.post('/users', DevController.store);

routes.get('/search', SearchController.index);
 
module.exports = routes;