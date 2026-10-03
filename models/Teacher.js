const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true }, // උදා: "B.Sc. Eng (Hons)"
    bio: { type: String, required: true },
    profileImage: { type: String, default: '' },
    contactInfo: {
      phone: String,
      whatsapp: String,
      email: String
    },
    socialLinks: {
      youtube: String,
      facebook: String,
      telegram: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', teacherSchema);