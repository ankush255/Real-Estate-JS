const express = require("express");
const userRoutes = express.Router();

const upload = require('../../helper/imageUpload');


const {
        registerUser,
        loginUser,
        getProfile,
        getAllUser,
        updateProfile,
        changePassword,
        deleteUser
} = require("../../controller/user/user.controller");


const verifyToken = require("../../helper/verifyToken");




userRoutes.post("/register", upload.single('profileImage'), registerUser);

userRoutes.post("/login", loginUser);

userRoutes.get("/profile",verifyToken, getProfile);

userRoutes.get("/allprofile",verifyToken, getAllUser);

userRoutes.put("/update",verifyToken, updateProfile);

userRoutes.put("/Change-Password",verifyToken, changePassword);

userRoutes.delete("/delete",verifyToken, deleteUser);


module.exports = userRoutes;