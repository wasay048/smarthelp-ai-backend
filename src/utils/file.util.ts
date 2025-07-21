import fs from 'fs';
import path from 'path';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadFile = (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: 'File upload failed', error: err });
        }
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // Process the file (e.g., save to database or parse content)
        // For now, just return the file information
        return res.status(200).json({ message: 'File uploaded successfully', file });
    });
};

export const saveFileToDisk = (fileName, data) => {
    const filePath = path.join(__dirname, '../uploads', fileName);
    fs.writeFileSync(filePath, data);
    return filePath;
};

export const readFileContent = (filePath) => {
    return fs.readFileSync(filePath, 'utf-8');
};

export const deleteFile = (filePath) => {
    fs.unlinkSync(filePath);
};

This utility file provides functions for handling file uploads, saving files to disk, reading file content, and deleting files. 

### Next Steps
If you would like to proceed with the backend implementation, we can move on to creating the `src/app.ts` file to set up the basic Express server. If the response limit exceeds, you can specify which part you want to focus on, such as controllers, routes, or models.