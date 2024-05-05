import { useRef, useState } from "react";
import Dropdown from "./Dropdown"

const Difficulties = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
  "C3"
]

export default function ChatCreator( {createConversationAsync} ) {
  const [difficulty, setDifficulty] = useState(Difficulties[0])
  const langRef = useRef();
  const locRef = useRef();

  const [loading, setLoading] = useState(false);

  const clearInputs = () => {
    if (langRef?.current) {
      langRef.current.value = "";
    }
    if (locRef?.current) {
      locRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    const settings = {
      language: langRef.current.value,
      difficulty: difficulty,
      location: locRef.current.value,
    };

    createConversationAsync(settings.language, settings.difficulty, settings.location)

    console.log("create", settings);

    clearInputs();
    setLoading(false);
  };


  return (
    <div className="chat-creator-wrapper">  
      <form onSubmit={handleSubmit} className="form">
        <div className="language-input-wrapper">
          Select your language <br />
          <input required ref={langRef} className="language-input" type="text" placeholder="Enter a language"/>  
        </div>
        <div className="difficulty-input-wrapper">
          <a href="https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale">
            Select CEFR difficulty 
            <i className="fa-regular fa-circle-question"></i> 
          </a>
          <Dropdown
            options={Difficulties} 
            currentOption={difficulty} 
            onChange={setDifficulty}  
          />
        </div>
        <div className="location-input-wrapper">
          Select the setting for your conversation 
          <input required ref={locRef} className="location-input" type="text" placeholder="Enter a location (park, marketplace, etc)"/>  
        </div>
        <div className="start-btn-wrapper">
          <button className="create-chat">
            <i className="fa-solid fa-play"></i>
            Begin conversation
          </button>
        </div>
      </form>
    </div>
  )
}