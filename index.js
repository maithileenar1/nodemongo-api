const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const sectretkey = "Maithilee_dolharkar";
const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/myfirstdatabase");
const con = mongoose.connection;

con.once("open", function () {
  console.log("Connected successfully");
});
con.on("error", function (err) {
  console.log(err);
});

var userSchema = new mongoose.Schema({
  name: String,
  password: String,
  lastname: String,
  email: String,
  height: Number,
  weight: Number,
  dob: String,
  language: String,
  preferences: {
    size: String,
    genre: String,
    techstack: [String],
    foodhabits: String,
  },
  token: String,
});

var userModel = mongoose.model("mydatabase", userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/login", function (req, res) {
  console.log("loginpage");
  res.status(200).send("<h1>dataextracted</h1>");
});

app.post("/verify", function (req, res) {
  let count = userModel.count(
    {
      email: req.body.email,
      password: req.body.password,
    },
    function (err, count) {
      console.log(count);
      if (count == 1) {
        let token = jwt.sign(
          {
            email: req.body.email,
            password: req.body.password,
          },
          sectretkey
        );
        console.log("updating token value for user");
        userModel.findOneAndUpdate(
          { email: req.body.email },
          { $set: { token: token } },
          null,
          (err, res) => {
            console.log(err);
          }
        );
        res.status(200).json({
          status: "success",
          token: token,
        });
      } else {
        res.status(400).send("you have not logged in");
      }
    }
  );
});

app.post("/register", function (req, res) {
  console.log("inserting new user data in database: ", req.body);
  const Datainsert = new userModel({
    name: req.body.firstName,
    lastname: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    height: null,
    weight: null,
    dob: null,
    language: null,
    preferences: {
      techstack: [],
      genre: "Thriller",
      size: "Medium",
      foodhabits: "Indian",
    },
    token: null,
  });
  Datainsert.save();
});

app.post("/changePreferences", function (req, res) {
  userModel.findOneAndUpdate(
    { token: req.body.token },
    {
      $set: {
        preferences: {
          techstack: req.body.techstack,
          genre: req.body.genre,
          size: req.body.size,
          foodhabits: req.body.foodhabits,
        },
      },
    },
    null,
    (err, res) => {
      console.log(err);
    }
  );
});

app.post("/changeProfile", function (req, res) {
  userModel.findOneAndUpdate(
    { token: req.body.token },
    {
      $set: {
        weight: req.body.weight,
        height: req.body.height,
        dob: req.body.dob,
        language: req.body.language,
      },
    },
    null,
    (err, res) => {
      console.log(err);
    }
  );
});

console.log("starting application");

app.listen(4000);
