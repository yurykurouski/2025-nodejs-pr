import request from 'supertest';
import app from '../src/server';
import sequelize from '../src/config/database';
import Student from '../src/models/Student';

describe('Student API', () => {
    let token: string;
    let userId: string;

    beforeAll(async () => {
        // Sync database before tests
        // force: true clears the database
        await sequelize.sync({ force: true });

        // Register a user to get token
        const res = await request(app)
            .post('/auth/register')
            .send({
                email: 'student@example.com',
                password: 'password123',
                name: 'Student',
                surname: 'User'
            });
        token = res.body.token;
        userId = res.body.user.id;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(async () => {
        // Clear students after each test to maintain isolation
        await Student.destroy({ where: {} });
    });

    describe('POST /students (Create)', () => {
        it('should create a new student', async () => {
            const res = await request(app)
                .post('/students')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'John Doe',
                    age: 20,
                    group: 'CS101'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.name).toEqual('John Doe');
        });

        it('should return 400 for invalid data', async () => {
            const res = await request(app)
                .post('/students')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'J', // Too short
                    age: 20,
                    group: 'CS101'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('GET /students (Read)', () => {
        it('should return all students', async () => {
            await Student.create({ name: 'Jane', age: 22, group: 'CS102', userId });

            const res = await request(app)
                .get('/students')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toEqual(1);
            expect(res.body[0].name).toEqual('Jane');
        });

        it('should return empty array when no students', async () => {
            const res = await request(app)
                .get('/students')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });
    });

    describe('GET /students/:id (Read One)', () => {
        it('should return a student by id', async () => {
            const student = await Student.create({ name: 'Bob', age: 25, group: 'CS103', userId });

            const res = await request(app)
                .get(`/students/${student.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toEqual('Bob');
        });

        it('should return 404 for non-existent student', async () => {
            const res = await request(app)
                .get('/students/9999')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(404);
        });
    });

    describe('PUT /students/:id (Update)', () => {
        it('should update a student', async () => {
            const student = await Student.create({ name: 'Bob', age: 25, group: 'CS103', userId });

            const res = await request(app)
                .put(`/students/${student.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ age: 26 });

            expect(res.statusCode).toEqual(200);
            expect(res.body.age).toEqual(26);

            // Verify in DB
            const updated = await Student.findByPk(student.id);
            expect(updated?.age).toEqual(26); // Use optional chaining or check for null
        });
    });

    describe('DELETE /students/:id (Delete)', () => {
        it('should delete a student', async () => {
            const student = await Student.create({ name: 'Bob', age: 25, group: 'CS103', userId });

            const res = await request(app)
                .delete(`/students/${student.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(204);

            // Verify in DB
            const deleted = await Student.findByPk(student.id);
            expect(deleted).toBeNull();
        });
    });
});
