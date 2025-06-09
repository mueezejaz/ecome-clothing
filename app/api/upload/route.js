
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary'; // Import Cloudinary SDK
import dotenv from "dotenv"
dotenv.config()
import handleRouteError from "@/app/utils/handleRouteError";
import ApiError from "@/app/utils/ApiError";
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
});

export let POST = handleRouteError( async(req) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      ApiError(400,"no image file is recived");
    }

    const arrayBuffer = await file.arrayBuffer(); 
    const buffer = Buffer.from(arrayBuffer);      
    const base64Image = buffer.toString('base64');

    const dataUri = `data:${file.type};base64,${base64Image}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: 'varientImage', 
      resource_type: 'auto', 
    });

    console.log('Cloudinary upload result (Base64 method):', uploadResult);

    return NextResponse.json({
      message: 'Image uploaded to Cloudinary!',
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileName: file.name,
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing file upload to Cloudinary:', error);
    // Differentiate error messages for better debugging
    if (error.http_code) { // Cloudinary API errors often have an http_code property
      return NextResponse.json({ error: `Cloudinary upload failed: ${error.message}` }, { status: error.http_code });
    }
    return NextResponse.json({ error: 'Failed to process upload.' }, { status: 500 });
  }
}
)
// Optionally, handle other HTTP methods
export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}