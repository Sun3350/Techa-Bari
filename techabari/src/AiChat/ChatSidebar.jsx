import React, { useState } from "react";
import "./chat.css"; // Ensure your styles are applied
import { MdOpenInNew } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import { FaTrash, FaShareAlt, FaTimes } from "react-icons/fa";

const ChatSidebar = ({ chats, currentChatId, onChatSelect, onCreateChat, onDeleteChat }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  // Handle the menu toggle
  const handleMenuToggle = (chatId) => {
    setOpenMenuId(openMenuId === chatId ? null : chatId);
  };

  // Group chats into sections based on `updatedAt`
  const formatChatSections = (chats) => {
    const grouped = {
      Today: [],
      Yesterday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    chats.forEach((chat) => {
      const chatDate = new Date(chat.updatedAt);
      const chatDayStart = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate());

      if (chatDayStart >= today) {
        grouped.Today.push(chat);
      } else if (chatDayStart.toDateString() === yesterday.toDateString()) {
        grouped.Yesterday.push(chat);
      } else if (chatDayStart >= new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)) {
        const dayName = chatDayStart.toLocaleDateString("en-US", { weekday: "long" });
        grouped[dayName].push(chat);
      } else {
        const formattedDate = chatDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        grouped[formattedDate] = grouped[formattedDate] || [];
        grouped[formattedDate].push(chat);
      }
    });

    return grouped;
  };

  const chatSections = formatChatSections(chats);

  return (
    <div className="chat-sidebar">
      {/* New Chat Button */}
      <div className="new-chat-container">
        <button onClick={onCreateChat} className="new-chat-btn">
          <MdOpenInNew />
        </button>
      </div>

      {/* Chat Sections */}
      <div className="chat-sections">
        {Object.entries(chatSections).map(([section, sectionChats]) => (
          sectionChats.length > 0 && (
            <div key={section} className="chat-section">
              <h3 className="chat-section-title">{section}</h3>
              <ul className="chat-list">
                {sectionChats.map((chat) => (
                  <li
                    key={chat._id}
                    className={`chat-item ${chat._id === currentChatId ? "active" : ""}`}
                    onClick={() => onChatSelect(chat._id)}
                  >
                    <div className="chat-info">
                      <span className="chat-title uppercase">{chat.title}</span>
                     
                    </div>
                    <div className="chat-options">
                      {openMenuId === chat._id ? (
                        <div className="chat-menu-inline">
                          <button
                            className="menu-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteChat(chat._id);
                              setOpenMenuId(null);
                            }}
                          >
                            <FaTrash /> 
                          </button>
                          <button
                            className="menu-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert("Share link copied!");
                              setOpenMenuId(null);
                            }}
                          >
                            <FaShareAlt /> 
                          </button>
                          <button
                            className="menu-item cancel-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                            }}
                          >
                            <FaTimes /> 
                          </button>
                        </div>
                      ) : (
                        <SlOptionsVertical
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuToggle(chat._id);
                          }}
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
