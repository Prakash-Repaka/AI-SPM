const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Mock User Store (In-memory for demo, persists in server lifetime)
// In a real app, this would be in MongoDB or Neo4j
const users = [
    {
        id: 'admin-001',
        username: 'admin',
        email: 'admin@aegis.ai',
        password: crypto.createHash('sha256').update('admin123').digest('hex'),
        role: 'admin',
        createdAt: new Date().toISOString()
    }
];

// 1. Register
router.post('/register', (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !password) return res.status(400).json({ status: 'error', message: 'Missing fields' });

        if (users.find(u => u.username === username)) {
            return res.status(400).json({ status: 'error', message: 'Username taken' });
        }

        const newUser = {
            id: crypto.randomUUID(),
            username,
            email: email || '',
            password: crypto.createHash('sha256').update(password).digest('hex'), // Store Hash
            role: 'user', // Default role
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        res.json({ status: 'success', message: 'User created' });

    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
});

// 2. Login
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const hash = crypto.createHash('sha256').update(password).digest('hex');

        const user = users.find(u => u.username === username && u.password === hash);

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        // Return pseudo-token (just user ID for demo)
        res.json({
            status: 'success',
            token: user.id,
            user: { username: user.username, role: user.role }
        });

    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
});

// 3. Get All Users (Admin Only)
router.get('/users', (req, res) => {
    // In real app, check middleware for admin token
    res.json({ status: 'success', data: users });
});

module.exports = router;
