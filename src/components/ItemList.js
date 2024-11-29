import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen, faEraser } from '@fortawesome/free-solid-svg-icons';

function ItemList({ items, onRemoveItem, onEditItem, onToggleComplete }) {
  const [showButtons, setShowButtons] = useState(null); // Changed to null
  const timers = useRef({});
  const touchTimer = useRef({});

  const handleLongPress = (event, item) => {
    event.preventDefault();

    if (event.type.startsWith('touch')) {
      touchTimer.current[item.id] = setTimeout(() => {
        // Show buttons only for the current item
        setShowButtons(item.id); 
      }, 500);
    } else {
      timers.current[item.id] = setTimeout(() => {
        // Show buttons only for the current item
        setShowButtons(item.id); 
      }, 500);
    }
  };

  const handleTouchEnd = (event, item) => {
    clearTimeout(timers.current[item.id]);
    clearTimeout(touchTimer.current[item.id]);
  };

  const handleClickOutside = (event) => {
    if (
      event.target.closest('.item-list li div') === null &&
      !event.target.closest('.item-list li input[type="checkbox"]')
    ) {
      setShowButtons(null); // Reset to null
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <ul className="item-list">
      {items.map((item, index) => (
        <li
          key={index}
          className={item.completed ? 'completed' : ''}
          onTouchStart={(e) => handleLongPress(e, item)}
          onTouchEnd={(e) => handleTouchEnd(e, item)}
          onMouseDown={(e) => handleLongPress(e, item)}
          onMouseUp={(e) => handleTouchEnd(e, item)}
          onMouseLeave={(e) => handleTouchEnd(e, item)}
        >
          <input
            type="checkbox"
            checked={item.completed}
            onChange={() => onToggleComplete(item)}
          />
          <span>{item.text}</span>
          {showButtons === item.id && ( // Check if the IDs match
            <div>
              <button onClick={() => onEditItem(item)}>
                <FontAwesomeIcon icon={faFilePen} />
              </button>
              <button onClick={() => onRemoveItem(item)}>
                <FontAwesomeIcon icon={faEraser} />
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default ItemList;