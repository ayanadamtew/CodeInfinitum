import mongoose from 'mongoose';

const codeSchema = new mongoose.Schema({
  javascript: String,
  python: String,
  java: String,
  cpp: String
}, { _id: false });

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  statement: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  constraints: [{
    type: String
  }],
  timeLimit: {
    type: Number,
    default: 1000 // milliseconds
  },
  memoryLimit: {
    type: Number,
    default: 128000 // KB
  },
  initialCode: codeSchema,
  testCases: [{
    input: String,
    expectedOutput: String,
    isVisible: {
      type: Boolean,
      default: false
    }
  }],
  solution: {
    explanation: String,
    code: codeSchema,
    complexity: {
      time: String,
      space: String
    }
  },
  visualizationAssetUrl: String
}, { timestamps: true }); // This adds createdAt and updatedAt automatically

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
