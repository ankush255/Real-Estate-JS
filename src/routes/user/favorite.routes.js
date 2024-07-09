const express = require("express");
const favoriteRoutes = express.Router();
const verifyToken  = require("../../helper/verifyToken");

const {
  addNewFavorite,
  deleteFavorite,
  getAllFavorite,
} = require("../../controller/user/favorite.controller");

favoriteRoutes.post("/create", verifyToken, addNewFavorite);

favoriteRoutes.get("/getAll", verifyToken, getAllFavorite);

favoriteRoutes.delete("/delete", verifyToken, deleteFavorite);

module.exports = favoriteRoutes;
