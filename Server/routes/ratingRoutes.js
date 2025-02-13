const express = require("express");
const userAuth = require("../middlewares/userAuth");
const { createRating, getAllRatings, getRatingById, updateRating, deleteRating, getRatingsByProvider } = require("../controller/ratingController");
const ratingRouter = express.Router();

ratingRouter.use(userAuth);

ratingRouter.post('/ratings', createRating);
ratingRouter.get('/ratings', getAllRatings);
ratingRouter.get('/ratings/:id', getRatingById);
ratingRouter.put('/ratings/:id', updateRating);
ratingRouter.patch('/ratings/:id', deleteRating);
ratingRouter.get('/ratings/provider/:providerId', getRatingsByProvider);
ratingRouter.get('/ratings/provider/:providerId/average', ratingController.getAverageRating);
ratingRouter.get('/ratings/user/:userId', ratingController.getRatingsByUser);


module.exports = ratingRouter;