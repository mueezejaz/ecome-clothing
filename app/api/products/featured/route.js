import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Product from "@/app/models/model.Product";
import ApiError from "@/app/utils/ApiError";
import handleRouteError from "@/app/utils/handleRouteError";
import mongoose from "mongoose";


export const GET = handleRouteError(async (req) => {
  await dbConnect();
  const featuredProducts = await Product.find({ featured: true }).sort({ createdAt: -1 });

  return NextResponse.json({
    message: "Featured products fetched successfully!",
    data: featuredProducts,
    count: featuredProducts.length,
  }, { status: 200 });
});
