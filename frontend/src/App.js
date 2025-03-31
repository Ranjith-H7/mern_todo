import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState("");
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8080/todos")
            .then(res => setTodos(res.data))
            .catch(err => console.log(err));
    }, []);

    const addOrEditTodo = () => {
        if (text.trim() === "") {
            alert("Field cannot be empty");
            return;
        }

        if (editId) {
            // Update existing todo
            axios.put(`http://localhost:8080/todos/${editId}`, { text })
                .then(res => {
                    setTodos(todos.map(todo => 
                        todo._id === editId ? { ...todo, text: text } : todo
                    ));
                    setEditId(null);
                    setText("");
                })
                .catch(err => console.log("Update Error:", err));
        } else {
            // Add new todo
            axios.post("http://localhost:8080/todos", { text })
                .then(res => {
                    setTodos([...todos, res.data]);
                    setText("");
                })
                .catch(err => console.log("Add Error:", err));
        }
    };

    const toggleTodo = (id, completed) => {
        axios.put(`http://localhost:8080/todos/${id}`, { completed: !completed })
            .then(res => {
                setTodos(todos.map(todo => 
                    todo._id === id ? { ...todo, completed: res.data.completed } : todo
                ));
            })
            .catch(err => console.log("Toggle Error:", err));
    };

    const deleteTodo = id => {
        axios.delete(`http://localhost:8080/todos/${id}`)
            .then(() => {
                setTodos(todos.filter(todo => todo._id !== id));
            })
            .catch(err => console.log("Delete Error:", err));
    };

    const editTodo = (id, text) => {
        setEditId(id);
        setText(text);
    };

    return (
        <div style={{ maxWidth: "400px", margin: "20px auto", textAlign: "center" }}>
            <h1>To-Do List</h1>
            <input 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                placeholder="Add a task..."
                style={{ padding: "8px", width: "80%" }}
            />
            <button onClick={addOrEditTodo} style={{ padding: "8px", marginLeft: "10px" }}>
                {editId ? "Update" : "Add"}
            </button>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {todos.map(todo => (
                    <li key={todo._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #ccc" }}>
                        <span style={{ textDecoration: todo.completed ? "line-through" : "" }}>{todo.text}</span>
                        <div>
                            <button onClick={() => toggleTodo(todo._id, todo.completed)} style={{ marginRight: "5px" }}>✔</button>
                            <button onClick={() => editTodo(todo._id, todo.text)} style={{ marginRight: "5px" }}>✏</button>
                            <button onClick={() => deleteTodo(todo._id)}>❌</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
