import {useState, useEffect} from "react";
import "../styles/GameStyle.css"
//game rendering

export default function GameBoard(board) {
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

    }
    const squareColor = function(row, col){
        const colOffset = row % 2;
        if((col + colOffset) % 2 == 0) {
            // console.log("Setting color to brown for square:", row, col);
            return "brown";
        }
        else {
            // console.log("Setting color to white for square:", row, col);
            return "white";
        }
    }

    // draw tokens
    return <>
        {
            [... Array(8)].map((gridRow, rowIndex) => {
                return <div key={"row:"+rowIndex} style={{}}>
                    {
                        [... Array(8)].map((gridCell, colIndex) => {
                            return <button className="square" 
                                key={"row:"+rowIndex+",col:"+colIndex}
                                onClick = {() => clickSquare(rowIndex, colIndex)} 
                                style={{ 
                                    backgroundColor: squareColor(rowIndex, colIndex),
                                }} />
                        })
                    }
                </div>
                
            })
        }
    </>
}