const express = require("express");

const adminRoutes = express.Router();


const productRoutes = require("./product.routes");


adminRoutes.use("/product",productRoutes)


module.exports = adminRoutes;