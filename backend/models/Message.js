const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
    ip: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);
