import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  _id: { 
    type: String,
    required: true
  },
  expires: { 
    type: Date,
    required: true
  },
  session: {
    cookie: {
      path: { type: String, default: '/' },
      httpOnly: { type: Boolean, default: true },
      secure: { type: Boolean, default: true },
      maxAge: { type: Number, default: 1000 * 60 * 60 * 24 }, // 24 hours
    },
    userData: {
      isAuthenticated: { type: Boolean, default: false },
      forgotPassword: { type: Boolean, default: false },
      userID: { type: mongoose.Schema.Types.ObjectId, required: true },
      userEmail: { type: String, required: true },
      userName: { type: String, required: true },
      userSurname: { type: String, required: true },
      userPhoneNumber: { type: String, required: true },
      csrfToken: { type: String, required: true },
    }
  }
});

const sessionModel = mongoose.model('alkebulan_sessions', SessionSchema);

export default sessionModel;
