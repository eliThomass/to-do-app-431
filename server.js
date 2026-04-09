import express from 'express';
import mongoose from 'mongoose';
import { List } from './models.js';

const app = express();
app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/Thomas-HW7');

// Create a new list
app.post('/api/lists', async (req, res) => {
    try {
        const newList = new List(req.body);
        await newList.save();
        res.status(201).json(newList);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// View all list titles
app.get('/api/lists', async (req, res) => {
    const lists = await List.find({}, 'Title');
    res.json(lists);
});

// Create a new to-do within a list
app.post('/api/lists/:id/entries', async (req, res) => {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).send("List not found");
    
    list.Entries.push(req.body); 
    await list.save();
    res.status(201).json(list);
});

// View specific list entries
app.get('/api/lists/:id', async (req, res) => {
    const list = await List.findById(req.params.id);
    res.json(list);
});

// Update status 
app.patch('/api/lists/:listId/entries/:entryId', async (req, res) => {
    const { listId, entryId } = req.params;
    const list = await List.findById(listId);
    const entry = list.Entries.id(entryId);
    entry.Status = req.body.Status;
    await list.save();
    res.json(list);
});

// Delete individual entry
app.delete('/api/lists/:listId/entries/:entryId', async (req, res) => {
    await List.findByIdAndUpdate(req.params.listId, {
        $pull: { Entries: { _id: req.params.entryId } }
    });
    res.status(204).send();
});

// Delete a list
app.delete('/api/lists/:id', async (req, res) => {
    await List.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
