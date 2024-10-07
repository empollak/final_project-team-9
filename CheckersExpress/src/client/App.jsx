import { useState } from "react";
import "./App.css";
import RedrawBoard from "./views/GameView";


function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <RedrawBoard />
    </div>
  );
}

export default App;
