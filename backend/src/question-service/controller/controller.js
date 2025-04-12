import Question from "../models/Question.js";
import mongoose from "mongoose";

export const getAllQuestion = async (req, res) => {
  try {
    const question = await Question.find({});
    const formattedQuestion = question.map(
      ({ _id, title, description, category, complexity }) => {
        return { _id, title, description, category, complexity };
      }
    );
    res.status(200).json({ question });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getByTitleQuestion = async (req, res) => {
  try {
    const { title } = req.params;
    //const question = await Question.find({title: {$regex: title , $options: "i"}})
    const question = await Question.find({ title: req.body.title });
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createQuestion = async (req, res) => {
  const question = req.body;
  const checkQuestionExist = await Question.findOne({ title: req.body.title });

  if (
    !question.title ||
    !question.description ||
    !question.categories ||
    !question.complexity
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  } else if (checkQuestionExist) {
    return res.status(404).json({
      success: false,
      message: "Duplicate title found! Please select a different title.",
    });
  }
  const newQuestion = new Question(question);
  try {
    await newQuestion.save();
    res.status(200).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const question = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Invalid Question Id(Question not found)!",
    });
  }

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(id, question, {
      new: true,
    });
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Invalid Question Id(Question not found)!",
    });
  }
  try {
    await Question.findByIdAndDelete(id);
    res.status(200).json({ sucess: true, message: "Question deleted!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error!" });
  }
};

export const getRandomQuestion = async (req, res) => {
  try {
    const { complexity, categories } = req.query;
    const matchStage = {};

    //Filter condition
    if (complexity) {
      matchStage.complexity = complexity;
    }
    if (categories) {
      const categoriesArray = categories.split(",");
      matchStage.categories = { $all: categoriesArray };
    }

    //Execute query
    const randomQuestion = await Question.aggregate([
      { $match: matchStage },
      { $sample: { size: 1 } },
    ]);

    if (!randomQuestion.length) {
      return res.status(404).json({
        success: false,
        message: "No questions found matching the criteria",
      });
    }

    res.status(200).json({
      success: true,
      data: randomQuestion[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getQuestionById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Question ID",
    });
  }

  try {
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
