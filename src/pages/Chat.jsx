import { useState } from "react";
import Content from "../components/Content";
import Sidebar from "../components/Sidebar";
import  "../assets/css/chat.css"

export default function Chat() {
  const [chat, setChat] = useState(false);

  return (
    <div className="chat">
        <Sidebar setChat={setChat}/>
        <Content chat={chat} setChat={setChat}/>
    </div>
  )
}