import { useState, useEffect } from "react";
import "../styles/GameStyle.css"
import { availableMoves, indexToPosition, positionToIndex, tokenAt } from "../controllers/GameController"
//game rendering

export default function GameBoard({ board }) {

    const [selected, setSelected] = useState({});
    useEffect(() => {
        board.selected = selected;
    }, [selected])

    const clickSquare = function (row, col) {
        console.log("Square Clicked:", row, col, "Index of Square:", positionToIndex(col, row))
        if (tokenAt(board, row, col)?.color === (board.currentPlayer)) {
            setSelected({ row, col });
        }
    }

    const squareColor = function (row, col) {
        if (row === selected?.row && col === selected?.col) {
            return "#52eb34";
        }
        const tokenAtSelected = tokenAt(board, selected?.row, selected?.col);
        if(tokenAtSelected != null) {
            // Find available moves
            const moveOptions = availableMoves(board, tokenAtSelected);
            // console.log("Examining", row, col, "Move Options:",moveOptions)
            // Check if current row/col exists within the valid move list for the selected token
            for (const validMove of moveOptions) {
                if(row == validMove[0] && col == validMove[1]){
                    return "#52eb34";
                }
            }
        }
        const colOffset = row % 2;
        if ((col + colOffset) % 2 == 0) {
            // console.log("Setting color to brown for square:", row, col);
            return "#D2B48C";
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