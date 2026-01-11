import fs from 'fs';
import { EventEmitter } from 'events';
import Student from './models/Student';
import { EVENTS } from './constants';
import { Logger } from './Logger';

export class StudentManager extends EventEmitter {
    students: Student[];
    logger: Logger;

    constructor(logger: Logger) {
        super();
        this.students = [];
        this.logger = logger;
    }

    addStudent(student: Student) {
        this.students.push(student);
        this.emit(EVENTS.STUDENT_ADDED, student);
    }

    removeStudent(id: number) {
        this.students = this.students.filter(student => student.id !== id);
        this.emit(EVENTS.STUDENT_REMOVED, id);
    }

    getStudentById(id: number) {
        return this.students.find(student => student.id === id);
    }

    getStudentsByGroup(group: string) {
        return this.students.filter(student => student.group === group);
    }

    getAllStudents() {
        return this.students;
    }

    calculateAverageAge() {
        if (this.students.length === 0) return 0;
        const totalAge = this.students.reduce((sum, student) => sum + student.age, 0);
        return totalAge / this.students.length;
    }

    async saveToJSON(filePath: string) {
        const data = JSON.stringify(this.students, null, 2);
        await fs.promises.writeFile(filePath, data, 'utf8');
        this.emit(EVENTS.DATA_SAVED, filePath);
    }

    async loadJSON(filePath: string) {
        try {
            const data = await fs.promises.readFile(filePath, 'utf8');
            const parsedData = JSON.parse(data);
            this.students = parsedData.map(
                (s: any) => Student.build({ id: s.id, name: s.name, age: s.age, group: s.group })
            );
            this.emit(EVENTS.DATA_LOADED, filePath);
        } catch (error: any) {
            if (error.code !== 'ENOENT') { // Ignore missing file error
                if (this.logger) {
                    this.logger.log(`Error loading data from ${filePath}:`, error.message);
                }
            }
            this.students = [];
        }
    }
}
