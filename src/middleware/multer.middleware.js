import multer from "multer";

// Set up multer storage (where you want to save the uploaded files)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the folder to save the uploaded file
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Use a unique filename
  },
});

// Initialize multer with storage settings
export const upload = multer({ storage });
