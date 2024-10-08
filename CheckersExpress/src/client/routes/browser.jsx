import { Form, Outlet, useLoaderData, useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { useState } from "react";
import LogoutButton from "../LogoutButton";
import Game from "./game";
import Leaderboard from "./leaderboard";

export default function Browser() {
    const socket = useLoaderData().io;
    // const navigate = useNavigate();
    const [gameCode, setGameCode] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [gameJoined, setGameJoined] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Joining game ", gameCode);
        socket.emit("joinGame", gameCode);
    };

    useEffect(() => {
        socket.on("gameJoined", (gameCode) => {
            // alert(`Successfully joined game: ${gameCode}`);

            // Give the game the socket and game code
            setGameJoined(true);
            setGameCode(gameCode);
            // navigate("/game", { state: { gameCode: gameCode } });
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

                <br></br></> : <Game socket={socket} gameStarted={gameStarted} gameCode={gameCode} setGameJoined={setGameJoined} setGameStarted={setGameStarted} />}

        </>
    )
}
