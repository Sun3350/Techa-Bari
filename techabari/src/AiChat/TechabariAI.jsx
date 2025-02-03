import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

const AiChatPage = () => {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]); // Start with an empty array
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch all user chats
  const fetchChats = async () => {
    try {
      const { data } = await axiosInstance.get("/api/chat/all-chats");
      setChats(data);
      const chatIdFromUrl = new URLSearchParams(location.search).get("chatId");
      if (chatIdFromUrl && data.some((chat) => chat._id === chatIdFromUrl)) {
        fetchMessages(chatIdFromUrl);
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  // Fetch messages for a specific chat
  const fetchMessages = async (chatId) => {
    try {
      const { data } = await axiosInstance.get(`/api/chat/chats/${chatId}`);
      setMessages(data.messages);
      setCurrentChatId(chatId);
      navigate(`?chatId=${chatId}`); // Update URL with the chat ID
    } catch (err) {
      console.error("Error fetching chat messages:", err);
    }
  };

  // Automatically create a new chat
  const createNewChat = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing or expired");
        return;
      }

      const { data } = await axiosInstance.post(
        "/api/chat/new-chats",
        { title: "New Chat" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setChats((prevChats) => [data, ...prevChats]);
      setCurrentChatId(data._id); // Set the newly created chat as active
      setMessages([]); // Reset messages for the new chat
      navigate(`?chatId=${data._id}`); // Update URL with the new chat ID
    } catch (err) {
      console.error("Error creating new chat:", err);
    }
  };

  // Delete a chat
  const deleteChat = async (chatId) => {
    try {
      await axiosInstance.delete(`/api/chat/delete-chats/${chatId}`);
      setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId));
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessages([]); // Reset messages when the current chat is deleted
        navigate("/"); // Reset URL if the current chat is deleted
      }
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  };

  // Handle sending a message
  const sendMessage = async (message) => {
    if (!message.trim()) return;
    const userMessage = { role: "user", content: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
  
    try {
      setLoading(true);
  
      // Save the user message in the database
      await axiosInstance.post(`/api/chat/save-chats/${currentChatId}/messages`, userMessage);
  
      // Update the chat title if it's the first user message
      if (messages.length === 0) {
        await axiosInstance.patch(`/api/chat/update-title/${currentChatId}`, {
          title: message, // Use the first user message as the title
        });
  
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === currentChatId ? { ...chat, title: message } : chat
          )
        );
      }
  
      // Get AI response
      const { data } = await axiosInstance.post("/api/chat/ai-response", {
        messages: [...messages, userMessage],
      });
  
      const aiMessage = { role: "ai", content: data.message };
      await axiosInstance.post(`/api/chat/save-chats/${currentChatId}/messages`, aiMessage);
  
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (err) {
      console.error("Error communicating with AI:", err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="ai-chat-page">
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        onChatSelect={(chatId) => fetchMessages(chatId)}
        onCreateChat={createNewChat}
        onDeleteChat={deleteChat}
      />
      <ChatWindow
        messages={messages}
        onSendMessage={sendMessage}
        loading={loading}
      />
    </div>
  );
};

export default AiChatPage;
