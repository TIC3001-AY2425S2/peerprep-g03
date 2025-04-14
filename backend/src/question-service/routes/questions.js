import express from "express";
import {
  createQuestion,
  deleteQuestion,
  getAllQuestion,
  getQuestionById,
  updateQuestion,
  getByTitleQuestion,
  getRandomQuestion,
} from "../controller/controller.js";

const router = express.Router();

router.get("/", getAllQuestion);
router.get("/random", getRandomQuestion);
router.get("/:id", getQuestionById);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);
router.get("/:title", getByTitleQuestion);
router.post("/", createQuestion);

export default router;
