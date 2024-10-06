import { Labels, TokenNames } from './enums';
import { CellModel } from './CellModel';
import pieceImgLight from '../assets/light.svg';
import pieceImgDark from '../assets/brown.svg';

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

export { TokenModel };