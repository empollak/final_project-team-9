import { useState, useEffect } from "react";
import "../styles/GameStyle.css"
import { availableMoves, indexToPosition, positionToIndex, isLegalMove, tokenAt, makeMove } from "../controllers/GameController"
//game rendering

export default function GameBoard({ board }) {

    const [selected, setSelected] = useState({});
    useEffect(() => {
        board.selected = selected;
    }, [selected])

    useEffect(()=>{
        const winner = board.winner == "r" ? "Red" : "Black";
        alert("Game Over, " + winner + " Wins!")
    }, [board.winner])

    const clickSquare = function (row, col) {
        console.log("Square Clicked:", row, col, "Index of Square:", positionToIndex(row, col))
        if (tokenAt(board, row, col)?.color === (board.currentPlayer)) {
            setSelected({ row, col });
            return;
        }

        // If the clicked square is a legal move, make the move
        if(isLegalMove(board, selected, [row, col])){
            board = makeMove(board, tokenAt(board, selected.row, selected.col), [row, col]);
            setSelected({})
            return;
        }
        
    }

    const squareColor = function (row, col) {
        // if (row === selected?.row && col === selected?.col) {
        //     return "#460075";
        // }
        if(isLegalMove(board, selected, [row, col])) {
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