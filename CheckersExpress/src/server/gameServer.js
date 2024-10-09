// import { app, io, server } from "./main"
import { availableMoves, indexToPosition, positionToIndex, isLegalMove, tokenAt, makeMove } from "../shared/GameController.js"
import { Token, Board } from "../shared/GameModel.js"

export default function ioHandler(io) {
  const games = {}; // hold all our games
  io.on('connection', (socket) => {

    console.log('A user connected to the socket');

    // Game Joining
    socket.on("joinGame", (msg) => {
      let gameCode = msg;
      console.log("JoinGame request from id", socket.id, "and game code", gameCode);
      // if game not full, make a new game
      if (!games[gameCode]) {
        games[gameCode] = { players: [], maxPlayers: 2, board: new Board() };
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
          console.log("Starting game", gameCode);
          // Tell the other player they are red
          socket.to(gameCode).emit("gameStarted", "r");
          socket.emit("gameStarted", "b");
        }
      } else {
        // tell user the game is full
        socket.emit("gameFull", { gameCode });
        console.log(`Game ${gameCode} is full`);
      }
    });

    // Rebrodcast count update to relevant sockets (except the one it came from)
    socket.on("count", (gameCode, count) => {
      socket.to(gameCode).emit("count", count);
    });


    socket.on("disconnect", () => {
      let gameCode = socket.gameCode;
      console.log("Handling disconnect, gameCode", gameCode);
      if (gameCode && games[gameCode]) {
        const index = games[gameCode].players.indexOf(socket.id);
        if (index > -1) {
          socket.leave(gameCode);
          io.to(gameCode).emit("gameOver", "Other user disconnected");
          delete games[gameCode];
          console.log("Player left game ", gameCode);
        } else {
          console.log("Player id", socket.id, "attempted to leave game they were not in ", gameCode);
        }
      }
    });

    socket.on("gameboard", () => {
      // Send full game board on request
      let gameCode = socket.gameCode;
      socket.emit("board", games[gameCode].board.boardState, games[gameCode].board.currentPlayer);
    });

    socket.on("makemove", (msg) => {
      let gameCode = socket.gameCode;
      console.log("got makemove", msg);
      // When sent a move, update the board and send new board accordingly
      const token = tokenAt(games[gameCode].board, msg.oldRow, msg.oldCol);
      if (token) {
        games[gameCode].board = makeMove(games[gameCode].board, token, [msg.newRow, msg.newCol]);
      } else {
        console.log("Move selected an invalid piece");
      }

      console.log("Sending board for game ", gameCode);
      io.to(gameCode).emit("board", games[gameCode].board.boardState, games[gameCode].board.currentPlayer);

      // OR, for lazy impl
      // io.to(gameCode).emit(msg)
    });
  });

}