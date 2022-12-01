const mongoose = require('mongoose')

const citySchema = new mongoose.Schema({
    city:{
        type:String,
        required:true,
        unique:[true ,"please enter unique country name already Register"]
    },
    country:{
        type:String,
        required:true,
    }
})

module.exports= mongoose.model("Place",citySchema)