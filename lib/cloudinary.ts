import { v2 as cloudinary } from "cloudinary"
import { fileToBuffer, isValidFileSize, isValidFileType } from "./file-type"
import { BASE_FOLDER, IMAGE_EXTENSIONS, MAX_IMAGE_SIZE } from "@/constant/image-constants"
import sharp from "sharp"

cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:  process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export const uploadImageToCloudinary = async (image: File, folderName: string, size?: { width?: number; height?: number }): Promise<{ imageUrl: string; publicId: string }> => {
  if (!isValidFileSize(image, MAX_IMAGE_SIZE)) {
    throw new Error("Image is too large")
  }

  const { valid, detectedType } = await isValidFileType(image, IMAGE_EXTENSIONS, true)

  if (!valid || !detectedType) {
    throw new Error("Unsupported image type")
  }

  const buffer = await fileToBuffer(image)

  let pipeline = sharp(buffer).rotate()

  if (size?.width && size?.height) {
    pipeline = pipeline.resize(size.width, size.height, {
      fit: "cover",
      position: "attention",
    })
  }
  const webpBuffer = await pipeline.webp({ quality: 100, effort: 4 }).toBuffer()

  const result = await cloudinary.uploader.upload(`data:image/webp;base64,${webpBuffer.toString("base64")}`, {
    folder: `${BASE_FOLDER}/${folderName}`,
    resource_type: "image",
    format: "webp",
  })

  return {
    imageUrl: result.secure_url,
    publicId: result.public_id,
  }
}

export const deleteImageFromCloudinary = async (publicId: string): Promise<boolean> => {
  if (!publicId.startsWith(`${BASE_FOLDER}/`)) throw new Error("Invalid public id")

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  })

  return result.result === "ok" || result.result === "not found"
}

export const updateImageOnCloudinary = async (
  newImage: File,
  oldPublicId: string | null | undefined,
  folderName: string,
  size?: { width?: number; height?: number }
): Promise<{ imageUrl: string; publicId: string }> => {
  const uploaded = await uploadImageToCloudinary(newImage, folderName, size)

  if (oldPublicId && oldPublicId !== uploaded.publicId) {
    try {
      await deleteImageFromCloudinary(oldPublicId)
    } catch (error) {
      console.error("Failed to delete old image:", oldPublicId, error)
    }
  }

  return uploaded
}
