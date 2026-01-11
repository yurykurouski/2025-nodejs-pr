import { StudentManager } from './StudentManager';
import { Logger } from './Logger';
import Student from './models/Student';

export function demo(manager: StudentManager, logger: Logger) {
    //adding a new student
    const newStudent = Student.build({ id: 4, name: 'Alice Wonderland', age: 19, group: '1' });
    logger.log('Adding new student:', newStudent);
    manager.addStudent(newStudent);

    logger.log('All Students:', manager.getAllStudents());

    logger.log('Average Age:', manager.calculateAverageAge());

    const studentId = 1;
    const student = manager.getStudentById(studentId);
    if (student) {
        logger.log(`Student with ID ${studentId}:`, student);
    } else {
        logger.log(`Student with ID ${studentId} not found.`);
    }

    const group = '2';
    const studentsInGroup = manager.getStudentsByGroup(group);
    logger.log(`Students in group ${group}:`, studentsInGroup);
}