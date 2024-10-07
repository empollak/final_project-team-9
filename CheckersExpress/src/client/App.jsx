import { useState, useEffect} from "react";
import "./App.css";
import RedrawBoard from "./views/GameView";
import { Board, Token } from "./models/GameModel"

function App() {
  const [count, setCount] = useState(0);
  const board = new Board()
  
  return (
    <div className="App">
      <RedrawBoard board={board}/>
    </div>
  );
}

export default App;
