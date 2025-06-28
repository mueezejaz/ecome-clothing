import dbConnect from '@/app/lib/dbConnect';
import Product from '@/app/models/model.Product';
import { NextResponse } from 'next/server';
import { handleRouteError } from '@/app/utils/handleRouteError';
import mongoose from 'mongoose';

import ApiError from '@/app/utils/ApiError'; // Import ApiError for consistency

// Helper to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const GET = handleRouteError(async (request, { params }) => {
  await dbConnect();

  const { id } = params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid product ID format");
  }

  const currentProduct = await Product.findById(id);

  if (!currentProduct) {
    throw new ApiError(404, "Product not found");
  }

  // Fetch related products: in the same category, excluding the current product
  // Limit to a certain number, e.g., 5 related products
  const relatedProducts = await Product.find({
    category: currentProduct.category,
    _id: { $ne: currentProduct._id } // Exclude the current product itself
  }).limit(5); // You can adjust the limit as needed

  // It's good practice to also check if relatedProducts array is empty, though not strictly an error
  // if (relatedProducts.length === 0) {
  //   console.log(`No related products found for category: ${currentProduct.category} (excluding product ${id})`);
  // }

  return NextResponse.json({
    success: true, // Keep success field for consistency if frontend expects it
    message: "Related products fetched successfully!", // More descriptive message
    data: relatedProducts
  }, { status: 200 });
});
