import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "@/lib/cloudinary.";
import { MAX_IMAGE_SIZE, IMAGE_EXTENSIONS } from "@/constant/image-constants";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folderName = (formData.get("folderName") as string) || "banners";
    const widthStr = formData.get("width") as string | null;
    const heightStr = formData.get("height") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: `File size exceeds the limit of ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`,
        },
        { status: 400 }
      );
    }

    const width = widthStr ? parseInt(widthStr, 10) : undefined;
    const height = heightStr ? parseInt(heightStr, 10) : undefined;
    const size = width && height ? { width, height } : undefined;

    const result = await uploadImageToCloudinary(file, folderName, size);

    return NextResponse.json({
      success: true,
      data: {
        imageUrl: result.imageUrl,
        publicId: result.publicId,
      },
    });
  } catch (error: any) {
    console.error("Upload error in /api/upload:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to upload image to Cloudinary",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const publicId = body?.publicId;

    if (!publicId) {
      return NextResponse.json(
        { success: false, message: "Public ID is required for deletion" },
        { status: 400 }
      );
    }

    const deleted = await deleteImageFromCloudinary(publicId);

    return NextResponse.json({
      success: deleted,
    });
  } catch (error: any) {
    console.error("Delete error in /api/upload:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to delete image from Cloudinary",
      },
      { status: 500 }
    );
  }
}
