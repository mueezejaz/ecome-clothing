import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Product from "@/app/models/model.Product";
import ApiError from "@/app/utils/ApiError";
import handleRouteError from "@/app/utils/handleRouteError";
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary'; // Import Cloudinary SDK

// Helper to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// GET: Fetch a single product by ID
export const GET = handleRouteError(async (req, { params }) => {
  await dbConnect();
  const { id } = await params;
  console.log("the id is ", id)
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid product ID format.");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return NextResponse.json({
    message: "Product fetched successfully!",
    data: product,
  }, { status: 200 });
});

// PUT: Update an existing product by ID
export const PUT = handleRouteError(async (req, { params }) => {
  await dbConnect();
  const { id } = await params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid product ID format.");
  }

  const body = await req.json();

  // Optional: Add specific checks for fields that shouldn't be updated or require special handling
  // For example, prevent changing immutable fields or manage image updates carefully

  if (Object.keys(body).length === 0) {
    throw new ApiError(400, "Request body cannot be empty for an update operation.");
  }

  // Ensure mainImage and variants structure is validated if present in body
  if (body.mainImage && (!body.mainImage.imageUrl || !body.mainImage.publicId)) {
    throw new ApiError(400, "Main image details (imageUrl, publicId) are required if mainImage is being updated.");
  }

  if (body.variants && Array.isArray(body.variants)) {
    if (body.variants.length === 0) {
      throw new ApiError(400, "Product variants array cannot be empty if provided for update.");
    }
    for (const variant of body.variants) {
      const requiredVariantFields = ['color', 'size', 'quantity', 'images'];
      for (const field of requiredVariantFields) {
        // Check if field exists and is not null for existing variants being updated
        // For new variants being added in an update, these would be required
        if (variant.hasOwnProperty(field) && (variant[field] === undefined || variant[field] === null)) {
          throw new ApiError(400, `Variant ${field.charAt(0).toUpperCase() + field.slice(1)} is required if variant is being updated.`);
        }
      }
      if (variant.images && (!Array.isArray(variant.images) || variant.images.length === 0)) {
        throw new ApiError(400, "At least one image is required for each variant if images are being updated.");
      }
      if (variant.images) {
        for (const image of variant.images) {
          if (!image.imageUrl || !image.publicId) {
            throw new ApiError(400, "Variant image details (imageUrl, publicId) are required if images are being updated.");
          }
        }
      }
    }
  }


  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body }, // Use $set to only update provided fields
      { new: true, runValidators: true, context: 'query' } // Return updated doc, run schema validators
    );

    if (!updatedProduct) {
      throw new ApiError(404, "Product not found or couldn't be updated.");
    }

    return NextResponse.json({
      message: "Product updated successfully!",
      data: updatedProduct,
    }, { status: 200 });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new ApiError(400, "Validation failed: " + messages.join(', '));
    }
    console.error("Error updating product:", error); // Log other errors
    throw new ApiError(500, "An unexpected error occurred while updating the product.");
  }
});

// DELETE: Delete a product by ID
export const DELETE = handleRouteError(async (req, { params }) => {
  await dbConnect();
  const { id } = params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid product ID format.");
  }
  let imagesPublicId = []
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }
  imagesPublicId.push(product.mainImage.publicId);
  product.variants.forEach(el => {
    el.images.forEach(elm => {
      if (elm.publicId) {
        imagesPublicId.push(elm.publicId);
      }
    })
  });
  cloudinary.api.delete_resources(imagesPublicId, (error, result) => {
    if (error) {
      new ApiError(400, 'Error deleting images:');
    }
  });
  const deletedProduct = await Product.findByIdAndDelete(id);
  if (!deletedProduct) {
    throw new ApiError(404, "Product not found or couldn't be deleted.");
  }

  return NextResponse.json({
    message: "Product deleted successfully!",
    data: { id: deletedProduct._id },
  }, { status: 200 });
});
