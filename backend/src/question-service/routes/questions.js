import express from 'express';
import {
    createQuestion,
    deleteQuestion,
    getAllQuestion,
    updateQuestion,
    getByTitleQuestion,
    getRandomQuestion
} from '../controller/controller.js';

const router = express.Router();

router.get("/", getAllQuestion)
router.get("/random", getRandomQuestion)
router.get("/:title", getByTitleQuestion)
router.post("/", createQuestion)
router.put("/:id", updateQuestion)
router.delete("/:id", deleteQuestion)

export default router