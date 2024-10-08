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
        console.log("Square Clicked:", row, col)
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
            const moveOptions = availableMoves(board, tokenAtSelected);
            // So availableMoves is working as intended
            // But this if statement isn't triggering
            // This seems to be bc this function (squareColor) doesn't get re-called
            // Except for the newly selected piece.
            if(moveOptions.includes([row, col])){
                // console.log("Current Square", row, col, "is a valid move given a selected piece at ", selected?.row, selected?.col)
                return "#52eb34";
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
                                    onClick={() => clickSquare(rowIndex+1, colIndex+1)}
                                    style={{
                                        backgroundColor: squareColor(rowIndex+1, colIndex+1),
                                    }}>
                                    {tokenAt(board, rowIndex+1, colIndex+1) ?
                                        <img className="square"
                                            src={tokenAt(board, rowIndex+1, colIndex+1).imgSource()} /> : null}
                                </button>
                            })
                        }
                    </div>
                })
            }
        </div>

    )
}