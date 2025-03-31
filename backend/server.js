const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Todo Model
const Todo = mongoose.model("Todo", new mongoose.Schema({
    text: String,
    completed: Boolean
}));

// Routes
app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post('/todos', async (req, res) => {
    const newTodo = new Todo({ text: req.body.text, completed: false });
    await newTodo.save();
    res.json(newTodo);
});

app.put('/todos/:id', async (req, res) => {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, { completed: req.body.completed }, { new: true });
    res.json(updatedTodo);
});

app.delete('/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
