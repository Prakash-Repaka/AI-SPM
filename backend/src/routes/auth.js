const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

console.log('Auth Service: DATA_DIR:', DATA_DIR);
console.log('Auth Service: USERS_FILE:', USERS_FILE);

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    console.log('Auth Service: Creating data directory...');
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to load users
const loadUsers = () => {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            console.log('Auth Service: No users file found, creating default admin.');
            const defaultAdmin = {
                id: 'admin-001',
                username: 'admin',
                email: 'admin@aegis.ai',
                password: crypto.createHash('sha256').update('admin123').digest('hex'),
                role: 'admin',
                createdAt: new Date().toISOString()
            };
            fs.writeFileSync(USERS_FILE, JSON.stringify([defaultAdmin], null, 2));
            return [defaultAdmin];
        }
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        const users = JSON.parse(data);
        console.log(`Auth Service: Loaded ${users.length} users.`);
        return users;
    } catch (error) {
        console.error('Auth Service: Error loading users:', error);
        return [];
    }
};

// Helper to save users
const saveUsers = (users) => {
    try {
        console.log(`Auth Service: Saving ${users.length} users to ${USERS_FILE}...`);
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        console.log('Auth Service: Users saved successfully.');
    } catch (error) {
        console.error('Auth Service: Error saving users:', error);
        throw error; // Propagate error to route handler
    }
};

// 1. Register
router.post('/register', (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !password) return res.status(400).json({ status: 'error', message: 'Missing fields' });

        const users = loadUsers();

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
        saveUsers(users);

        res.json({ status: 'success', message: 'User created' });

    } catch (e) {
        console.error('Register Error:', e);
        res.status(500).json({ status: 'error', message: e.message });
    }
});

// 2. Login
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const hash = crypto.createHash('sha256').update(password).digest('hex');

        const users = loadUsers();
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
        console.error('Login Error:', e);
        res.status(500).json({ status: 'error', message: e.message });
    }
});

// 3. Get All Users (Admin Only)
router.get('/users', (req, res) => {
    // In real app, check middleware for admin token
    try {
        const users = loadUsers();
        res.json({ status: 'success', data: users });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
});

module.exports = router;
