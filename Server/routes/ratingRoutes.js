const express = require("express");
const userAuth = require("../middlewares/userAuth");
const { createRating, getAllRatings, getRatingById, updateRating, deleteRating, getRatingsByProvider, getAverageRating, getRatingsByUser } = require("../controller/ratingController");
const ratingRouter = express.Router();

ratingRouter.use(userAuth);

ratingRouter.post('/', createRating);
ratingRouter.get('/', getAllRatings);
ratingRouter.get('/:id', getRatingById);
ratingRouter.put('/:id', updateRating);
ratingRouter.patch('/:id', deleteRating);
ratingRouter.get('/provider/:providerId', getRatingsByProvider);
ratingRouter.get('/provider/:providerId/average', getAverageRating);
ratingRouter.get('/user', getRatingsByUser);


module.exports = ratingRouter;