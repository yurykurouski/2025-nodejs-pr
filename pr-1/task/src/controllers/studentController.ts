import { Request, Response } from 'express';
import Student from '../models/Student';

export const getAllStudents = async (req: Request, res: Response) => {
    try {
        const students = await Student.findAll();
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getStudentById = async (req: Request, res: Response) => {
    try {
        const student = await Student.findByPk(req.params.id as string);
        if (!student) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        res.json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createStudent = async (req: Request, res: Response) => {
    try {
        const { name, age, group } = req.body;
        const newStudent = await Student.create({ name, age, group });
        res.status(201).json(newStudent);
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateStudent = async (req: Request, res: Response) => {
    try {
        const student = await Student.findByPk(req.params.id as string);
        if (!student) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }

        await student.update(req.body);
        res.json(student);
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const student = await Student.findByPk(req.params.id as string);
        if (!student) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }

        await student.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
