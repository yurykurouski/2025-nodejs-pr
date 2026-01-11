import express from 'express';
import * as studentController from '../controllers/studentController';
import { validateStudent, validateUpdateStudent } from '../middleware/validation';

const router = express.Router();

// GET /students - Get all students
router.get('/', studentController.getAllStudents);

// GET /students/:id - Get student by ID
router.get('/:id', studentController.getStudentById);

// POST /students - Create new student
router.post('/', validateStudent, studentController.createStudent);

// PUT /students/:id - Update student
router.put('/:id', validateUpdateStudent, studentController.updateStudent);

// DELETE /students/:id - Delete student
router.delete('/:id', studentController.deleteStudent);

export default router;
