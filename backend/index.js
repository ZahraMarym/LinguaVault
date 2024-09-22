const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");
const userRoutes = require("./routes/user");
const recordRoutes = require("./routes/records");
const multer = require("multer")
const upload = require('./middleware/upload');
// const upload = multer({ dest: 'uploads/' });
const dotenv = require("dotenv");
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');


dotenv.config();
const app = express();
const port = 5000;
app.use(require('cors')());


// Middleware for parsing JSON bodies
app.use(express.json());

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log("Connection Failed!", err);
  });

// passport-jwt setup
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET || "secret"; // Use environment variable for the secret key
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.identifier);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);




//translation api
app.post('/translate', (req, res) => {
  const textToTranslate = req.body.text;

  if (!textToTranslate) {
      return res.status(400).json({ error: 'No text provided' });
  }

  const scriptPath = path.join("Z:/LinguaVault/Inotech/models/translation", 'test.py');
const venv = "Z:/LinguaVault/Inotech/models/translation/env/Scripts/python.exe";

exec(`"${venv}" "${scriptPath}" "${textToTranslate}"`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        console.error(stderr);
        return res.status(500).json({ error: 'Translation failed' });
    }
    res.json({ translation: stdout.trim() });
});

});



app.post('/transcribe', upload.single('audio'), (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
  }
  const audioPath = req.file.path; // Path to the uploaded audio file
 
  // path.join("Z:/LinguaVaultInotech", 'uploads', "audio.wav");
  
  // Define the path to your Python script
  const scriptPath = path.join("Z:/LinguaVault/Inotech", 'models', 'transcription', 'test.py');
  const venv="Z:/LinguaVault/Inotech/models/transcription/myenv/Scripts/python.exe"

  // Execute the Python script with the audio file path as an argument
  exec(`${venv} "${scriptPath}" "${audioPath}"`, (error, stdout, stderr) => {
      if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).json({ error: 'Error during transcription' });
      }

      // Clean up the uploaded file
      fs.unlinkSync(audioPath);
      res.json({ transcription: stdout.trim() });
  });
});









// Initialize passport middleware
app.use(passport.initialize());
app.use(express.json());


// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello world");
});

// Routes
app.use("/user", userRoutes);
app.use("/records", recordRoutes);
app.use("/uploads", express.static("uploads")); // Serve uploaded files statically

// Start the server
app.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});
