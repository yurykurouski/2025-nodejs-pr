const fs = require('fs');
const Student = require('./Student');

class StudentManager {
    constructor(logger) {
        this.students = [];
        this.logger = logger;
    }

    addStudent(student) {
        this.students.push(student);
    }

    removeStudent(id) {
        this.students = this.students.filter(student => student.id !== id);
    }

    getStudentById(id) {
        return this.students.find(student => student.id === id);
    }

    getStudentsByGroup(group) {
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

    async saveToJSON(filePath) {
        const data = JSON.stringify(this.students, null, 2);
        await fs.promises.writeFile(filePath, data, 'utf8');
    }

    async loadJSON(filePath) {
        try {
            const data = await fs.promises.readFile(filePath, 'utf8');
            const parsedData = JSON.parse(data);
            this.students = parsedData.map(
                s => new Student(s.id, s.name, s.age, s.group)
            );
        } catch (error) {
            if (error.code !== 'ENOENT') { // Ignore missing file error
                if (this.logger) {
                    this.logger.log(`Error loading data from ${filePath}:`, error.message);
                }
            }
            this.students = [];
        }
    }
}

module.exports = StudentManager;
