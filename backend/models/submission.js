// models/Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  language: { type: String, required: true },
  code: { type: String, required: true },
  result: { type: String },
});

module.exports = mongoose.model('Submission', submissionSchema);
