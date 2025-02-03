import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPaperPlane, FaMicrophone, FaImage, FaVideo } from "react-icons/fa";

const ChatBoard = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/messaging/messages");
        setMessages(res.data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };
    fetchMessages();
  }, []);

  // Send message
  const sendMessage = async (messageType, content) => {
    try {
      const senderId = localStorage.getItem("userId") || "guest";  // Handle default userId
      await axios.post("http://localhost:5000/api/messaging/messages", {
        senderId,
        messageType,
        content,
      });
      setMessages((prev) => [...prev, { senderId, messageType, content }]);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    const fileType = file.type;
    const type = fileType.startsWith("video/") ? "video" :
                 fileType.startsWith("image/") ? "image" :
                 fileType.startsWith("audio/") ? "audio" : "file";
  
    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      sendMessage(type, res.data.fileUrl);
    } catch (error) {
      console.error("File upload failed", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMessage("text", text);
      setText("");
    } catch {
      console.error("Failed to send the message. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px", height: "400px", overflowY: "scroll" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: "10px", textAlign: msg.senderId === "user1" ? "right" : "left" }}>
            {msg.messageType === "text" ? (
              <p>{msg.content}</p>
            ) : msg.messageType === "file" ? (
              <>
                {msg.content.startsWith("data:image") && <img src={msg.content} alt="file" style={{ maxWidth: "100%" }} />}
                {msg.content.startsWith("data:video") && <video src={msg.content} controls style={{ maxWidth: "100%" }} />}
                {msg.content.startsWith("data:audio") && <audio src={msg.content} controls />}
                {!msg.content.startsWith("data:image") && !msg.content.startsWith("data:video") && !msg.content.startsWith("data:audio") && (
                  <a href={msg.content} target="_blank" rel="noopener noreferrer">
                    Download File
                  </a>
                )}
              </>
            ) : null}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: "1", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ background: "blue", color: "white", padding: "10px", border: "none", borderRadius: "8px" }}>
          <FaPaperPlane />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => handleFileUpload(e.target.files[0])}
        />
        <button type="button" onClick={() => fileInputRef.current.click()} style={{ background: "green", color: "white", padding: "10px", border: "none", borderRadius: "8px" }}>
          <FaImage />
        </button>
        <button type="button" onClick={() => alert("Voice recording not implemented yet!")} style={{ background: "orange", color: "white", padding: "10px", border: "none", borderRadius: "8px" }}>
          <FaMicrophone />
        </button>
      </form>
    </div>
  );
};

export default ChatBoard;
