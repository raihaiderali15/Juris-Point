import { v2 as cloudinary } from "cloudinary";
const removeFromCloudinary = async (publicId, resourceType) => {
  try {
    if (!publicId) return null;
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return response
  } catch (error) {
    return null
  }
};
export default removeFromCloudinary;