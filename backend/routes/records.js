const express = require('express');
const Record = require('../models/Record');
// const upload = require('../middleware/upload');
const path = require('path');
const multer = require('multer')
const passport = require('passport');
const router = express.Router();

const fs = require('fs');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    const originalName = path.parse(file.originalname).name; // Get the original file name without extension
    cb(null, originalName + '.wav'); // Save with .wav extension
  }
});

const upload = multer({ storage: storage });

// Add new record
router.post('/addRecord', upload.array('audios'), async (req, res) => {
  const { name, cnic, address } = req.body;
  let audios = [];

  if (req.files && req.files.length > 0) {
    audios = req.files.map(file => file.path); // Collect the file paths
  }

  try {
    const recordExists = await Record.findOne({ cnic });

    if (recordExists) {
      return res.status(400).json({ message: 'Record with this CNIC already exists!' });
    }

    const newRecord = new Record({
      name,
      cnic,
      address,
      audios,
    });

    await newRecord.save();
    res.status(201).json({ message: 'Record added successfully', record: newRecord });
  } catch (error) {
    res.status(400).json({ message: 'Failed to add Record!', error: error.message });
  }
});

// Get a specific record by CNIC
router.get('/getRecord/:cnic', async (req, res) => {
  const { cnic } = req.params;

  try {
    const record = await Record.findOne({ cnic });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a record by specific audio file name
// Get a record by specific audio file name
router.get('/getRecordByAudio/:audio', async (req, res) => {
  const { audio } = req.params;

  try {
    // Use MongoDB's query operators to search for the specific audio name
    const record = await Record.findOne({ audios: { $regex: new RegExp(`${audio}$`, 'i') } });

    if (!record) {
      return res.status(404).json({ message: 'Record not found for the specified audio file!' });
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(400).json({ message: 'Failed to retrieve record!', error: error.message });
  }
});



/* Get a specific audio file
router.get('/getRecord/:cnic', async (req, res) => {
  const { cnic} = req.params;

  try {
    const record = await Record.findOne({ cnic });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    const audioPath = record.audios.find(audio => path.basename(audio) === filename);

    if (!audioPath) {
      return res.status(404).json({ message: 'Audio file not found' });
    }

    res.sendFile(audioPath); // Send the file to the client
  } catch (error) {
    res.status(400).json({ message: 'Failed to retrieve audio!', error: error.message });
  }
});
*/

// Configure multer for file uploads

// Edit a record: Add or delete audios
router.put('/editRecord/:cnic', upload.array('audio'), async (req, res) => {
  const { cnic } = req.params;
  const { deleteAudio } = req.body;

  try {
    // Find the record by CNIC
    const record = await Record.findOne({ cnic });

    if (!record) {
      return res.status(404).json({ message: 'Record not found!' });
    }

    // Add new audio if files uploaded
    if (req.files) {
      req.files.forEach(file => {
        record.audios.push(file.path);
      });
    }

    // Delete specified audio if requested
    if (deleteAudio) {
      const deleteAudioName = path.basename(deleteAudio); // Ensure the deleteAudio is a filename or path

      record.audios = record.audios.filter(audio => path.basename(audio) !== deleteAudioName);
    }

    await record.save();
    res.status(200).json({ message: 'Record updated successfully', record });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update Record!', error: error.message });
  }
});

// Delete a record
router.delete('/deleteRecord/:cnic', async (req, res) => {
  const { cnic } = req.params;

  try {
    const record = await Record.findOneAndDelete({ cnic });

    if (!record) {
      return res.status(404).json({ message: 'Record not found!' });
    }

    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete Record!', error: error.message });
  }
});

module.exports = router;
