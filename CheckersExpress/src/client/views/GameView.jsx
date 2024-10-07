//game rendering

export default function redrawBoard(board) {
    const ctx = canvasObj.getContext('2d')
    
    // clear the canvas area before rendering elements again
    ctx.clearRect(0, 0, canvasObj.width, canvasObj.height) // assume square region

    // draw game board
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            ctx.fillStyle = 'white'
            ctx.fillRect(sq.column * 60, sq.row * 60, 60, 60) // filling the squares
            ctx.fillStyle = 'black'
            ctx.strokeRect(sq.column * 60, sq.row * 60, 60, 60) // adding borders to the squares
        }
    }

    // draw tokens

}