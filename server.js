/*********************************************************************************

WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Vansh Rana
Student ID: 169672219 
Date: 2 June 2023
Cyclic Web App URL: https://comfortable-mite-pocketbook.cyclic.app
GitHub Repository URL: https://github.com/Vanshrana01/Assignment2.git

********************************************************************************/ 

const express = require('express')
const store_service = require('./store-service')
const app = express()
const port = process.env.PORT || 8080
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const upload = multer();


app.use(express.static('public')); 
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.redirect("/about")
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + "/views/about.html")
  });

app.get('/shop', (req, res) => {
  store_service.getPublishedItems().then((data)=>{
    res.json(data)
  }).catch((err)=>{
    return {'message': err}
  })
});

app.get('/items', (req, res) => {
  store_service.getAllItems().then((data)=>{
    res.json(data)
  }).catch((err)=>{
    return {'message': err}
  })
});

app.get('/categories', (req, res) => {
    store_service.getCategories().then((data)=>{
      res.json(data)
    }).catch((err)=>{
      return {'message': err}
    })
  });

  app.get('/items/add', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'addItem.html');
    res.sendFile(filePath);
  });

  app.get('*', function(req, res){
    res.send('Page not found, check URL', 404);
  });



function onHTTPstart(){
  console.log("server started on port: " + port)
}

store_service.initialize().then(function(){
  app.listen(port,onHTTPstart);
}).catch(function(err){
  console.log("unable to start" + err)
})


app.use((req,res)=>{
  res.status(404).send("Page does not exist")
})

cloudinary.config({
  cloud_name: 'dzvfunw68',
  api_key: '988669558532177',
  api_secret: 'RQeeOL7uaN_6cTGIWSHX3sMz_CE',
  secure: true
});






