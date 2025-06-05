import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  OriginalPrice: {
    type: Number,
    required: [true, 'Product orignal price is required'],
    min: [0, 'Price cannot be negative'],
  },
  discountPrice: { // Optional: for sale prices
    type: Number,
    min: [0, 'Discount price cannot be negative'],
    default: null,
  },
  category: {
    type:String,
    required: true,
  },
  variants: [ // An array of variants for different sizes, colors
    {
      color: { type: String, required: true, trim: true },
      colorHex: { type: String, trim: true }, // e.g., #FF0000
      size: [ { type: String, required: true,
                enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2T', '3T', 'One Size', '28', '30', '32', '34', '36', '38', '40', '42'],
                trim: true } ], // Expand as needed
      quantity: { type: Number, required: true, min: [0, 'Quantity cannot be negative'] },
      images: [ // Array of image URLs for this specific variant
        { type: String, trim: true }
      ],
      isAvailable: { type: Boolean, default: true }, // Can be set to false if stock is 0
    }
  ],
  mainImageUrl: { // Main image for the product listing
    type: String,
    required: [true, 'Main image URL is required'],
    trim: true,
  },
  // Consider other common attributes
  material: { type: String, trim: true },
  weight: { type: Number, min: 0 }, // in grams, kg, etc.
  isActive: { // For soft deletion or hiding products
    type: Boolean,
    default: true,
  },
}, { timestamps: true });


export default mongoose.models.Product || mongoose.model('Product', ProductSchema);