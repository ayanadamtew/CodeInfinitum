import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  notes: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0,
    index: true // useful for sorting
  }
}, { timestamps: true }); 

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;
