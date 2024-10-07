import {Token, Board} from "../models/GameModel.js"

//game logic

// endOfBoard() function, check if a token will turn into a monarch (call this function in makeMove())
const endOfBoard = function(token, newPosition) {
    return false;
}

// makeMove() function
const makeMove = function(board, token, newPosition) {
    if(!availableMoves(board, token).includes(newPosition)){
        throw new Error("This is not a legal move")
    }

    if(endOfBoard(token, newPosition)){
        token.isMonarch = true;
    }
    return board;
}


// availableMoves() function (for a single piece)
const availableMoves = function(board, token) {
    position = indexToPosition(token.index);

    return null
}

// allPlayerMoves() function (every move a player can make)
const allPlayerMoves = function(board) {
    return null;
}

export const tokenAt = function(board, row, col) {
    const index = positionToIndex(row, col);
    return board.boardState[index];
};

export const indexToPosition = function(index) {
    // Plus 1 bc 1-based indexing
    const yVal = Math.floor(index/4)+1;
    // Every other line has an offset of 1
    const xOffset = yVal % 2;
    const xVal = (index % 4)*2 + xOffset + 1;

    return xVal, yVal;
}

export const positionToIndex = function(x, y) {
    const xOffset = y % 2;
    const index = y * 4 + (x - xOffset)/2;
    
    return index;
}