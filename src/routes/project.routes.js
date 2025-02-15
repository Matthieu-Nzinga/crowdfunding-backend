import express from 'express';
import { createProject, getAllProjects } from '../controllers/project.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getAllProjects);
router.post('/', authMiddleware, createProject);

export default router;
