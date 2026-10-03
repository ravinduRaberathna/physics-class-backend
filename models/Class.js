const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    }, // උදා: "2026 A/L Physics Theory"
    type: { 
      type: String, 
      enum: ['Theory', 'Revision', 'Paper'], 
      required: true 
    },
    batchYear: { 
      type: Number, 
      required: true 
    }, // 2025, 2026
    deliveryMethod: { 
      type: String, 
      enum: ['Physical', 'Online', 'Hybrid'], 
      default: 'Physical' 
    },
    image: { 
      type: String, 
      default: '' 
    }, // Class poster / banner image URL
    locations: [{ 
      type: String 
    }], // උදා: ["Nugegoda - Rotary", "Gampaha - Susipwan"]
    schedule: [
      {
        day: { type: String, required: true }, // "Sunday"
        startTime: { type: String, required: true }, // "08:00 AM"
        endTime: { type: String, required: true } // "01:00 PM"
      }
    ],
    monthlyFee: { 
      type: Number 
    },
    description: { 
      type: String 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Class', classSchema);