const router = require('express').Router();
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');

const upload = multer({ dest: 'uploads/temp/' });

router.post('/chunk', upload.single('chunk'), async (req, res) => {
    const { index, total, name } = req.body;

    const tempDir = path.join('uploads/temp', name);
    await fs.ensureDir(tempDir);

    await fs.move(req.file.path, path.join(tempDir, index));

    if (parseInt(index) + 1 === parseInt(total)) {
        const finalPath = path.join('uploads', name);
        const writeStream = fs.createWriteStream(finalPath);

        for (let i = 0; i < total; i++) {
            const data = await fs.readFile(path.join(tempDir, i.toString()));
            writeStream.write(data);
        }

        writeStream.end();
        await fs.remove(tempDir);
    }

    res.send("OK");
});

module.exports = router;