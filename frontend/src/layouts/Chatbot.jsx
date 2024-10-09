import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Header, ChatWindow, MessageInputBar } from "../components/";

const Chatbot = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  //const BASE_URL = import.meta.env.VITE_BASE_URL_DEV;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatWindowRef = useRef(null);
  const textareaRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      const height = Math.min(
        textareaRef.current.scrollHeight,
        window.innerHeight * 0.2
      );
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${height}px`;
      if (height > 48) {
        const footerBottom = height - 32;
        footerRef.current.style.bottom = `${footerBottom}px`;
      }
    }
  }, [input]);

  const handleChange = (e) => {
    e.preventDefault();
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim()) {
        if (!input) return;
        setMessages((prev) => [...prev, { user: "You", text: input }]);

        try {
          const response = await axios.post(BASE_URL, {
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
      }
    }
  };

  return (
    <div className="chatbot">
      <Header />
      <div className="chatbot__window">
        <ChatWindow messages={messages} chatWindowRef={chatWindowRef} />
      </div>
      <div className="chatbot__footer" ref={footerRef}>
        <MessageInputBar
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          input={input}
          textareaRef={textareaRef}
        />
      </div>
    </div>
  );
};

export default Chatbot;
