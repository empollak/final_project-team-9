import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Board from "./components/Board";
import { BoardModel } from './models/BoardModel';
import { PlayerModel } from './models/PlayerModel';
import { Labels } from './models/enums';


function App() {
  const [count, setCount] = useState(0);
  let board = new BoardModel();
  const setBoard = (newBoard) => {board = newBoard;};
  const lightPlayer = new PlayerModel(Labels.Light);
  const darkPlayer = new PlayerModel(Labels.Dark);
  let currentPlayer = lightPlayer;
  const setCurrentPlayer = (newPlayer) => {currentPlayer = nnewPlayerewBoard;};

  const restart = () => {
      const newBoard = new BoardModel();
      newBoard.createCells();
      newBoard.addFigures();
      setBoard(newBoard);
      setCurrentPlayer(lightPlayer);
  };

  const changePlayer = () => {
      setCurrentPlayer(currentPlayer?.label === Labels.Light ? darkPlayer : lightPlayer);
  };

  useEffect(() => {
      restart();
  }, []);


  return (
    <div className="App">
      <Board board={board} currentPlayer={currentPlayer} onChangePlayer={changePlayer} setBoard={setBoard}/>
    </div>
  );
}

export default App;
