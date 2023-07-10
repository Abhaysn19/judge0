
const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const User = require('../models/User');
const { runCode } = require('../sandbox');


router.post('/', async (req, res, next) => {
  try {
    const { userId, language, code } = req.body;

    const io=req.io;
    // console.log(io)
    const newSubmission = new Submission({
      userId,
      language,
      code,
    });

    
    await newSubmission.save();

  
    const user = await User.findById(userId);
    if(!user){
      res.status(404).json({message:'User not found'})
    }

    runCode(language, code, (result) => {
      io.emit('submissionResult',result);
      res.status(201).json({ message: 'Submission created successfully', result:result });
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
