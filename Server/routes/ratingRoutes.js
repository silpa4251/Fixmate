const express = require("express");
const userAuth = require("../middlewares/userAuth");
const { createRating, getAllRatings, getRatingById, updateRating, deleteRating, getRatingsByProvider, getAverageRating, getRatingsByUser, getRatingForProvider } = require("../controller/ratingController");
const providerAuth = require("../middlewares/providerAuth");
const ratingRouter = express.Router();

ratingRouter.get('/provider',providerAuth, getRatingForProvider);
ratingRouter.use(userAuth);

ratingRouter.get('/user', getRatingsByUser);

ratingRouter.post('/', createRating);
ratingRouter.get('/', getAllRatings);
ratingRouter.get('/:id', getRatingById);
ratingRouter.put('/:id', updateRating);
ratingRouter.patch('/:id', deleteRating);
ratingRouter.get('/provider/:providerId', getRatingsByProvider);
ratingRouter.get('/provider/:providerId/average', getAverageRating);



module.exports = ratingRouter;