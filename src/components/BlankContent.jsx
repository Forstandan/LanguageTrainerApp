import React from "react"
import "../assets/css/content.css"

export default function BlankContent() {
  return (
    <div className="info-wrapper">
      <div className="info">
        <div className="symbol-wrapper">
          <i className="fa-solid fa-globe" style={{color: "white", paddingTop: "15%"}}></i>
          <i className="fa-solid fa-comment-dots" style={{color: "white"}}></i>
        </div>
        <h2>Language Trainer App</h2>
        <p>Create a new conversation and begin practicing!</p>
      </div>
    </div>
  );
}