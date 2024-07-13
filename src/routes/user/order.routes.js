const express = require('express');
const verifyToken = require("../../helper/verifyToken");
const orderRoutes = express.Router();

const{
    createNewOrder,
    getAllOrder,
    removeOrder
} = require('../../controller/user/order.controller');


orderRoutes.use(verifyToken);
orderRoutes.post('/create', createNewOrder);
orderRoutes.get('/show', getAllOrder);
orderRoutes.delete('/remove', removeOrder);


module.exports = orderRoutes;