const express = require('express')
const bodyParser= require('body-parser')
const ejs = require("ejs")
const axios =require('axios')
var weather = require('weather-js');
const db= require('./conn')
const cities = require('./models/city');
const { findOne } = require('./models/city');
const fs =require('fs')
const path = require("path")

const app =express()
app.use(express.json())

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')


function filterPhoto(req,file,cb){
   if(file.mimetype==='image/png' ||file.mimetype==='image/jpg' ||file.mimetype==='image/jpeg' ||file.mimetype==='image/svg'){
      cb(null,true)
   }
   else{
      cb(new Error("gaand marao"))
   }
}
// multer upload photo
const multer = require('multer')
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, './photo')
   },
   filename: function (req, file, cb) {
     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + file.originalname
     cb(null, file.fieldname + '-' + uniqueSuffix)
   }
 })
 
 const upload = multer({ storage: storage, filterPhoto:filterPhoto })


 app.get('/',(req,res)=>{
    let city = req.query.city
    let country = req.query.country
    weather.find({search: `${city} ,${country}`, degreeType: 'C'}, function(err, result) {
        if(err) console.log(err);
         
       const degreeC= JSON.stringify(result[0], null, 2);
       const parseData= JSON.parse(degreeC)
        res.render('index', {parseData})
        // console.log(parseData)
        
    }) 
          
 })  
 
 app.get('/addplace', async (req,res)=>{
    res.render('addPlace')
 
 })
 app.get('/upload',(req,res)=>{
   const pp = path.join(__dirname,"/photo");
   fs.readdir(`${pp}`, (err,data)=>{ 
    res.render('photo', {photo:data})
   
    })
 })
 app.post('/upload', upload.array('photo',10),async (req,res)=>{
 
})
 app.get('/filter/async/:city', async (req,res)=>{
    const existcity = await cities.findOne({city:req.params.city})
    console.log(existcity); 
    if(existcity){
         res.json(existcity);
        }else{
            res.json(false)
        }
 
 })
 
 app.post("/addplace", async(req,res)=>{
    const place = {
        city:req.body.city,
        country:req.body.country
     }

     const existcity = await cities.findOne({city:req.body.city})
     if(!existcity){
        const createPlace  = await cities.create(place)
        res.json(true);
     }else{
        res.json(false);
     }
     
    
 })
 
   

app.listen(8000, ()=>{
    console.log("server is running")

})


