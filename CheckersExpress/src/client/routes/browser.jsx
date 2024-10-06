import { Form, useLoaderData } from "react-router-dom"
import { useEffect } from "react";
import { useState } from "react";

export default function Browser() {
    const socket = useLoaderData();
    socket.emit("message", "hello");
    const [gameCode, setGameCode] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("joinGame", gameCode);
    };

    useEffect(() => {
        socket.on("gameJoined", ({ gameCode }) => {
            alert(`Successfully joined game: ${gameCode}`);
            // redirect to game room
        });

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
            <br></br>
            <Form method="post">
                <button type="submit">Log out</button>
            </Form>
        </>
    )
}
