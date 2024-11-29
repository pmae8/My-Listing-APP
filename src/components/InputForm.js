import React from 'react';

function InputForm({ newItem, handleInputChange, handleSubmit, editingItem }) {
  return (
    <form onSubmit={handleSubmit} className="input-form">
      <input
        type="text"
        placeholder="Add list or item here..."
        value={newItem}
        onChange={handleInputChange}
      />
      <button type="submit">{editingItem ? 'Update' : 'Add List'}</button>
    </form>
  );
}

export default InputForm;