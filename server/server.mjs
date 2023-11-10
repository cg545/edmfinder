import 'path';

//connect to MongoDB
import db from './db/conn.mjs';

import { ObjectId } from 'mongodb';

import ExpressValidator from "express-validator";
import express from 'express';
import cors from 'cors';

const port = 8080;
const app = express();

//auth
import md5 from 'md5';
import jsonwebtoken from 'jsonwebtoken';

function validateMail(input) {
  var validRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (input.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}

function validateUsername(input) {
  var validRegex = /^[a-zA-Z0-9_\.]+$/i;
  if (input.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}

app.use(
  express.json(),
  cors()
);

app.get('/', (req, res) => res.send('Hello from EDM Finder!'));

/**
 * Routes
 */

/**
 * Login: checks data, finds user, compares password, gives 24hr token.
 */
app.post("/api/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!(email && password)) {
      res.status(400).send("Missing login details.");
    } else {
      let collection = db.collection("users");
      let user = await collection.findOne({ "email": email });
      if (!user) {
        return res.status(200).send("Invalid password.");
      }
      if (user.password === md5(password)) {
        const token = jsonwebtoken.sign(
          { email: user.email },
          "edmfindertoken",
          { expiresIn: "24h", }
        );
        collection.updateOne(
          { "email": user.email },
          { $set: { "token": token } }
        );

      } else {
        return res.status(200).send("Invalid password.");
      }
      let sendUser = await collection.findOne({ "email": email });
      return res.status(200).send({ token: sendUser.token, username: sendUser.username, email: sendUser.email });
    }
  } catch (err) {
    console.log(err);
  }
});

/**
 * AffirmLogin: checks if token exists, if so, responds with username/email
 */
app.post("/api/affirmLogin", async (req, res) => {
  try {
    const token = req.body.token;
    let collection = db.collection("users");
    let user = await collection.findOne({ "token": token });
    if (user) {
      return res.status(200).send({ username: user.username, email: user.email });
    } else {
      return res.status(400).send("Invalid token.");
    }

  } catch (err) {
    console.log(err);
  }
});

/**
 * Register: takes input from client, validates it, checks for existing users, pushes new user to db, responds with success message/errors.
 */
app.post("/api/register", async (req, res) => {
  try {
    var email = req.body.email;
    var username = req.body.username;
    var password1 = req.body.password1;
    var password2 = req.body.password2;
    var locState = req.body.locState;
    //validate email
    if (validateMail(email) == false) {
      var goodEmail = false;
    } else {
      var goodEmail = true;
    }
    //validate username
    if (validateUsername(username) == false) { //TODO = true if no bad characters
      var goodUsername = false;
    } else {
      var goodUsername = true;
    }
    //validate password
    if (password1 != password2 || password1 == "" || password2 == "") {
      var goodPassword = false;
    } else {
      var goodPassword = true;
    }
    //validate locState
    if (locState == "") {
      var goodLoc = false;
    } else {
      var goodLoc = true;
    }
    //if problems, send response telling them
    if (goodEmail == false || goodUsername == false || goodPassword == false || goodLoc == false) {
      return res.status(200).send({ message: "Error", noEmail: goodEmail, noUsername: goodUsername, badPasswords: goodPassword, noLocationMessage: goodLoc });
    }
    //now check if the username or email exists in the database, if so, send response
    let collection = db.collection("users");
    let userUsername = await collection.findOne({ "username": username });
    let userEmail = await collection.findOne({ "email": email });
    if (userUsername && userEmail) {
      var goodUsername = false;
      var goodEmail = false;
      return res.status(200).send({ message: "Error", noEmail: goodEmail, noUsername: goodUsername, badPasswords: goodPassword, noLocationMessage: goodLoc });
    } else if (userUsername) {
      var goodUsername = false;
      return res.status(200).send({ message: "Error", noEmail: goodEmail, noUsername: goodUsername, badPasswords: goodPassword, noLocationMessage: goodLoc });
    } else if (userEmail) {
      var goodEmail = false;
      return res.status(200).send({ message: "Error", noEmail: goodEmail, noUsername: goodUsername, badPasswords: goodPassword, noLocationMessage: goodLoc });
    } else {
      //get date
      var currentDate = new Date(new Date().getTime());
      var currentYear = currentDate.getFullYear();
      var currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
      var currentDay = ("0" + currentDate.getDate()).slice(-2);
      //create account
      collection.insertOne(
        {
          username: username.toLowerCase(),
          email: email,
          password: md5(password1),
          token: "",
          profile_picture_url: "/defaultphoto.png",
          state: locState,
          bio: "User since " + currentYear + "-" + currentMonth + "-" + currentDay + "."
        }
      );
      //send positive response
      return res.status(200).send({ message: "You have succesfully registered your account!" });
    }
  } catch (err) {
    console.log(err);
  }
})

/**
 * getUser: based on URL param, gets info for user
 */
app.get("/api/getUser/:user", async (req, res) => {
  try {
    let collection = db.collection("users");
    var theUser = await collection.findOne({
      username: req.params.user
    });
    if (theUser) {
      return res.status(200).send({ username: theUser.username, profile_picture_url: theUser.profile_picture_url, state: theUser.state, bio: theUser.bio });
    } else {
      return res.status(400).send("Invalid username.");
    }

  } catch (err) {
    console.log(err);
  }
});

/**
 * loadComments: gets comments for event id and sends them back as an array
 */
app.get("/api/loadComments/:commentId", async (req, res) => {
  let collection = db.collection("comments");
  var results = await collection.find({
    eventId: parseInt(req.params.commentId)
  }).toArray();
  console.log(results);
  return res.status(200).send(results);
});

/**
 * End routes
 */

// 404
app.use(function (req, res, next) {
  return res.status(404).json({ message: 'resource ' + req.url + ' not found' });
});

// 500 - Any server error
app.use(function (err, req, res, next) {
  return res.status(500).json({ error: err });
});

app.listen(port, () => console.log(`API listening on port ${port}!`));

