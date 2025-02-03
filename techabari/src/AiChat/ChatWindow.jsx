import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./chat.css";
import { FaCopy, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";

const ChatWindow = ({ messages, onSendMessage, loading }) => {
  const [messageInput, setMessageInput] = useState("");
  const [copiedItemId, setCopiedItemId] = useState(null);
  const textareaRef = useRef(null); // Ref for the textarea

  const MAX_TEXTAREA_HEIGHT = 150; // Maximum height for the textarea

  const handleSend = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    if (messageInput.trim()) {
      onSendMessage(messageInput); // Call the provided onSendMessage function
      setMessageInput(""); // Clear the input field
      resizeTextarea(); // Reset the textarea height
    }
  };

  const handleInput = (e) => {
    setMessageInput(e.target.value);
    resizeTextarea(); // Adjust height dynamically
  };

  const DEFAULT_TEXTAREA_HEIGHT = 40; // Define the default height for the textarea

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      if (!textarea.value.trim()) {
        textarea.style.height = `${DEFAULT_TEXTAREA_HEIGHT}px`; // Reset to default height if empty
      } else {
        textarea.style.height = "auto"; // Reset height to calculate new height
        textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`; // Set height to content or max height
      }
    }
  };
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSend(e); // Trigger the message send
    }
  };

  const handleCopy = (content, itemId) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopiedItemId(itemId);
        setTimeout(() => setCopiedItemId(null), 2000);
      })
      .catch(() => alert("Failed to copy!"));
  };

  const handleFeedback = (messageId, feedback) => {
    console.log(`Message ID: ${messageId}, Feedback: ${feedback}`);
    // You can add further logic here to send feedback to the server
  };

  const renderContent = (content, messageId) => {
    const regex = /```(\w*)\n([\s\S]*?)```/g;
    const parts = [];
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(content)) !== null) {
      if (lastIndex < match.index) {
        parts.push({ type: "text", value: content.slice(lastIndex, match.index) });
      }
      parts.push({ type: "code", language: match[1] || "plaintext", code: match[2] });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < content.length) {
      parts.push({ type: "text", value: content.slice(lastIndex) });
    }

    return parts.map((part, idx) => {
      if (part.type === "text") {
        return <ReactMarkdown key={idx}>{part.value.trim()}</ReactMarkdown>;
      }
      return (
        <div key={idx} className="code-container">
          <div className="flex justify-between">
            <div className="code-identifier">{`${part.language.toUpperCase()} Code`}</div>
            <button
              className="copy-code"
              onClick={() => handleCopy(part.code.trim(), `code-${messageId}-${idx}`)}
              title="Copy Code"
            >
              {copiedItemId === `code-${messageId}-${idx}` ? "Copied!" : "Copy Code"}
            </button>
          </div>
          <SyntaxHighlighter language={part.language} style={dracula}>
            {part.code.trim()}
          </SyntaxHighlighter>
        </div>
      );
    });
  };

  return (
    <div className="chat-window">
      <div className="header w-full h-14 flex items-center p-5">
        <a className="text-logo" href="/">Techabari</a>
      </div>
      <div className="ai-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <h1 className="text-[#B4B4B4] text-4xl">What can I help you with?</h1>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`ai-message ${msg.role}`}>
              {msg.role === "ai" ? (
                <div className="assistant-response">
                  {renderContent(msg.content, msg.id)}
                  <div className="response-actions flex">
                    <button
                      onClick={() => handleFeedback(msg.id, "like")}
                      className="like-btn"
                    >
                      <FaThumbsUp />
                    </button>
                    <button
                      onClick={() => handleFeedback(msg.id, "dislike")}
                      className="dislike-btn"
                    >
                      <FaThumbsDown />
                    </button>
                    <button
                      onClick={() => handleCopy(msg.content, `response-${msg.id}`)}
                      className="copy-response-btn"
                      title="Copy Response"
                    >
                      {copiedItemId === `response-${msg.id}` ? "Copied!" : <FaCopy />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="user-message">{msg.content}</div>
              )}
            </div>
          ))
        )}
        {loading && <div className="loading-message">Generating response...</div>}
      </div>
      <form onSubmit={handleSend} className="input-container">
        <textarea
          ref={textareaRef}
          value={messageInput}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="ai-input"
          style={{ maxHeight: `${MAX_TEXTAREA_HEIGHT}px`, overflow: "auto" }}
        />
        <button type="submit" disabled={loading} className="ai-send-button">
          <IoIosSend />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
