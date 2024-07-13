const express = require("express");
const cartRoutes = express.Router();

const {
    addNewCart,
    getAllCarts,
    updateCart,
    removeCart
} = require('../../controller/user/cart.controller');

const veriftToken = require("../../helper/verifyToken");



cartRoutes.post("/create", veriftToken, addNewCart);
cartRoutes.get("/get", veriftToken, getAllCarts);
cartRoutes.put("/update", veriftToken, updateCart);
cartRoutes.delete("/remove", veriftToken, removeCart);




module.exports = cartRoutes;