const { urlencoded } = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const url = 'mongodb://localhost/myfirstdatabase'
const jwt = require('jsonwebtoken');
const sectretkey = "Maithilee_dolharkar";
const app = express()
const db = mongoose.connect(url)
const con = mongoose.connection
con.on('open',function()
{
    console.log('Connected successfully');
})
var userSchema = new mongoose.Schema({name:String,password:String,lastname:String,email:String,
    preferences:{
  size:String , technology : [String] ,foodhabits : String
    }
});
var userModel=mongoose.model('mydatabase',userSchema);
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/login',function(req,res){
console.log("loginpage");
res.status(200).send("<h1>dataextracted</h1>");
})

app.post('/verify',function(req,res){

    let count = userModel.count({
       
        email : req.body.email,
        password : req.body.password,
       
    },function(err,count)
    {
        console.log(count);
        if(count==1){
            res.status(200).json({
                status:"success",
                token: jwt.sign( 
                    {
                        email:req.body.email,
                        password:req.body.password,

                    },
                    sectretkey
                )
            });
        }
        else{
            res.status(400).send("you have not logged in");
        }
    })
})
app.post('/register',function(req,res){
    const Datainsert = new userModel ({
                name : req.body.name,
                email : req.body.email,
                password : req.body.password,
                lastname : req.body.lastname,
                preferences:{
                    technology:[],
                    size:"M",
                    foodhabits:"veg"

                }
                
            })
            Datainsert.save();
        
})
app.post('/change',function(req,res){
   userModel.findOneAndUpdate(
    {
         email : req.body.email

    },
    {
        preferences :{
            technology : req.body.technology,
           size: req.body.size,
          foodhabits : req.body.foodhabits

        }
    }
   )
})
app.listen(4000);
