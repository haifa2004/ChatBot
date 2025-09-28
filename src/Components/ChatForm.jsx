
import React, { useRef } from "react";

export default function ChatForm({ setChatHistory , generateBotResponse,chatHistory}) {
  const inputRef = useRef(null);
 

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;

    // Update chat history with new user message
    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);
    setTimeout(()=> {
    
    generateBotResponse([...chatHistory,{role:"user" ,text:userMessage}])},600 );

    // Clear input after sending
    inputRef.current.value = "";
    
  };

  return (
    <form className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input"
        required
      />
      <button type="submit" className="material-symbols-rounded">
        arrow_upward
      </button>
    </form>
  );
}

