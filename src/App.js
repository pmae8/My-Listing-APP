import React, { useState, useEffect } from "react";
import NotesTextArea from "./components/NotesTextArea";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import {
  faPlus,
  faFilePen,
  faTrash,
  faXmark,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  const [groups, setGroups] = useState(() => {
    const storedGroups = localStorage.getItem("groups");
    return storedGroups ? JSON.parse(storedGroups) : [];
  });
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(null);
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [editingGroupIndex, setEditingGroupIndex] = useState(null);
  const [newItem, setNewItem] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [showGroupList, setShowGroupList] = useState(true);
  const [addingGroup, setAddingGroup] = useState(false);
  const [longPressedGroupIndex, setLongPressedGroupIndex] = useState(null);
  const [longPressTimeout, setLongPressTimeout] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    localStorage.setItem("groups", JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    const handleBackPress = () => {
      if (!showGroupList) {
        setShowGroupList(true);
      }
    };

    window.addEventListener('popstate', handleBackPress);

    return () => {
      window.removeEventListener('popstate', handleBackPress);
    };
  }, [showGroupList]);

  const handleGroupTitleChange = (event) => {
    setNewGroupTitle(event.target.value);
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);

    if (selectedGroupIndex !== null) {
      setGroups((prevGroups) =>
        prevGroups.map((group, i) =>
          i === selectedGroupIndex
            ? { ...group, notes: event.target.value }
            : group,
        ),
      );
    }
  };

  const addGroup = () => {
    if (newGroupTitle.trim() !== "") {
      setGroups([
        ...groups,
        {
          title: newGroupTitle,
          items: [],
          removedItems: [],
          notes: "",
        },
      ]);
      setNewGroupTitle("");
    }
    setAddingGroup(false);
  };

  const deleteGroup = (index) => {
    if (
      window.confirm(
        "Are you sure you want to delete this List? This action cannot be undone.",
      )
    ) {
      const updatedGroups = [...groups];
      updatedGroups.splice(index, 1);
      setGroups(updatedGroups);
      if (selectedGroupIndex === index) {
        setSelectedGroupIndex(null);
        setShowGroupList(true);
      }
      setLongPressedGroupIndex(null);
    }
  };

  const startEditingGroup = (index) => {
    setEditingGroupIndex(index);
    setNewGroupTitle(groups[index].title);
  };

  const renameGroup = (index) => {
    if (newGroupTitle.trim() !== "") {
      setGroups((prevGroups) =>
        prevGroups.map((group, i) =>
          i === index ? { ...group, title: newGroupTitle } : group,
        ),
      );
      setEditingGroupIndex(null);
      setNewGroupTitle("");
      setLongPressedGroupIndex(null);
    }
  };

  const selectGroup = (index) => {
    setSelectedGroupIndex(index);
    setShowGroupList(false);
    setLongPressedGroupIndex(null);
    setNotes(groups[index].notes);
  };

  const handleInputChange = (event) => {
    setNewItem(event.target.value);
  };

  const addItem = () => {
    const updatedGroups = [...groups];
    const groupItems = updatedGroups[selectedGroupIndex].items;
    if (
      !groupItems.some(
        (item) => item.text.toLowerCase() === newItem.toLowerCase().trim(),
      ) &&
      newItem.trim() !== ""
    ) {
      updatedGroups[selectedGroupIndex].items = [
        ...groupItems,
        { id: Date.now(), text: newItem, completed: false }, // Adding unique ID here
      ];
      setGroups(updatedGroups);
      setNewItem("");
    }
  };

  const removeItem = (itemToRemove) => {
    if (
      window.confirm(`Are you sure you want to remove "${itemToRemove.text}"?`)
    ) {
      const updatedGroups = [...groups];
      updatedGroups[selectedGroupIndex].items = updatedGroups[
        selectedGroupIndex
      ].items.filter((item) => item.id !== itemToRemove.id); // Filtering by ID
      updatedGroups[selectedGroupIndex].removedItems = [
        ...updatedGroups[selectedGroupIndex].removedItems,
        itemToRemove,
      ];
      setGroups(updatedGroups);
    }
  };

  const retrieveItem = (itemToRetrieve) => {
    const updatedGroups = [...groups];
    updatedGroups[selectedGroupIndex].items = [
      ...updatedGroups[selectedGroupIndex].items,
      itemToRetrieve,
    ];
    updatedGroups[selectedGroupIndex].removedItems = updatedGroups[
      selectedGroupIndex
    ].removedItems.filter((item) => item.id !== itemToRetrieve.id); // Filtering by ID
    setGroups(updatedGroups);
  };

  const permanentlyDeleteItem = (itemToDelete) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete "${itemToDelete.text}"? This action cannot be undone.`,
      )
    ) {
      const updatedGroups = [...groups];
      updatedGroups[selectedGroupIndex].removedItems = updatedGroups[
        selectedGroupIndex
      ].removedItems.filter((item) => item.id !== itemToDelete.id); // Filtering by ID
      setGroups(updatedGroups);
    }
  };

  const deleteAllRemovedItems = () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete all removed items? This action cannot be undone.",
      )
    ) {
      const updatedGroups = [...groups];
      updatedGroups[selectedGroupIndex].removedItems = [];
      setGroups(updatedGroups);
    }
  };

  const deleteAllCompletedItems = () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete all completed items? This action cannot be undone.",
      )
    ) {
      const updatedGroups = [...groups];
      updatedGroups[selectedGroupIndex].items = updatedGroups[
        selectedGroupIndex
      ].items.filter((item) => !item.completed);
      setGroups(updatedGroups);
    }
  };

  const editItem = (itemToEdit) => {
    setEditingItem(itemToEdit);
    setNewItem(itemToEdit.text);
  };

  const updateItem = () => {
    const updatedGroups = [...groups];
    updatedGroups[selectedGroupIndex].items = updatedGroups[
      selectedGroupIndex
    ].items.map((item) =>
      item.id === editingItem.id // Comparing by ID
        ? { ...item, text: newItem } // Updating the text
        : item,
    );
    setGroups(updatedGroups);
    setEditingItem(null);
    setNewItem("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editingItem) {
      updateItem();
    } else {
      addItem();
    }
  };

  const toggleComplete = (itemToToggle) => {
    const updatedGroups = [...groups];
    updatedGroups[selectedGroupIndex].items = updatedGroups[
      selectedGroupIndex
    ].items.map((item) =>
      item.id === itemToToggle.id // Comparing by ID
        ? { ...item, completed: !item.completed }
        : item,
    );
    setGroups(updatedGroups);
  };

  const handleGroupLongPress = (index, event) => {
    event.preventDefault();
    const timeoutId = setTimeout(() => {
      setLongPressedGroupIndex(index);
    }, 500);
    setLongPressTimeout(timeoutId);
  };

  const handleGroupPressEnd = () => {
    clearTimeout(longPressTimeout);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const groupList = document.querySelector(".group-list");
      if (groupList && !groupList.contains(event.target)) {
        setLongPressedGroupIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="app-container">
      <h1 className="name">
        <FontAwesomeIcon icon={faListCheck} /> My Lists
      </h1>

      {showGroupList ? (
        <div className="group-list">
          {groups.map((group, index) => (
            <div
              key={index}
              className="group-item"
              onTouchStart={(event) => handleGroupLongPress(index, event)}
              onTouchEnd={handleGroupPressEnd}
              onMouseDown={(event) => handleGroupLongPress(index, event)}
              onMouseUp={handleGroupPressEnd}
              onMouseLeave={handleGroupPressEnd}
            >
              {editingGroupIndex === index ? (
                <>
                  <input
                    type="text"
                    value={newGroupTitle}
                    onChange={handleGroupTitleChange}
                    autoFocus
                  />
                  <button
                    onClick={() => renameGroup(index)}
                    className="save-button"
                  >
                    <FontAwesomeIcon icon={faFloppyDisk} />Save
                  </button>
                </>
              ) : (
                <span onClick={() => selectGroup(index)}>{group.title}</span>
              )}
              {longPressedGroupIndex === index &&
                editingGroupIndex !== index && (
                  <div>
                    <button
                      onClick={() => startEditingGroup(index)}
                      className="edit-button"
                    >
                      <FontAwesomeIcon icon={faFilePen} />Rename
                    </button>
                    <button
                      onClick={() => deleteGroup(index)}
                      id="delete-all-button"
                    >
                      <FontAwesomeIcon icon={faTrash} />Delete
                    </button>
                  </div>
                )}
            </div>
          ))}
          {addingGroup && (
            <>
              <input
                type="text"
                placeholder="New title..."
                value={newGroupTitle}
                onChange={handleGroupTitleChange}
              />
              <div>
                <button onClick={addGroup} className="save-button">
                  {newGroupTitle.trim() === "" ? (
                    <>
                      <FontAwesomeIcon icon={faXmark} /> Cancel
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faFloppyDisk} /> Save
                    </>
                  )}
                </button>
              </div>
            </>
          )}
          {!addingGroup && (
            <button
              onClick={() => setAddingGroup(true)}
              className="add-button"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setShowGroupList(true)}
            className="back-button"
          >
            ↩ Back
          </button>

          {selectedGroupIndex !== null && (
            <div>
              <h2>{groups[selectedGroupIndex].title}</h2>

              <div className="text-box">
                <NotesTextArea
                  notes={notes}
                  handleNotesChange={handleNotesChange}
                  newItem={newItem}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  editingItem={editingItem}
                  groups={groups}
                  selectedGroupIndex={selectedGroupIndex}
                  removeItem={removeItem}
                  editItem={editItem}
                  toggleComplete={toggleComplete}
                  deleteAllCompletedItems={deleteAllCompletedItems}
                  deleteAllRemovedItems={deleteAllRemovedItems}
                  retrieveItem={retrieveItem}
                  permanentlyDeleteItem={permanentlyDeleteItem}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;