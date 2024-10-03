import 'dotenv/config';
import ViteExpress from "vite-express";
import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cookie from "cookie-session";
import compression from "compression";
// const express = require("express"),
//   { MongoClient, ObjectId } = require("mongodb"),
//   cookie = require("cookie-session"),
//   app = express(),
//   compression = require("compression");

const app = express();

app.use(compression());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "." });
});

app.get("/browser.html", (req, res) => {
  res.sendFile("browser .html", { root: "." });
});

// app.use(express.static("."));


// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use(express.urlencoded({ extended: true }));


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri);
console.log(uri);

// cookie middleware! The keys are used for encryption and should be
// changed
app.use(
  cookie({
    name: "session",
    keys: ["key1", "key2"],
  })
);


app.post("/register", async (req, res) => {
  console.log("got request");
  const { username, password } = req.body;

  async function registerUser() {
    try {
      const authnDB = client.db("checkers").collection("users");
      const hashedPassword = password; //come back and hash this

      const result = await authnDB.insertOne({
        username: username,
        password: hashedPassword,
      });

      res.status(201).send("User registered successfully.");
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).send("Registration error.");
    }
  }

  registerUser();
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  async function authenticate() {
    try {
      const authnDB = client.db("checkers").collection("users");
      const user = await authnDB.findOne({ username: username });
      if (user && password === user.password) {
        req.session.login = true;
        req.session.userId = user._id.toString();
        res.redirect("/browser.html");
      } else {
        console.log("Incorrect credentials");
        res.redirect("/index.html");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  }

  authenticate();
});

// add some middleware that always sends unauthenicaetd users to the login page
const requireAuth = (req, res, next) => {
  if (req.session.login) {
    next();
  } else {
    res.redirect("/index.html");
  }
};


app.post("/logout", requireAuth, (req, res) => {
  req.session = null;
  console.log("User logged out");
  res.redirect("/index.html");
});



ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
