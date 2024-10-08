import {Token, Board} from "../models/GameModel.js"

//game logic

// endOfBoard() function, check if a token will turn into a monarch (call this function in makeMove())
const endOfBoard = function(token, newPosition) {
    return false;
}

// makeMove() function
export const makeMove = function(board, token, newPosition) {
    if(!availableMoves(board, token).includes(newPosition)){
        throw new Error("This is not a legal move")
    }

    if(endOfBoard(token, newPosition)){
        token.isMonarch = true;
    }
    return board;
}


// availableMoves() function (for a single piece)
export const availableMoves = function(board, token) {
    const moves = []
    const position = indexToPosition(token.index);
    console.log("Index:", token.index, "Position:", position)
    const x = position[0];
    const y = position[1];

    const xOptions = [-1, 1]
    const yOptions = []
    // Populate list of moves based on color + royalty status
    if(token.isMonarch) {
        yOptions.push(-1);
        yOptions.push(1);
    }else if (token.color == "b") {
        yOptions.push(-1);
    }else {
        yOptions.push(1);
    }
    console.log("Available moves from", y, x, ":", String(xOptions), String(yOptions))
    // Loop through x and y movement options
    xOptions.forEach((dx)=>{
        yOptions.forEach((dy)=>{
            const target = tokenAt(board,y + dy,x + dx);
            if(inBounds(x + dx, y + dy) && tokenAt(board,y + dy,x + dx) == null){
                moves.push([y + dy, x + dx]);
            }
            else if(inBounds(x + 2*dx, y + 2*dy) && target?.color != board.currentPlayer && tokenAt(board,y + 2*dy,x + 2*dx) == null){
                moves.push([y + 2*dy, x + 2*dx])
            }
        })
    })
    console.log("Move options from selected piece:", moves)
    return moves
}

const inBounds = function(x, y){
    const xInBounds = x > 0 && x <= 8;
    const yInBounds = y > 0 && y <= 8;
    return xInBounds && yInBounds;
}

// allPlayerMoves() function (every move a player can make)
export const allPlayerMoves = function(board) {
    return null;
}

export const tokenAt = function(board, row, col) {
    const index = positionToIndex(col, row);
    return board.boardState[index];
};

export const indexToPosition = function(index) {
    // Plus 1 bc 1-based indexing
    const yVal = Math.floor(index/4);
    // Every other line has an offset of 1
    const xOffset = (yVal) % 2;
    const xVal = (index % 4)*2 + xOffset;

    return [xVal, yVal];
}

export const positionToIndex = function(x, y) {
    // Offset on even number rows (from top left)
    const xOffset = y % 2;
    const index = y * 4 + (x - xOffset)/2;
    return index;
}