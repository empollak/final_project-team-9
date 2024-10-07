import {Token, Board} from "../models/GameModel.js"

//game logic

// endOfBoard() function, check if a token will turn into a monarch (call this function in makeMove())
endOfBoard = function(token, newPosition) {
    return false;
}

// makeMove() function
makeMove = function(board, token, newPosition) {
    if(!availableMoves(board, token).includes(newPosition)){
        throw new Error("This is not a legal move")
    }

    if(endOfBoard(token, newPosition)){
        token.isMonarch = true;
    }
    return board;
}


// availableMoves() function (for a single piece)
availableMoves = function(board, token) {

    return null
}

// allPlayerMoves() function (every move a player can make)
allPlayerMoves = function(board) {
    return null;
}

indexToPosition = function(index) {
    yVal = Math.floor(index/4);
    // Every other line has an offset of 1
    xOffset = yVal % 2;
    xVal = (index % 4)*2 + xOffset;
    let conversion = "a".charCodeAt(0);  
    str = String.fromCharCode(conversion + yVal) + xVal; 

    return str;
}

positionToIndex = function(position) {
    xVal = position.charAt(1);
    yVal = position.charCodeAt(0) - "a".charCodeAt(0)
    xOffset = yVal % 2;
    index = yVal * 4 + (xVal - xOffset)/2;
    
    return index;
}