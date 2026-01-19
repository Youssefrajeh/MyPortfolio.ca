import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: function() {
      // Password is required only if not using OAuth
      return !this.oauthProvider;
    }
  },
  fullName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  avatarUrl: {
    type: String
  },
  // OAuth fields
  oauthProvider: {
    type: String,
    enum: ['google', 'github', 'microsoft', null],
    default: null
  },
  oauthId: {
    type: String
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true // Creates createdAt and updatedAt
});

// Index for OAuth lookups (email and username already have unique indexes)
userSchema.index({ oauthProvider: 1, oauthId: 1 });

// Hash password before saving (async functions don't need next())
userSchema.pre('save', async function() {
  if (!this.isModified('passwordHash') || !this.passwordHash) {
    return;
  }
  
  // If passwordHash is not already hashed (plain password)
  if (!this.passwordHash.startsWith('$2')) {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    this.passwordHash = await bcrypt.hash(this.passwordHash, rounds);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Transform output (hide sensitive fields)
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

// Static method to find by credentials
userSchema.statics.findByCredentials = async function(username, password) {
  const user = await this.findOne({ 
    $or: [{ username }, { email: username }],
    isActive: true 
  });
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
