import { Labels } from './enums';
import { BoardModel } from './BoardModel';
import { TokenModel } from 'models/TokenModel';

class CellModel {
    x;
    y;
    label;
    token; // our token
    board;
    available;
    key;

    constructor(x, y, label, board) {
        this.x = x; // x coord
        this.y = y; // y coord
        this.label = label;
        this.board = board;
        this.available = false; // is it free for token
        this.key = `${x}${y}`;
        this.token = null; // null by default
    }

    isForwardCell(targetCell, selectedToken) {
        const { cell, label } = selectedToken;

        const dx = Math.abs(cell.x - targetCell.x);
        const dy = cell.y - targetCell.y;

        return label === Labels.Light ? dx === 1 && dy === 1 : dx === 1 && dy === -1;
    }

    moveToken(targetCell) {
        if (this.token && this.token.canMove(targetCell)) {
            targetCell.token = this.token; // set token on target cell
            targetCell.token.cell = targetCell; // set new cell in token cell
            this.token = null; // clean current cell
        }
    }
}

export { CellModel };