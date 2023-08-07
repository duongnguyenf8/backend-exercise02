import { BrowserRouter } from "react-router-dom";
import "./Styles/App.css";
import "jsvjp/style.css";
import Routers from "./Routers";
function App() {
  return (
    <BrowserRouter>
      <Routers />
    </BrowserRouter>
  );
}

export default App;
