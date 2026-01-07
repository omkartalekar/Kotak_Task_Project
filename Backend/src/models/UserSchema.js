const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["USER", "PROVIDER", "ADMIN"], default: "USER", index: true },

    avatar: { type: String, default: "https://i.pravatar.cc/150" },
    age: Number,

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },

    specialization: String,
    experienceYears: Number,
    consultationFee: Number,
    permissions: [String],
    
    // Timezone support for user preferences
    timezone: { type: String, default: 'UTC' },
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);
