import { useState } from "react";
import "../assets/css/dropdown.css"

export default function Dropdown({options, currentOption, onChange}) {

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const handleSelected = (option, index)=>{
    onChange(option);
    setSelectedIndex(index);
  }

  return (
    <div className="dropdown" 
        tabIndex={0}
        onBlur={() => setOpen(false)} 
        onClick={() => setOpen((prev) => !prev)}
      >
      <div className="current-option">
        <span>{currentOption}</span>
        <div className={open ? "arrow active" : "arrow"}></div>
      </div>
      <div className={open? "options active" : "options"}>
        {options.map((option, index) => (
          <div
            onClick={() => handleSelected(option, index)}
            className={selectedIndex == index ? "option selected" : "option"}
            key={index}
          >
              <span>{option}</span>
          </div>
        ))}
      </div>  
    </div>
  )
}