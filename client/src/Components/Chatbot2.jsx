import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css"; // Import your CSS file for styling

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const messageContainerRef = useRef(null);

  const toggleChatbot = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOptionClick = (option) => {
    setMessages([...messages, option]);
    // You can handle the click event for the option here, like sending it to the backend or triggering some action
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleMessageSend();
    }
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMessageSend = () => {
    if (inputValue.trim() !== "") {
      setMessages([...messages, inputValue]);
      setInputValue("");
    }
  };

  return (
    <div className="chatbot">
      {!isExpanded && (
        <button className="toggle-button" onClick={toggleChatbot}>
          <span>Chat</span>
        </button>
      )}
      {isExpanded && (
        <>
          <div className="chatbot-expanded">
            <div className="message-container" ref={messageContainerRef}>
              {messages.map((message, index) => (
                <div key={index} className="message">
                  <span>{message}</span>
                </div>
              ))}
            </div>

            <div className="options-container">
              <button onClick={() => handleOptionClick("Option 1")}>
                Option 1
              </button>
              <button onClick={() => handleOptionClick("Option 2")}>
                Option 2
              </button>
              <button onClick={() => handleOptionClick("Option 3")}>
                Option 3
              </button>
              {/* Add more options as needed */}
            </div>

            <div className="input-container">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              <button onClick={handleMessageSend}>Send</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Chatbot;
