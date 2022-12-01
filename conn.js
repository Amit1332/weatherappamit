const  mongoose = require('mongoose')

const db= mongoose.connect("mongodb://localhost:27017/weatherapp").then(()=>{
    console.log("connection successful");
}).catch(()=>{
    console.log("no Connection")
})
module.exports=db