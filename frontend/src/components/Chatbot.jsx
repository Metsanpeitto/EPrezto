import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async () => {
    if (!input) return;

    setMessages((prev) => [...prev, { user: "You", text: input }]);

    try {
      const response = await axios.post("http://localhost:5000/api/chatbot", {
        input: input,
      });
      setMessages((prev) => [
        ...prev,
        { user: "Bot", text: response.data.botMessage },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { user: "Bot", text: "Error fetching data." },
      ]);
    }

    setInput("");
  };

  return (
    <div className="chatbot">
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.user === "You" ? "user" : "bot"}`}
          >
            <strong>{msg.user}: </strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Enter license plate or email..."
      />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default Chatbot;
