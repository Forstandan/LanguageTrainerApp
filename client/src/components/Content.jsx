import { useContext, useEffect, useState } from "react";
import "../assets/css/content.css"
import Message from "./Message";
import ChatHeaderObject from "./ChatHeaderObject";
import BlankContent from "./BlankContent";
import { Context } from "../context/Context";
import { createMessageAsync, deleteConversationAsync, getContextByConversationId, getMsgQueryByConversationId, getSnapshotData } from "../services/chatServices";
import { onSnapshot } from "firebase/firestore";
import { getResponse } from "../services/aiServices";

export default function Content() {
  const { currentChat, auth, dispatch } = useContext(Context);
  const [onMenu, setOnMenu] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState([]);

  function scrollMessagesToBottom() {
    const messagesWrapper = document.querySelector('.messages-wrapper');
    if (messagesWrapper) {
      messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
    }  
  }

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
        scrollMessagesToBottom(); 
        setMessage("");
      }

      let prevMessages = ""; 
      const query = getContextByConversationId(currentChat.id);
      const maxCharacters = 10000; // Maximum number of characters for prevMessages

      // Create a promise to await the first snapshot
      const snapshotPromise = new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(query, snapshots => {
          snapshots.forEach(snapshot => {
            const messageData = getSnapshotData(snapshot);
            if (messageData) {
              console.log("messages", messageData.message);
              // Check if adding the message will exceed the character limit
              if (prevMessages.length + messageData.message.length <= maxCharacters) {
                prevMessages += messageData.message + " "; 
              } else {
                // Truncate the message to fit within the character limit
                const remainingCharacters = maxCharacters - prevMessages.length;
                prevMessages += messageData.message.substring(0, remainingCharacters) + " ";
                // No need to process more messages if we've reached the character limit
                unsubscribe();
              }
            }
          });
          resolve(); // Resolve the promise after processing the first snapshot
        });
      });

      // Wait for the promise to resolve
      await snapshotPromise; 

      // Now you can safely use prevMessages
      console.log("prev messages", prevMessages);

      const response = await getResponse(prevMessages + message);

      const responseMsg = {
        conversationId: currentChat.id,
        sender: "ai",
        message: response
      };

      await createMessageAsync(responseMsg);

      scrollMessagesToBottom();

      console.log("response", response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteConversation = async(conversationId) => {
    handleCloseChat()
    await deleteConversationAsync(conversationId);
  } 

  const handleCloseChat = () => {
    dispatch({ type: "SET_CURRENT_CHAT", payload: null });
    localStorage.setItem("convId", null);
  };

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
                  <span className="menu-item" onClick={() => handleCloseChat()}>
                    Close Chat
                  </span>
                  {/* <span className="menu-item">Delete Messages</span> */}
                  <span className="menu-item" onClick={() => handleDeleteConversation(currentChat.id)}>
                    Delete Chat
                  </span>
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