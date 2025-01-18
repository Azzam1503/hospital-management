import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    
    destination: function(req, file, callback){
        const uploadPath = path.join(__dirname, '..', 'public', 'temp');
        callback(null, uploadPath);
    },

    filename: function(req, file, callback){
        callback(null, file.originalname);
    }
});

const upload = multer({storage});

export default upload;