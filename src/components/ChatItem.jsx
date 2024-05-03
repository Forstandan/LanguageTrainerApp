import React from "react"

export default function ChatItem({ chat, active, selectConversation }) {
  return (
    <div className={active ? "chat-item active" : "chat-item"} onClick={() => selectConversation(chat)}>
      <div className="chat-first-row">
        <div className="chat-main-info">
          <div className="language">{chat?.language}</div>
          <div className="difficulty">, {chat?.difficulty}</div>
        </div>
      </div>
      <div className="chat-second-row">
        <div className="location">
          {chat?.location}
        </div>
      </div>
    </div>
  )
}