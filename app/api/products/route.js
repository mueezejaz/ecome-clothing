import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Product from "@/app/models/model.Product";
import ApiError from "@/app/utils/ApiError";
import handleRouteError from "@/app/utils/handleRouteError";
import mongoose from "mongoose";

// IMPORTANT: Protect these routes with authentication and authorization!
// Ensure only authenticated users, and perhaps only those with an 'admin' role,
// can access these endpoints, especially POST.
// Example using a hypothetical middleware: import { requireAdminAuth } from "@/app/lib/authMiddleware";
// export const POST = handleRouteError(requireAdminAuth(async (req) => { ... }));
import mongoose from "mongoose";

// POST: Create a new product
export const POST = handleRouteError(async (req) => {
  await dbConnect();

  const body = await req.json();

  // Basic validation (more detailed validation is handled by Mongoose schema)
  const requiredFields = ['name', 'description', 'price'];
  for (const field of requiredFields) {
    if (!body[field]) {
      throw new ApiError(400, `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
    }
  }

  if (!body.mainImage || !body.mainImage.imageUrl || !body.mainImage.publicId) {
    throw new ApiError(400, "Main image details (imageUrl, publicId) are required.");
  }

  if (!Array.isArray(body.variants) || body.variants.length === 0) {
    throw new ApiError(400, "At least one product variant is required.");
  }

  for (const variant of body.variants) {
    const requiredVariantFields = ['color', 'size', 'quantity', 'images'];
    for (const field of requiredVariantFields) {
      if (variant[field] === undefined || variant[field] === null) {
        throw new ApiError(400, `Variant ${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
      }
    }
    if (!Array.isArray(variant.images) || variant.images.length === 0) {
      throw new ApiError(400, "At least one image is required for each variant.");
    }
    for (const image of variant.images) {
      if (!image.imageUrl || !image.publicId) {
        throw new ApiError(400, "Variant image details (imageUrl, publicId) are required.");
      }
    }
  }

  try {
    const newProduct = new Product(body);
    const savedProduct = await newProduct.save();
    return NextResponse.json({
      message: "Product created successfully!",
      data: savedProduct,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new ApiError(400, "Validation failed: " + messages.join(', '));
    }
    // Log the error for server-side inspection if it's not a validation error
    console.error("Error creating product:", error);
    throw new ApiError(500, "An unexpected error occurred while creating the product.");
  }
});

// GET: Fetch all products
export const GET = handleRouteError(async (req) => {
  await dbConnect();

  const products = await Product.find({}).sort({ createdAt: -1 }); // Sort by newest first

  return NextResponse.json({
    message: "Products fetched successfully!",
    data: products,
    count: products.length,
  }, { status: 200 });
});
