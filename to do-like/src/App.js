import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'



const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if(list){
    return JSON.parse(list);
  } return [];
}

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if(!name){
      showAlert(true, "danger", "please enter value");
    } else if(name && isEditing){
      setList(list.map((item) => {
        if(item.id === editId){
          return {...item, title: name}
        } return item;
      }));
      setName("");
      setEditId(null);
      setIsEditing(false);
      showAlert(true, "success", "item edited");
    } else {
      showAlert(true, "success", "item added");
      const newItem = {
        id: new Date().getTime().toString(),
        title: name
      };
      setList([...list, newItem]);
      setName("");
    }
  }

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({show, type, msg});
  }

  const clearItems = () => {
    showAlert(true, "danger", "list is empty");
    setList([]);
  }

  const removeItem = (id) => {
    showAlert(true, "danger", "item removed");
    setList(list.filter((item) => item.id !== id))
  };

  const editItem = (id) => {
    const specItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditId(id);
    setName(specItem.title);
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list))
  }, [list]);

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}
        <h3>to do list</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. example"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List 
            items={list} 
            removeItem={removeItem} 
            editItem={editItem}
          />
          <button className="clear-btn" onClick={clearItems}>
            clear item
          </button>
        </div>
      )}
    </section>
  );
}

export default App
