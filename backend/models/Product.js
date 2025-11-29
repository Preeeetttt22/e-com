import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ type: String }], // URLs or relative paths
    tags: [{ type: String }],
    quantity: { type: Number, required: true, default: 0 },
    isFeaturedOnHome: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false, },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model('Product', productSchema);
