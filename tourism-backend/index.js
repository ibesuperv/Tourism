const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const UPLOAD_FOLDER = path.join(__dirname, "uploads");
const SUBMISSION_FILE = path.join(__dirname, "submissions.json");

// Ensure upload folder exists
if (!fs.existsSync(UPLOAD_FOLDER)) fs.mkdirSync(UPLOAD_FOLDER);

// === Multer storage with dynamic filename ===
const storage = multer.diskStorage({
    destination: UPLOAD_FOLDER,
    filename: (req, file, cb) => {
        const { title } = req.body;
        const slug = title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
        const ext = path.extname(file.originalname);
        const existingFiles = fs.readdirSync(UPLOAD_FOLDER).filter(f => f.startsWith(slug));
        const count = existingFiles.length + 1;
        const filename = `${slug}-${count}${ext}`;
        cb(null, filename);
    },
});
const upload = multer({ storage });

// === Read JSON from disk ===
const getSubmissions = () => {
    if (!fs.existsSync(SUBMISSION_FILE)) return [];
    return JSON.parse(fs.readFileSync(SUBMISSION_FILE, "utf8"));
};

// === Write JSON to disk ===
const saveSubmissions = (data) => {
    fs.writeFileSync(SUBMISSION_FILE, JSON.stringify(data, null, 2));
};

// === POST: Submit a new place ===
app.post("/submit", upload.array("images", 5), (req, res) => {
    const { title, description, location } = req.body;
    const files = req.files;

    if (!title || !description || !location || files.length === 0) {
        return res.status(400).json({ error: "All fields are required including images." });
    }

    const images = files.map(file => `/uploads/${file.filename}`);
    const submissions = getSubmissions();

    const newSubmission = {
        id: Date.now().toString(),
        title,
        description,
        location,
        images,
        status: "pending",
    };

    submissions.push(newSubmission);
    saveSubmissions(submissions);
    res.json({ success: true, id: newSubmission.id });
});

// === GET: All pending submissions ===
app.get("/submissions", (req, res) => {
    const data = getSubmissions();
    const pending = data.filter(sub => sub.status === "pending");
    res.json(pending);
});

// === GET: All approved submissions ===
app.get("/approved", (req, res) => {
    const data = getSubmissions();
    const approved = data.filter(sub => sub.status === "approved");
    res.json(approved);
});

// === POST: Approve or reject ===
app.post("/update-status", (req, res) => {
    const { id, status } = req.body;
    const data = getSubmissions();
    const index = data.findIndex(sub => sub.id === id);
    if (index === -1) return res.status(404).json({ error: "Submission not found." });

    data[index].status = status;
    saveSubmissions(data);
    res.json({ success: true });
});



app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
