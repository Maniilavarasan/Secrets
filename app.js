require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true, useUnifiedTopology: true });
const userSchema = mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedField:['password'], excludeFromEncryption: ['email']});

const User = new mongoose.model("user", userSchema);

app.get("/", function(req,res){
  res.render("home");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  const newUser = new User({
    email : req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      res.send("Oops, registration failed, please try again!")
    }
  })

});

app.get("/login", function(req,res){
  res.render("login");
});

app.post("/login", function(req,res){
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email: userName}, function(err, foundItem){
    if(err){
      console.log(err);
    }else{
      if(foundItem){
        if(foundItem.password === password){
          res.render("secrets");
        }else{
          console.log("Incorrect Username or Password");
        }
      }
    }
  })
})











app.listen(3000, function(){
  console.log("Server started Successfully");
})
