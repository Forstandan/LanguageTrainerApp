import { useContext, useEffect, useState } from "react";
import  "../assets/css/sidebar.css"
import Avatar from "./Avatar";
import ChatItem from "./ChatItem";
import ChatCreator from "./ChatCreator";
import { logoutAsync } from "../services/authServices";
import { Context } from "../context/Context";
import { signOut } from "../context/Actions";
import { createConversationAsync, createMessageAsync, getConversationsQueryByUser, getSnapshotData } from "../services/chatServices";
import { onSnapshot } from "firebase/firestore";
import { getFirstMessage } from "../services/aiServices";

export default function Sidebar({ }) {
  const {auth, dispatch, chats, currentChat} = useContext(Context);
  const [newChat, setNewChat] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    chats && setConversations(chats)
  }, [chats]);

  useEffect(() => {
    loadConversations();
  }, [auth]);

  const loadConversations = () => {
    if (auth == null) return;
    const query = getConversationsQueryByUser(auth.id);

    onSnapshot(query, (snapshots) => {
      const tmpConversations = [];
      snapshots.forEach(snapshot => {
        const conv = getSnapshotData(snapshot);
        tmpConversations.push({
          ...conv
        });
      });
      dispatch({ type: "LOAD_CHATS", payload: tmpConversations });
      const convId = JSON.parse(localStorage.getItem("convId"));
      if (convId) {
        const currChat = tmpConversations.find((c) => c.id === convId);
        dispatch({ type: "SET_CURRENT_CHAT", payload: currChat });
      }
      setConversations(tmpConversations); 
    });
  };

  const handleCreateConversation = async(language, difficulty, location) => {
    if (auth == null) return;
    const conv = conversations.find((c) => c.language === language && c.difficulty === difficulty && c.location === location);
    if (conv) {
      dispatch({ type: "SET_CURRENT_CHAT", payload: conv });
      localStorage.setItem("convId", JSON.stringify(conv.id));
      setNewChat(false);
    } else {
      const res = await createConversationAsync(auth.id, language, difficulty, location);

      // generate AI first message
      const message = await getFirstMessage({ language, difficulty, location });

      const msg = {
        conversationId: res.id,
        sender: "ai",
        message
      };

      await createMessageAsync(msg);

      console.log("first msg", message);
      dispatch({ type: "SET_CURRENT_CHAT", payload: res });
      localStorage.setItem("convId", JSON.stringify(res.id));
      if (res) {
        localStorage.setItem("convId", JSON.stringify(res.id));
        setNewChat(false);
      }
    }
  };

  const handleSelectConversation = (conv) => {
    dispatch({ type: "SET_CURRENT_CHAT", payload: conv });
    localStorage.setItem("convId", JSON.stringify(conv.id));
   
  }

  const handleLogout = async() => {
    logoutAsync();
    dispatch(signOut());
  };


  return (
    <div className="sidebar">
      <div className="wrapper">
        <div className="top">
          <div>
            <Avatar src="" height={45} width={45}/>
          </div>
          <div className={newChat? "app-icon active" : "app-icon"} onClick={() => setNewChat(prev=>!prev)}>
            <i className="fa-solid fa-plus"></i>
          </div>
        </div>
        <div className="center">
          <div className="center-wrapper">
          {newChat ? (
              <div className="items-wrapper">
                <ChatCreator createConversationAsync={handleCreateConversation} />
              </div>
            ) : (
              <div className="items-wrapper">
                {conversations.map((chat) => (
                  <ChatItem 
                    chat={chat}
                    active={chat?.id == currentChat?.id} 
                    selectConversation={handleSelectConversation} 
                    key={chat?.id} />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="bottom">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-power-off"></i>Logout
          </button>
        </div>
      </div>
    </div>
  )
}