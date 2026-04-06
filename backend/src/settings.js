const router = require('express').Router();
const { pool } = require('./db');

router.post('/', async (req, res) => {
    const { id, settings } = req.body;

    await pool.query(
        'UPDATE users SET settings=$1 WHERE id=$2',
        [settings, id]
    );

    res.send("OK");
});

module.exports = router;