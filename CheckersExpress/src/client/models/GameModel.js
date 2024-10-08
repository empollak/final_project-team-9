//persistant memory

// Tokens store their own position, title, and color
export class Token {
    index;
    isMonarch;
    color;

    constructor(index, isMonarch, color) {
        this.index = index;
        this.isMonarch = isMonarch;
        this.color = color;
    }

    copy = function () {
        return new Token(this.index, this.isMonarch, this.color);
    }
    softCopy = function (newIndex) {
        return new Token(newIndex, this.isMonarch, this.color);
    }
    imgSource = function () {
        if (this.color == "b") {
            if (this.isMonarch) {
                return "dark_monarch.png";
            } else {
                return "dark_piece.png";
            }
        } else {
            if (this.isMonarch) {
                return "light_monarch.png";
            } else {
                return "light_piece.png";
            }
        }
    }
}
const redToken = new Token(0, false, "r")
const blackToken = new Token(0, false, "b")


export class Board {
    boardState;
    selected;
    currentPlayer;

    constructor() {
        this.boardState = [];
        this.selected = null;
        this.currentPlayer = "b";
        this.resetBoard();
    };

    resetBoard = function () {
        this.boardState = [];
        for (var i = 0; i < 32; i++) {
            if (i < 12) {
                this.boardState.push(redToken.softCopy(i));
            }
            else if (i >= 21) {
                this.boardState.push(blackToken.softCopy(i));
            }
            // else if (i == 16){
            //     this.boardState.push(new Token(16, true, "b"))
            // }
            // else if (i == 17){
            //     this.boardState.push(new Token(17, true, "b"))
            // }
            else {
                this.boardState.push(null);
            }
        }
    };

};


// Represent a token in the board using a string of 4 characters
//(token) => "{x}{y}{isNull ? n : isMonarch ? m : p}{color}";

// Nulls in board array allow for conversion from position to index (bottom left to top right)


// Send move messages using human readable strings for debugging
//move = "a4b5";

// Position to index helper
//(position "a4") => 02;


//player select token


//player choose location for token to move to


//game recives 