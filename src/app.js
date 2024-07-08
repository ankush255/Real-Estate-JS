require('dotenv').config();
const express = require("express");
const server = express();
const cors = require('cors');
const morgan = require("morgan");
const mongoose = require("mongoose");
const port = process.env.PORT;

const path = require('path');
const filePath = path.join(__dirname,'image');




// Database Connection ( DB )
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB is Connected..."))
    .catch((error) => console.log(error));





// Middleware

server.use(cors());

server.use(express.json());
server.use(morgan('dev'));





// Image Routes

server.use("/src/image", express.static(filePath));




// Admin Routes

const adminRoutes = require("./routes/admin/index.routes");
server.use("/api/admin",adminRoutes);




// App Routes

const appRoute = require("./routes/user/index.routes");
server.use("/api/app",appRoute);







// Server

server.listen(port,()=>{
    console.log("Server Start........");
})
