import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: { type: String, required: true },
    categories: {
        type: [String],
        required: true
    },
    complexity: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard']
    }
    //link: { type: String, required: true }
});

const Question = mongoose.model('Question', questionSchema);
export default Question;