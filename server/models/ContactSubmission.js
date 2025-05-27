import mongoose from 'mongoose';

const contactSubmissionSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true, 
    minlength: 2, 
    maxlength: 100 },
  email: { 
    type: String, 
    required: true, 
    trim: true, lowercase: true, match: [/\S+@\S+\.\S+/, 'is invalid'] },
  subject: { type: String, required: true, trim: true, minlength: 3, maxlength: 150 },
  message: { type: String, required: true, trim: true, minlength: 10, maxlength: 5000 },
  status: { type: String, enum: ['new', 'resolved'], default: 'new' },
  isRead: { type: Boolean, default: false }, // Can be redundant if using status
  respondedAt: { type: Date, default: null },
  notes: { type: String, trim: true, default: '' },
  submittedAt: { type: Date, default: Date.now }
});

contactSubmissionSchema.index({ email: 1 });
contactSubmissionSchema.index({ submittedAt: -1 });
contactSubmissionSchema.index({ status: 1 });

const ContactSubmission = mongoose.model('ContactSubmission', contactSubmissionSchema);

export default ContactSubmission;