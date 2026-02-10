import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

/**
 * Convert image to WebP format
 * @param {string} inputPath - Path to input image
 * @param {Object} options - Conversion options
 * @returns {Promise<string>} - Path to converted WebP image
 */
export const convertToWebP = async (inputPath, options = {}) => {
  const {
    quality = 80,
    width = null,
    height = null,
    fit = 'cover'
  } = options;

  try {
    const ext = path.extname(inputPath);
    const baseName = path.basename(inputPath, ext);
    const dir = path.dirname(inputPath);
    const outputPath = path.join(dir, `${baseName}.webp`);

    let sharpInstance = sharp(inputPath);

    // Resize if dimensions provided
    if (width || height) {
      sharpInstance = sharpInstance.resize({
        width,
        height,
        fit: fit,
        withoutEnlargement: true
      });
    }

    // Convert to WebP
    await sharpInstance
      .webp({ quality, effort: 6 })
      .toFile(outputPath);

    // Delete original file if conversion successful
    if (fs.existsSync(outputPath) && outputPath !== inputPath) {
      fs.unlinkSync(inputPath);
    }

    return outputPath;
  } catch (error) {
    console.error('WebP conversion error:', error);
    // Return original path if conversion fails
    return inputPath;
  }
};

/**
 * Get image dimensions
 * @param {string} imagePath - Path to image
 * @returns {Promise<{width: number, height: number}>}
 */
export const getImageDimensions = async (imagePath) => {
  try {
    const metadata = await sharp(imagePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height
    };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    return { width: 0, height: 0 };
  }
};

/**
 * Create responsive image variants
 * @param {string} inputPath - Path to input image
 * @param {Array<{width: number, suffix: string}>} sizes - Size variants
 * @returns {Promise<Array<string>>} - Paths to created variants
 */
export const createImageVariants = async (inputPath, sizes = [
  { width: 1920, suffix: 'large' },
  { width: 1200, suffix: 'medium' },
  { width: 768, suffix: 'small' }
]) => {
  const variants = [];
  const ext = path.extname(inputPath);
  const baseName = path.basename(inputPath, ext);
  const dir = path.dirname(inputPath);

  try {
    for (const size of sizes) {
      const outputPath = path.join(dir, `${baseName}-${size.suffix}.webp`);
      
      await sharp(inputPath)
        .resize({
          width: size.width,
          withoutEnlargement: true
        })
        .webp({ quality: 80, effort: 6 })
        .toFile(outputPath);

      variants.push(outputPath);
    }
  } catch (error) {
    console.error('Error creating image variants:', error);
  }

  return variants;
};

export default { convertToWebP, getImageDimensions, createImageVariants };
