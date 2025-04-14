import express from 'express';
import { createNewCollab } from '../controller/collab-controller.js';

const router = express.Router();

router.post("/create-new-collab", createNewCollab);

export default router