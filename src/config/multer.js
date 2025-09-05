import multer from "multer";

const storage = multer.memoryStorage(); //store in memory, phir send to cloudinary

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new ("Only image files are allowed"), false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 1 * 1024 * 1024
    },
    fileFilter,
})

export default upload;