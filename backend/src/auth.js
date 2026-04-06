const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('./db');

const SECRET = "SECRET";

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    await pool.query(
        'INSERT INTO users VALUES ($1,$2,$3,$4)',
        [uuidv4(), username, hash, {}]
    );

    res.send("OK");
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const result = await pool.query(
        'SELECT * FROM users WHERE username=$1',
        [username]
    );

    const user = result.rows[0];
    if (!user) return res.sendStatus(400);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.sendStatus(400);

    const token = jwt.sign({ id: user.id }, SECRET);
    res.json({ token });
});

module.exports = router;