const express = require('express');
const app = express();
const layouts = require('express-ejs-layouts');
//TODO:remove fs and use sequelize instead
const db = require('./models');
const port = 3000;
const methodOverride = require('method-override'); //NEW for method override


app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.static(__dirname + '/static'))
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method')); //NEW middleware where post will change

app.get('/', function(req, res) {
    res.render('index')
})


//GET /dinosaurs--READ ALL--index route
app.get('/dinosaurs', function(req, res) {
    //TODO: remove file system stuff and use sequelize functions
    db.dinosaur.findAll().then(function(dinosaurs) {
        res.render('dinos/index', {dinosaurs});
    });
})

//GET/ dinosaurs/new - serve up our NEW dino form--dont change
app.get('/dinosaurs/new', function(req, res){
    res.render('dinos/new')
  });


//GET/ dinosaurs/:id/EDIT - serve up our EDIT dino form
app.get('/dinosaurs/:id/edit', function(req, res){
   db.dinosaur.findByPk(parseInt(req.params.id)).then(function(dinosaur) {
       res.render('dinos/edit', {dinosaur});
   });
   
   
    // var dinosaurs = fs.readFileSync ('./dinosaurs.json');
    // var dinoData = JSON.parse(dinosaurs);
    // var id = parseInt(req.params.id);
    // res.render('dinos/edit', {dinosaurs: dinoData[id], id});
   
});
  


//GET /dinosaurs/:id -show route - gets ONE dino
app.get('/dinosaurs/:id', function(req, res) {
    // db.dinosaur.findOne({
    //     where: {id: parseInt(req.params.name)}
    // }).then(function(dinosaur) {
    //     res.render('dinos/show', {dinosaur});
    // });
    db.dinosaur.findByPk(parseInt(req.params.id)).then(function(dinosaur) {
        res.render('dinos/show', {dinosaur});
    });
    //res.render('dinos/show', {dinosaur: dinoData[id], id}); //NEW
    //console.log(dinoData);
});


//POST /dinosaurs
app.post('/dinosaurs', function(req, res) {
    
    var newDino = {
        type: req.body.dinosaurType,
        name: req.body.dinosaurName
    }
    db.dinosaur.create(newDino)
    .then(function(dinosaur) {
        res.redirect('/dinosaurs');
    });
});
    //db.dinosaur.create({
        //     name: req.body.name,
        //     type: req.body.type
        // }).then(function(dinosaur) {
        //     //res.render('dinos/new', {dinosaurs});
        //     res.redirect('/new');
        // });
    //read in our JSON file
    //var dinosaurs = fs.readFileSync('./dinosaurs.json');
    //convert it to an array
    //var dinoData = JSON.parse(dinosaurs);
    //push it to an array
    // dinoData.push(newDino);//use sequesize functions
    // //write the array back to the file
    // fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData));

   //res.redirect('/dinosaurs');


//DELETE
app.delete('/dinosaurs/:id', function(req,res) {
    db.dinosaur.destroy({
        where: {id: parseInt(req.params.id)}
    }).then(function(data) {
        res.redirect('/dinosaurs');
    });
})
    // //read the data from the file
    // var dinosaurs = fs.readFileSync('./dinosaurs.json');
    // //Parse the data into an object
    // var dinoData = JSON.parse(dinosaurs);
    // //Splice out the item at the specified index
    // var id = parseInt(req.params.id);
    // dinoData.splice(id, 1);
    // //Stringify the object
    // var dinoString = JSON.stringify(dinoData);
    // //write the object back to the file
    // fs.writeFileSync('./dinosaurs.json', dinoString);
    // //redirect to main

//PUT 
app.put('/dinosaurs/:id', function(req, res) {
    db.dinosaur.update({
        name: req.body.dinosaurName,
        type:req.body.dinosaurType

    }, {
        where: {id: parseInt(req.params.id)}
    }).then(function(dinosaur) {
        res.redirect('/dinosaurs/' + req.params.id)
    });
});
    // var dinosaurs = fs.readFileSync('./dinosaurs.json');
    // var dinoData = JSON.parse(dinosaurs);
    // var id = parseInt(req.params.id);
    // dinoData[id].name = req.body.dinosaurName;
    // dinoData[id].type = req.body.dinosaurType;
    // fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData));
    //res.redirect('/dinosaurs/' + id);

app.listen(port);