import 'dotenv/config';
import ViteExpress from "vite-express";
import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cookie from "cookie-session";
import compression from "compression";
import { Server } from "socket.io";
import { createServer } from 'http';
import bcrypt from 'bcrypt';

const app = express();
const server = createServer(app);
const io = new Server(server);
const saltRounds = 10;

app.use(compression());
app.use(express.json());

// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use(express.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.MONGOUSER}:${process.env.PASS}@${process.env.HOST}`; //change back to server for push
console.log(uri);
const client = new MongoClient(uri);

// cookie middleware
app.use(
  cookie({
    name: "session",
    keys: ["NMGwPsSJoXMuG3PMMlLaRovinvxfg9k5", "eZUaeH4PboBbTzGpAHTmrCIXV6tZRHHz"], // hardcoded :P
  })
);

try {
  await client.connect();
  console.log("Connected to MongoDB");
} catch (err) {
  console.error("Connection error", err);
}

app.post("/register", async (req, res) => {
  console.log("got request");
  const { username, password } = req.body;

  async function registerUser() {
    try {
      const authnDB = client.db("checkers").collection("users");
      const hashedPassword = await bcrypt.hash(password, saltRounds);

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
  console.log("got login request for user ", username, " pw ", password);
  async function authenticate() {
    try {
      const authnDB = client.db("checkers").collection("users");
      const user = await authnDB.findOne({ username: username });
      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          req.session.login = true;
          req.session.userId = user._id.toString();
          res.status(201).send(); // correct credentials
        } else {
          console.log("Incorrect credentials");
          res.status(401).send(); // incorrect credentials
        }
      } else {
        console.log("Incorrect credentials"); // we shan't be overly informative with error messages for security reasons
        res.status(401).send(); // user not found
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  }

  authenticate();
});

// middleware that always sends unauthenicated users to the login page
const requireAuth = (req, res, next) => {
  if (req.session.login) {
    next();
  } else {
    console.log("requireAuth caught unauthorized user");
    res.status(401).send("Not authorized");
  }
};


app.post("/logout", requireAuth, (req, res) => {
  req.session = null;
  console.log("User logged out");
  res.status(401).send("Logged out");
});

app.get("/data", requireAuth, (req, res) => {
  res.status(200).send();
})

const games = {}; // hold all our games

io.on('connection', (socket) => {
  socket.on("joinGame", (msg) => {
    let gameCode = msg;
    console.log("got joinGame request from id ", socket.id, " code ", gameCode);
    // if game not full, make a new game
    if (!games[gameCode]) {
      games[gameCode] = { players: [], maxPlayers: 2 };
    }

    // if less than two players, join game
    if (games[gameCode].players.length < games[gameCode].maxPlayers) {
      games[gameCode].players.push(socket.id);
      socket.gameCode = gameCode; // legal?

      // tell user they successfully joined
      socket.join(gameCode);
      socket.emit("gameJoined", gameCode);

      // Start the game if it is full!
      if (games[gameCode].players.length == games[gameCode].maxPlayers) {
        console.log("Starting game! ", gameCode);
        io.to(gameCode).emit("gameStarted");
      }
    } else {
      // tell user the game is full
      socket.emit("gameFull", { gameCode });
      console.log(`Game ${gameCode} is full`);
    }
  })

  // Rebrodcast count update to relevant sockets (except the one it came from)
  socket.on("count", (gameCode, count) => {
    socket.to(gameCode).emit("count", count);
  })

  socket.on("disconnect", () => {
    let gameCode = socket.gameCode;
    console.log("Handling disconnect, gameCode", gameCode);
    if (gameCode) {
      const index = games[gameCode].players.indexOf(socket.id);
      if (index > -1) {
        socket.leave(gameCode);
        io.to(gameCode).emit("gameOver", "Other user disconnected");
        delete games[gameCode];
        console.log("Player left game ", gameCode);
      } else {
        console.log("Player id ", socket.id, " attempted to leave game they were not in ", gameCode);
      }
    }
  })
  console.log('a user connected');
});

io.on("disconnect", (socket) => {
  console.log('user disconnected', socket.id);
  // handle disconnection
});

server.listen(3000, () =>
  console.log("Server is listening on port 3000..."),
);

ViteExpress.bind(app, server);