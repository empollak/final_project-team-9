import { useState, useEffect} from "react";
import "./App.css";
import GameBoard from "./views/GameView";
import { Board, Token } from "./models/GameModel"

function App() {
  const [count, setCount] = useState(0);
  const board = new Board()
  
  return (
    <div className="App">
      <GameBoard board={board}/>
    </div>
  );
}

export default App;
