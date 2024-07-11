const mongoose = require("mongoose");



const productSchema = mongoose.Schema({
    title : {
        type: String,
    },
    time : {
        type : String
    },
    rant_price : {
        type: Number
    },
    rating : {
        type: Number
    },
    product_image : {
        type: String
    },
    services : {
        type: String
    },
    address : {
        type: String
    },
    isDelete:{
        type: Boolean,
        default: false,
    }
},{
    versionKey: false
});




module.exports = mongoose.model('products',productSchema);