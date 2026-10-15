import { v2 as cloudinary } from "cloudinary"
import { fileToBuffer, isValidFileSize, isValidFileType } from "./file-type"
import { BASE_FOLDER, IMAGE_EXTENSIONS, MAX_IMAGE_SIZE } from "@/constant/image-constants"

cloudinary.config({
  cloud_name: (typeof Bun !== "undefined" ? Bun.env.CLOUDINARY_CLOUD_NAME : undefined) || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: (typeof Bun !== "undefined" ? Bun.env.CLOUDINARY_API_KEY : undefined) || process.env.CLOUDINARY_API_KEY,
  api_secret: (typeof Bun !== "undefined" ? Bun.env.CLOUDINARY_API_SECRET : undefined) || process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export const uploadImageToCloudinary = async (
  image: File,
  folderName: string,
  size?: { width?: number; height?: number }
): Promise<{ imageUrl: string; publicId: string }> => {
  if (!isValidFileSize(image, MAX_IMAGE_SIZE)) throw new Error("Image is too large")

  const { valid, detectedType } = await isValidFileType(image, IMAGE_EXTENSIONS, true)
  if (!valid || !detectedType) throw new Error("Unsupported image type")

  const buffer = await fileToBuffer(image)
  const mime = `image/${detectedType === "jpg" ? "jpeg" : detectedType}`
  const dataURI = `data:${mime};base64,${buffer.toString("base64")}`

  const transformation = size?.width && size?.height ? [
    {
      width: size.width,
      height: size.height,
      crop: "fill",
      gravity: "auto",
      quality: 100,
    },
  ] : undefined

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: `${BASE_FOLDER}/${folderName}`,
    allowed_formats: IMAGE_EXTENSIONS,
    resource_type: "image",
    transformation,
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
