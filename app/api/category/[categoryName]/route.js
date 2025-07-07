import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Product from "@/app/models/model.Product";
import handleRouteError from "@/app/utils/handleRouteError";

export const GET = handleRouteError(async (req, { params }) => {
  await dbConnect();

  const { categoryName } = params;
  const { searchParams } = new URL(req.url);

  if (!categoryName) {
    return NextResponse.json({ message: "Category name is required" }, { status: 400 });
  }

  // --- Filter Query Construction ---
  const query = {
    category: { $regex: new RegExp(`^${categoryName}$`, 'i') },
    isActive: true, // Typically, only active products are shown
  };

  // Price filter
  const priceMin = parseFloat(searchParams.get('priceMin'));
  const priceMax = parseFloat(searchParams.get('priceMax'));
  if (!isNaN(priceMin) || !isNaN(priceMax)) {
    query.price = {};
    if (!isNaN(priceMin)) query.price.$gte = priceMin;
    if (!isNaN(priceMax)) query.price.$lte = priceMax;
  }
  
  // On Sale filter
  if (searchParams.get('onSale') === 'true') {
    query.discountPrice = { $gte: 0, $exists: true }; 
  }


  if (searchParams.get('featured') === 'true') {
    query.featured = true;
  }

  const sortBy = searchParams.get('sortBy') || 'featured'; // Default sort
  let sortOption = {};
  switch (sortBy) {
    case 'price-low':
      sortOption = { price: 1 };
      break;
    case 'price-high':
      sortOption = { price: -1 };
      break;
    case 'name':
      sortOption = { name: 1 };
      break;
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    case 'featured':
    default:
      sortOption = { featured: -1, createdAt: -1 }; // Prioritize featured, then newest
      break;
  }

  // --- Pagination ---
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = 12; 
  const skip = (page - 1) * limit;

  // --- Database Query ---
  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / limit);

  return NextResponse.json({
    message: `Products for category '${categoryName}' fetched successfully!`,
    data: products,
    currentPage: page,
    totalPages: totalPages,
    totalProducts: totalProducts,
    limit: limit,
  }, { status: 200 });
});

