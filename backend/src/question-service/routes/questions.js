import express from 'express';
import { createQuestion, deleteQuestion, getAllQuestion, updateQuestion, getByTitleQuestion } from '../controller/controller.js';

const router = express.Router();

// router.post('/', async (req, res) => {
//     try {
//         const existing = await Question.findOne({ title: req.body.title });
//         if (existing) return res.status(400).json({ error: 'Question already exists' });

//         const newQuestion = await Question.create(req.body);
//         res.status(201).json(newQuestion);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// router.get('/', async (req, res) => {
//     try {
//         const { complexity, category } = req.query;
//         const filter = {};

//         if (complexity) filter.complexity = complexity;
//         if (category) filter.category = category;

//         const questions = await Question.find(filter);
//         res.json(questions);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

router.get("/", getAllQuestion)
router.get("/:title", getByTitleQuestion)
router.post("/", createQuestion)
router.put("/:id", updateQuestion)
router.delete("/:id", deleteQuestion)

export default router