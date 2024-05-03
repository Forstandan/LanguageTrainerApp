import { useContext, useEffect, useState } from "react";
import "../assets/css/content.css"
import Message from "./Message";
import ChatHeaderObject from "./ChatHeaderObject";
import BlankContent from "./BlankContent";
import { Context } from "../context/Context";
import { createMessageAsync, getMsgQueryByConversationId, getSnapshotData } from "../services/chatServices";
import { onSnapshot } from "firebase/firestore";

export default function Content({ chat, setChat }) {
  const { currentChat, auth } = useContext(Context);
  const [onMenu, setOnMenu] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState([]);

  useEffect(() => {
    if (currentChat == null) return;
    const loadMessages = async () => {
      try {
        const query = getMsgQueryByConversationId(currentChat.id);
        onSnapshot(query, snapshots => {
          let tmpMessages = [];
          snapshots.forEach(snapshot => {
            tmpMessages.push(getSnapshotData(snapshot));
          });
          setMessages(tmpMessages.sort((a, b) => a.createdAt - b.createdAt));
        });
      } catch (error) {
        console.log(error);
      }
    };

    loadMessages();
  }, [currentChat])

  const handleCreateMessage = async () => {
    if (currentChat == null) return;
    if (!message) return;

    try {
      const msg = {
        conversationId: currentChat.id,
        sender: auth.id,
        message
      };

      const res = await createMessageAsync(msg);

      if (res) {
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(messages);

  return (
    <div className={currentChat ? "content active" : "content"}>
      {currentChat ?
        <div className="wrapper">
          <div className="top">
            <ChatHeaderObject language={currentChat?.language} difficulty={currentChat.difficulty} setting={currentChat.location} />
            <div className="app-icon menu-icon" onClick={() => setOnMenu((prev) => !prev)}>
              <i className="fa-solid fa-ellipsis"></i>
              {onMenu && (
                <div className="menu-wrapper">
                  <span className="menu-item" onClick={() => setChat(false)}>
                    Close Chat
                  </span>
                  <span className="menu-item">Delete Messages</span>
                  <span className="menu-item">Delete Chat</span>
                </div>
              )}
            </div>
          </div>
          <div className="center">
            <div className="messages-wrapper">
              {messages.map((msg) => (
                <Message
                  key={msg?.id} 
                  msg={msg} 
                  owner={msg?.sender == auth.id} 
                  auth={auth} />
              ))}
            </div>
          </div>
          <div className="bottom">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  handleCreateMessage();
                }
              }}
              placeholder="Write a message" />
            <div className="app-icon" onClick={handleCreateMessage} >
              <i className="fa-solid fa-paper-plane"></i>
            </div>
          </div>
        </div>
        : (
          <BlankContent />
        )}
    </div>
  )
}