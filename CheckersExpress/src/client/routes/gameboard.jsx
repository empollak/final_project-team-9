import { useState, useEffect } from "react";
import "./gamestyle.css"
import { availableMoves, indexToPosition, positionToIndex, isLegalMove, tokenAt, makeMove } from "../../shared/GameController"
import { Token } from "../../shared/GameModel";
//game rendering

export default function GameBoard({ board, socket, player, setBoard }) {
    // selected = {row: #, col: #}
    const [selected, setSelected] = useState({});

    useEffect(() => {
        board.selected = selected;
    }, [selected])

    useEffect(() => {
        const winner = board.winner === "r" ? "Red" : "Black";
        // alert("Game Over, " + winner + " Wins!")
    }, [board.winner])

    socket.on("board", (boardState, currentPlayer, onlyMove) => {
        board.boardState = boardState.map((token) => {
            if (token) {
                return new Token(token.index, token.isMonarch, token.color);
            }
            return null;
        })
        board.currentPlayer = currentPlayer;
        board.onlyMove = onlyMove;
        if (onlyMove) {
            const pos = indexToPosition(onlyMove.index);
            setSelected({ row: pos[0], col: pos[1] });
        }
        console.log("Updated board state", boardState);
        console.log("board copy", board.copy());
        setBoard(board.copy());
    })

    const clickSquare = function (row, col) {
        console.log("Square Clicked:", row, col, "Index of Square:", positionToIndex(row, col), " current player ", board.currentPlayer, " i am player ", player);
        if (tokenAt(board, row, col)?.color === (board.currentPlayer) && board.currentPlayer == player) {
            console.log("only move ", indexToPosition(board.onlyMove?.index), " row col ", [row, col], " bool  ", indexToPosition(board.onlyMove?.index)[0] === row && indexToPosition(board.onlyMove?.index)[1] === col);

            // Check if there is a restriction on movement and, if there is, that the user has clicked on that tile
            if (board.onlyMove && !(indexToPosition(board.onlyMove?.index)[0] === row && indexToPosition(board.onlyMove?.index)[1] === col)) {
                console.log("Was not only move. Only move: ", board.onlyMove);
                return;
            }
            setSelected({ row, col });
            return;
        }

        // If the clicked square is a legal move, make the move
        if (isLegalMove(board, selected, [row, col])) {
            board = makeMove(board, tokenAt(board, selected.row, selected.col), [row, col]);
            socket.emit("makemove", { oldRow: selected.row, oldCol: selected.col, newRow: row, newCol: col });
            setSelected({})
            return;
        }

    }

    const squareColor = function (row, col) {
        // if (row === selected?.row && col === selected?.col) {
        //     return "#460075";
        // }
        if (isLegalMove(board, selected, [row, col])) {
            return "#008844";
        }
        const colOffset = row % 2;
        if ((col + colOffset) % 2 == 0) {
            // console.log("Setting color to purple for square:", row, col);
            return "#9066b0";
        }
        else {
            // console.log("Setting color to white for square:", row, col);
            return "#F1F1F1";
        }
    }

    // draw tokens
    return (
        <div id="game">
            {
                [...Array(8)].map((gridRow, rowIndex) => {
                    return <div className="row" key={"row:" + rowIndex} style={{}}>
                        {
                            [...Array(8)].map((gridCell, colIndex) => {
                                return <button className="square"
                                    key={"row:" + rowIndex + ",col:" + colIndex}
                                    onClick={() => clickSquare(rowIndex, colIndex)}
                                    style={{
                                        backgroundColor: squareColor(rowIndex, colIndex),
                                    }}>
                                    {tokenAt(board, rowIndex, colIndex) ?
                                        <img className="square"
                                            src={tokenAt(board, rowIndex, colIndex).imgSource()} /> : null}
                                </button>
                            })
                        }
                    </div>
                })
            }
        </div>

    )
}