import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp']
  },
  code: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Running', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Runtime Error', 'Compile Error'],
    default: 'Pending'
  },
  executionTime: {
    type: Number
  },
  memoryUsage: {
    type: Number
  },
  submissionTime: {
    type: Date,
    default: Date.now
  },
  results: [{
    testCaseId: mongoose.Schema.Types.ObjectId,
    status: {
      type: String,
      enum: ['Pass', 'Fail', 'Error']
    },
    output: String,
    expectedOutput: String,
    executionTime: Number,
    memoryUsage: Number,
    errorMessage: String
  }]
});

// Index for faster queries
submissionSchema.index({ userId: 1, problemId: 1 });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;