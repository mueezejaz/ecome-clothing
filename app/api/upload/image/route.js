import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary'; // Import Cloudinary SDK
import dotenv from "dotenv"
dotenv.config()
import handleRouteError from "@/app/utils/handleRouteError";
import ApiError from "@/app/utils/ApiError";
import dbConnect from "@/app/lib/dbConnect";
import modelImages from "@/app/models/model.Image";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export let POST = handleRouteError(async (req) => {
  await dbConnect();

  const formData = await req.formData();
  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    throw new ApiError(400, "No image file was received.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Image = buffer.toString('base64');

  const dataUri = `data:${file.type};base64,${base64Image}`;

  const uploadResult = await cloudinary.uploader.upload(dataUri, {
    folder: 'varientImage',
    resource_type: 'auto',
  });

  console.log('Cloudinary upload result:', uploadResult);

  const newImage = await modelImages.create({
    imageMetaData: {
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileName: file.name,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
    },
    isActive: false,
  });

  console.log('Image saved to database:', newImage);

  return NextResponse.json({
    message: 'Image uploaded to Cloudinary and saved to database successfully!',
    imageUrl: uploadResult.secure_url,
    publicId: uploadResult.public_id,
    fileName: file.name,
    dbId: newImage._id, // Return the database ID of the new image
  }, { status: 200 });
});

// Optionally, handle other HTTP methods
export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}