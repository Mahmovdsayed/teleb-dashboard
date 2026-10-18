import { NextRequest, NextResponse } from "next/server"
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "@/lib/cloudinary."
import { MAX_IMAGE_SIZE } from "@/constant/image-constants"
import { authenticateRequest } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const cookieVal = req.cookies.get("access_token")?.value

  const auth = await authenticateRequest(req)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: auth.error || "Unauthorized" }, { status: 401 })
  }

  const contentType = req.headers.get("content-type") || ""
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ success: false, message: "Invalid content type: multipart/form-data required" }, { status: 400 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const folderName = (formData.get("folderName") as string) || "banners"
    const widthStr = formData.get("width") as string | null
    const heightStr = formData.get("height") as string | null

    if (!file) return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 })

    if (file.size > MAX_IMAGE_SIZE)
      return NextResponse.json(
        {
          success: false,
          message: `File size exceeds the limit of ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`,
        },
        { status: 400 }
      )

    const width = widthStr ? parseInt(widthStr, 10) : undefined
    const height = heightStr ? parseInt(heightStr, 10) : undefined
    const size = width && height ? { width, height } : undefined

    const result = await uploadImageToCloudinary(file, folderName, size)

    const response = NextResponse.json({
      success: true,
      data: {
        imageUrl: result.imageUrl,
        publicId: result.publicId,
      },
    })
    response.headers.set("X-Auth-Method", cookieVal ? "cookie (access_token)" : "authorization_header")
    return response
  } catch (error: any) {
    console.error("Upload error in /api/upload:", error)
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to upload image to Cloudinary",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await authenticateRequest(req)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: auth.error || "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const publicId = body?.publicId

    if (!publicId) return NextResponse.json({ success: false, message: "Public ID is required for deletion" }, { status: 400 })
    const deleted = await deleteImageFromCloudinary(publicId)

    return NextResponse.json({ success: deleted })
  } catch (error: any) {
    console.error("Delete error in /api/upload:", error)
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to delete image from Cloudinary",
      },
      { status: 500 }
    )
  }
}
