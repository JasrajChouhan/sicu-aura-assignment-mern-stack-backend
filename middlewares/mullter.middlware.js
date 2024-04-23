import multer from 'multer'


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    },
});

export const multerUpload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
})



