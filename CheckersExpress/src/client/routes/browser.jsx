import { Form, Outlet, useLoaderData, useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { useState } from "react";
import LogoutButton from "../LogoutButton";
import Game from "./game";
import GameBoard from "./GameView";
import Leaderboard from "./leaderboard";
import { Board } from "../../shared/GameModel";

export default function Browser() {
    const socket = useLoaderData().io;
    // const navigate = useNavigate();
    const [gameCode, setGameCode] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [gameJoined, setGameJoined] = useState(false);
    const board = new Board();


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Joining game ", gameCode);
        socket.emit("joinGame", gameCode);
    };

    useEffect(() => {
        socket.on("gameJoined", (gameCode) => {
            // Joined the game!
            setGameJoined(true);
            setGameCode(gameCode);
        });

        socket.on("gameStarted", () => {
            console.log("Game started!");
            setGameStarted(true);
        })

        socket.on("gameFull", ({ gameCode }) => {
            alert(`Game ${gameCode} is full. Please try another game code.`);
        });

        return () => {
            socket.off("gameJoined");
            socket.off("gameFull");
        };
    }, [socket]);

    return (
        <>
            <LogoutButton socket={socket}></LogoutButton>
            {!gameJoined ? <>
                <h1>Welcome to Checkers!</h1>
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

                <br></br></> : <GameBoard board={board} />}

        </>
    )
}
