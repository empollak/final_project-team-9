import { Form, Outlet, useLoaderData, useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { useState } from "react";
import LogoutButton from "../LogoutButton";
import Game from "./game";
import GameBoard from "./gameboard";
import Leaderboard from "./leaderboard";
import { Board } from "../../shared/GameModel";

export default function Browser() {
    const socket = useLoaderData().io;
    const username = useLoaderData().data.username;
    const navigate = useNavigate();
    // const navigate = useNavigate();
    const [gameCode, setGameCode] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [gameJoined, setGameJoined] = useState(false);
    const [gameOverReason, setGameOverReason] = useState("");
    const [board, setBoard] = useState(new Board());
    const [player, setPlayer] = useState("");
    // const board = new Board();


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Joining game ", gameCode, "username", username);
        socket.emit("joinGame", gameCode, username);
    };

    const createGame = (e) => {
        e.preventDefault();
        console.log("Creating game");
        socket.emit("createGame", username)
    }

    const backToBrowser = (e) => {
        e.preventDefault();
        console.log("Back to browser!");
        setGameStarted(false);
        setGameOverReason("");
        setGameJoined(false);
        setGameCode("");
        // Get it to refresh the data
        navigate("/browser");
    }

    useEffect(() => {
        socket.on("gameJoined", (gameCode) => {
            // Joined the game!
            setGameJoined(true);
            setGameCode(gameCode);
            setBoard(new Board(gameCode));
        });

        socket.on("gameStarted", (player) => {
            console.log("Game started! I am player ", player);
            setPlayer(player);
            setGameStarted(true);
        })

        socket.on("gameJoinError", (gameCode, reason) => {
            alert(`Could not join game ${gameCode}. ${reason}`);
            // alert(`Game ${gameCode} is full. Please try another game code.`);
        });

        socket.on("alreadyInGame", () => {
            alert("You are already in this game!");
        })

        socket.on("gameOver", (reason) => {
            setGameOverReason(reason);
        });

        return () => {
            socket.off("gameJoined");
            socket.off("gameFull");
            socket.off("gameOver");
            socket.off("gameStarted");
            socket.off("alreadyInGame");
            socket.off("gameJoinError");
        };
    }, [socket]);

    return (
        <>
            <LogoutButton socket={socket}></LogoutButton>
            {gameOverReason ?
                <>
                    <h1>{gameOverReason}</h1>
                    <button onClick={backToBrowser}>Back to browser</button>
                </> :
                !gameJoined ? <>
                    <h1>Welcome to Checkers!</h1>
                    <button onClick={createGame}>Create Game</button>
                    <h2>Enter a game code to join:</h2>
                    <Form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Game code"
                            value={gameCode}
                            onChange={(e) => setGameCode(e.target.value)}
                        />
                        <button type="submit">Submit</button>
                    </Form>
                    <br />
                    <h2>Leaderboard</h2>
                    <Leaderboard />

                    <br></br></> :
                    gameStarted ? <GameBoard board={board} socket={socket} setBoard={setBoard} player={player} /> : <h1>Waiting for opponent. Game Code: {gameCode}</h1>}

        </>
    )
}
