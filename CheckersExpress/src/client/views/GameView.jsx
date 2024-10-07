import {useState, useEffect} from "react";
import "../styles/GameStyle.css"
import {indexToPosition, positionToIndex, tokenAt} from "../controllers/GameController"
//game rendering

export default function GameBoard({board}) {
    // const ctx = canvasObj.getContext('2d')
    
    // // clear the canvas area before rendering elements again
    // ctx.clearRect(0, 0, canvasObj.width, canvasObj.height) // assume square region

    // // draw game board
    // for (let i = 0; i < 8; i++) {
    //     for (let j = 0; j < 8; j++) {
    //         ctx.fillStyle = 'white'
    //         ctx.fillRect(sq.column * 60, sq.row * 60, 60, 60) // filling the squares
    //         ctx.fillStyle = 'black'
    //         ctx.strokeRect(sq.column * 60, sq.row * 60, 60, 60) // adding borders to the squares
    //     }
    // }

    const clickSquare = function(row, col){
        console.log("Square Clicked:", row, col)
    }

    const squareColor = function(row, col) {
        const colOffset = row % 2;
        if((col + colOffset) % 2 == 0) {
            // console.log("Setting color to brown for square:", row, col);
            return "#D2B48C";
        }
        else {
            // console.log("Setting color to white for square:", row, col);
            return "#F1F1F1";
        }
    }

    const hasToken = function(row, col) {
        
    }

    // draw tokens
    return <div>
        {
            [... Array(8)].map((gridRow, rowIndex) => {
                return <div className="" key={"row:"+rowIndex} style={{}}>
                    {
                        [... Array(8)].map((gridCell, colIndex) => {
                            return <button className="square" 
                                    key={"row:"+rowIndex+",col:"+colIndex}
                                    onClick = {() => clickSquare(rowIndex, colIndex)} 
                                    style={{ 
                                        backgroundColor: squareColor(rowIndex, colIndex),
                                    }}> 
                                        <img className="square" 
                                             src={tokenAt(board,rowIndex,colIndex)?.imgSource()}/>
                                    </button>
                        })
                    }
                </div>
            })
        }
    </div>
}