import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const studentSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    age: Joi.number().integer().min(0).max(120).required(),
    group: Joi.string().alphanum().min(1).max(10).required(),
});

const updateStudentSchema = Joi.object({
    name: Joi.string().min(2).max(50),
    age: Joi.number().integer().min(0).max(120),
    group: Joi.string().alphanum().min(1).max(10),
}).min(1); // Require at least one field to be present for update

export const validateStudent = (req: Request, res: Response, next: NextFunction) => {
    const { error } = studentSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};

export const validateUpdateStudent = (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateStudentSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
