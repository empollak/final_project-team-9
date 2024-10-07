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
    
    copy = function() {
        return new Token(this.index, this.isMonarch, this.color);
    }
    softCopy = function(newIndex) {
        return new Token(newIndex, this.isMonarch, this.color);
    }
}
redToken = new Token(0, false, "r")
blackToken = new Token(0, false, "b")


export class Board {
    constructor(config) {
        this.squares = [];
        this.size = parseInt(config.numColumns);
        this.selected = null;
        this.currentPlayer = 1;
        this.resetBoard();
    }

    resetBoard = function() {
        this.boardState = [];
        for(var i = 0; i < 32; i++) {
            if(i < 12) {
                this.boardState.append(redToken.softCopy(i));    
            }
            else if(i >= 20) {
                this.boardState.append(blackToken.softCopy(i));
            }
            else {
                this.boardState.append(null);
            }
        }
    }

}


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