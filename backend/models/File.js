import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'epub', 'mobi', 'other'],
    default: 'other'
  },
  filePath: {
    type: String,
    required: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: 'uploadedAt', updatedAt: 'updatedAt' }
});

// Indexes
fileSchema.index({ bookId: 1 });
fileSchema.index({ isDeleted: 1 });

const File = mongoose.model('File', fileSchema);

export default File;
