import React, { useState, useRef, useEffect } from "react";
import InputForm from "./InputForm";
import ItemList from "./ItemList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateRight,
  faEraser,
  faCheck,
  faTrash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

function NotesTextArea({
  notes,
  handleNotesChange,
  newItem,
  handleInputChange,
  handleSubmit,
  editingItem,
  groups,
  selectedGroupIndex,
  removeItem,
  editItem,
  toggleComplete,
  deleteAllCompletedItems,
  deleteAllRemovedItems,
  retrieveItem,
  permanentlyDeleteItem,
}) {
  const [showButtons, setShowButtons] = useState(null);
  const timers = useRef({});
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    const resizeTextarea = () => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    };

    textarea.addEventListener("input", resizeTextarea);
    resizeTextarea(); 

    return () => {
      textarea.removeEventListener("input", resizeTextarea);
    };
  }, []);

  const handleLongPress = (event, item) => {
    event.preventDefault();
    timers.current[item.id] = setTimeout(() => {
      setShowButtons(item.id);
    }, 500);
  };

  const handleTouchEnd = (event, item) => {
    clearTimeout(timers.current[item.id]);
  };

  const handleClickOutside = (event) => {
    if (
      event.target.closest(".completed-items li button") === null &&
      event.target.closest(".removed-items li button") === null
    ) {
      setShowButtons(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const currentGroup = groups[selectedGroupIndex];

  return (
    <div>
      <textarea
        ref={textareaRef}
        value={notes}
        onChange={handleNotesChange}
        placeholder="Write your notes here..."
      />

      <InputForm
        newItem={newItem}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        editingItem={editingItem}
      />

      {currentGroup.items.filter((item) => !item.completed).length > 0 && ( 
        <>
          <h3>
            <FontAwesomeIcon icon={faSpinner} spin /> Pending
          </h3>
          <ItemList
            items={currentGroup.items.filter((item) => !item.completed)}
            onRemoveItem={removeItem}
            onEditItem={editItem}
            onToggleComplete={toggleComplete}
          />
        </>
      )} 

      {currentGroup.items.filter((item) => item.completed).length > 0 && (
        <div className="completed-items">
          <h3>
            <FontAwesomeIcon icon={faCheck} /> Completed
          </h3>
          <button onClick={deleteAllCompletedItems} id="delete-all-button">
            <FontAwesomeIcon icon={faTrash} /> Delete All
          </button>
          <ul>
            {currentGroup.items.filter((item) => item.completed).map((item) => (
              <li
                key={item.id}
                onTouchStart={(e) => handleLongPress(e, item)}
                onTouchEnd={(e) => handleTouchEnd(e, item)}
                onMouseDown={(e) => handleLongPress(e, item)}
                onMouseUp={(e) => handleTouchEnd(e, item)}
                onMouseLeave={(e) => handleTouchEnd(e, item)}
              >
                <span>{item.text}</span>
                {showButtons === item.id && (
                  <button onClick={() => toggleComplete(item)} id="undone">
                    <FontAwesomeIcon icon={faRotateRight} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {currentGroup.removedItems.length > 0 && (
        <div className="removed-items">
          <h3>
            <FontAwesomeIcon icon={faEraser} /> Removed
          </h3>
          <button onClick={deleteAllRemovedItems} className="delete-all-button">
            <FontAwesomeIcon icon={faTrash} /> Delete All
          </button>
          <ul>
            {currentGroup.removedItems.map((item) => (
              <li
                key={item.id}
                onTouchStart={(e) => handleLongPress(e, item)}
                onTouchEnd={(e) => handleTouchEnd(e, item)}
                onMouseDown={(e) => handleLongPress(e, item)}
                onMouseUp={(e) => handleTouchEnd(e, item)}
                onMouseLeave={(e) => handleTouchEnd(e, item)}
              >
                {item.text}
                {showButtons === item.id && (
                  <div>
                    <button onClick={() => retrieveItem(item)} id="undone">
                      <FontAwesomeIcon icon={faRotateRight} />
                    </button>
                    <button onClick={() => permanentlyDeleteItem(item)}>
                      <FontAwesomeIcon icon={faEraser} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default NotesTextArea;