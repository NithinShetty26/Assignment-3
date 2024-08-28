const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('./server'); 

beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect('mongodb+srv://nithinkumar02:N%40thin%40388@cluster0.mlzop.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    // Close the server
    server.close();
    
    // Drop the test database and disconnect
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
});

describe('User API', () => {
    it('should create a new user', async () => {
        const response = await request(app)
            .post('/users')
            .send({ name: 'John Doe', email: 'john@example.com' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('name', 'John Doe');
    });

    it('should get a list of users', async () => {
        await request(app)
            .post('/users')
            .send({ name: 'Jane Doe', email: 'jane@example.com' });

        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should update a user', async () => {
        const user = await request(app)
            .post('/users')
            .send({ name: 'Mark Smith', email: 'mark@example.com' });

        const userId = user.body._id;
        const response = await request(app)
            .put(`/users/${userId}`)
            .send({ name: 'Mark Updated' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', 'Mark Updated');
    });
});
