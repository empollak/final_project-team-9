import { Labels, TokenNames } from './enums';
import { CellModel } from './CellModel';
import pieceImgLight from 'images/light.svg';
import pieceImgDark from 'images/brown.svg';

class TokenModel {
    label;
    imageSrc;
    isMonarch;
    cell;
    name;

    constructor(label, cell) {
        this.label = label;
        this.cell = cell;
        this.cell.figure = this;
        this.isMonarch = false;
        this.name = TokenNames.Piece;
        this.imageSrc = label === Labels.Light ? pieceImgLight : pieceImgDark;
    }

    canMove(targetCell) {
        return this.cell.isForwardCell(targetCell, this);
    }
}

export { FigureModel };