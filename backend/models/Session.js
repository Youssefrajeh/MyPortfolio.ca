import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionToken: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Index for cleanup queries
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index - auto-delete expired sessions

// Static method to create session
sessionSchema.statics.createSession = async function(userId, ipAddress, userAgent) {
  const { v4: uuidv4 } = await import('uuid');
  
  const sessionToken = uuidv4();
  const expiresAt = new Date();
  const expiryHours = parseInt(process.env.SESSION_EXPIRY_HOURS) || 24;
  expiresAt.setHours(expiresAt.getHours() + expiryHours);
  
  const session = await this.create({
    userId,
    sessionToken,
    expiresAt,
    ipAddress,
    userAgent
  });
  
  return session;
};

// Static method to validate session and get user
sessionSchema.statics.validateSession = async function(sessionToken) {
  const session = await this.findOne({
    sessionToken,
    expiresAt: { $gt: new Date() }
  }).populate({
    path: 'userId',
    match: { isActive: true },
    select: 'username email fullName role avatarUrl'
  });
  
  if (!session || !session.userId) {
    return null;
  }
  
  return session.userId;
};

const Session = mongoose.model('Session', sessionSchema);

export default Session;
