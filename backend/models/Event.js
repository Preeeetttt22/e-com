import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    location: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    image: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


export default mongoose.model('Event', eventSchema);
