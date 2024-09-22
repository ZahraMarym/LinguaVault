const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { getToken } = require("../middleware/helpers");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.resolve("uploads/"); // Get the absolute path of the upload directory
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep the original file name
  },
});

const upload = multer({ storage: storage });

// POST route for user registration (signup)
router.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(403)
        .json({ error: "A user with this email already exists" });
    }

    // Hash the password before saving it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    // Generate a token for the new user
    const token = await getToken(newUser.email, newUser);

    // Return the user object along with the token, excluding the password
    const userToReturn = { ...newUser.toJSON(), token };
    delete userToReturn.password;

    return res.status(200).json(userToReturn);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
  }
});

// POST route for user login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if a user with the given email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    // Generate a token for the user
    const token = await getToken(user.email, user);

    // Return the user object along with the token, excluding the password
    const userToReturn = { ...user.toJSON(), token };
    delete userToReturn.password;

    return res.status(200).json(userToReturn);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred during login" });
  }
});



// Route to upload audio and get top matches
router.post("/match", upload.single("audio"), (req, res) => {
    // Check if a file has been uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
  
    const datasetDir = "Z:/LinguaVault/Inotech/models/dataset";
    const audiopath = req.file.path; // Full path to the uploaded file
    const audioFileName = req.file.filename; // Get the filename
  
    console.log("Audio Path:", audiopath);
    console.log("Audio File Name:", audioFileName);
  
    const venv = "Z:/LinguaVault/Inotech/models/matching/venv/Scripts/python.exe";
  
    // Call the Python script
    const pythonProcess = exec(
      `${venv} Z:/LinguaVault/Inotech/models/matching/test.py ${audiopath} ${datasetDir}`
    );
  
    let result = "";
  
    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });
  
    pythonProcess.stderr.on("data", (data) => {
      console.error("Error:", data.toString());
    });
  
    pythonProcess.on("close", (code) => {
      if (code === 0) {
        // Send the result back to the client
        res.status(200).json(JSON.parse(result));
      } else {
        res.status(500).json({ message: "Failed to process audio file" });
      }
    });
  });
  
module.exports = router;
