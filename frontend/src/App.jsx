import Chatbot from "./layouts/Chatbot";
import sessionManager from "./utils/sessionManager";
import "./app.scss";

function App() {
  sessionManager();
  return (
    <div className="App">
      <div className="background">
        <img src={`/assets/images/background.png`} alt="avatar-girl" />
      </div>
      <Chatbot />
    </div>
  );
}

export default App;
