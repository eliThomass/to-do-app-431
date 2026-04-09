import mongoose from 'mongoose';

const textEntrySchema = new mongoose.Schema({
    Text: { type: String, required: true },
    Status: { type: Boolean, default: false }
});

const listSchema = new mongoose.Schema({
    Title: { type: String, required: true },
    Entries: [textEntrySchema]
});

export const List = mongoose.model('List', listSchema);
