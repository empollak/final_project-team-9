import React, { ReactElement } from 'react';
import './Cell.css';
import { mergeClasses } from 'utils/utils';
import { CellModel } from 'models/CellModel';
import { Letters } from 'models/Letters';

// type CellProps = {
//     cell: CellModel;
//     rowIndex: number;
//     cellIndex: number;
//     selected: boolean;
//     onCellClick: (cell: CellModel) => void;
// };

export const Cell = ({ cell, rowIndex, cellIndex, selected, onCellClick }) => {
    const { token, label } = cell;

    const handleTokenClick = () => onCellClick(cell);

    return (
        <div
            className={mergeClasses('cell', label, selected ? 'selected' : '')}
            onClick={handleTokenClick}
        >
            {token?.imageSrc && <img className="icon" src={token.imageSrc} alt={token.name} />}

            {cell.available && !cell.token && <div className="available" />}

            {(rowIndex === 0 || rowIndex === 7) && (
                <div className={mergeClasses('board-label', rowIndex === 0 ? 'top' : 'bottom')}>
                    {Letters[cellIndex]}
                </div>
            )}

            {(cellIndex === 0 || cellIndex === 7) && (
                <div className={mergeClasses('board-label', cellIndex === 0 ? 'left' : 'right')}>
                    {8 - rowIndex}
                </div>
            )}
        </div>
    );
};