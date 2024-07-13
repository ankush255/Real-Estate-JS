const express = require('express');

const reviewRoutes = express.Router();

const verifyToken = require('../../helper/verifyToken');

const {
    addReview,
    getAllReview,
    getReview,
    updateReview,
    deleteReview
} = require('../../controller/user/review.controller');

reviewRoutes.post('/add', verifyToken, addReview);
reviewRoutes.get('/getAll', verifyToken, getAllReview);
reviewRoutes.get('/getSingle', verifyToken, getReview);
reviewRoutes.put('/update', verifyToken, updateReview);
reviewRoutes.delete('/delete', verifyToken, deleteReview);

module.exports = reviewRoutes;