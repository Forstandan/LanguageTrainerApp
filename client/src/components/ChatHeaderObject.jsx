import React from "react"

export default function ChatHeaderObject({ language, difficulty, setting }) {
  return (
    <div className="chat-header">
      <div className="chat-item-infos">
        <div className="chat-first-row">
          <div className="language">{language}</div>
          <div className="difficulty">, {difficulty}</div>
        </div>
        <div className="chat-second-row">
          <div className="location">
            {setting}
          </div>
        </div>
      </div>
    </div>
  );
}