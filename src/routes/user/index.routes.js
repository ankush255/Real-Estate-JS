const express = require("express");

const appRoute = express.Router();


const userRoute = require('./user.routes');
const favoriteRoutes = require("./favorite.routes");
const reviewRoutes = require("./review.routes");
const cartRoutes = require("./cart.routes");



appRoute.use("/user", userRoute);
appRoute.use("/favorite",favoriteRoutes);
appRoute.use("/review", reviewRoutes);
appRoute.use("/cart",cartRoutes);


module.exports = appRoute;