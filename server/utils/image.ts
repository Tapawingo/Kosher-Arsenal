/**
 * @file image.ts
 * @description Image utility for validating images before uploading them to the R2 Bucket
 */

import magicNumbers from '../data/extensions.json';

/**
 * Extract the first few bytes from the stream to get the magic number
 * @param {File} file File to extract magic numbers from
 * @param {number} bytesToRead The amount of bytes to read
 * @returns {string} Signature
 */
export const getMagicNumber = async (file: File, bytesToRead = 4): Promise<string> => {
  const stream = file.stream();
  const reader = stream.getReader();
  const { value: chunk } = await reader.read();
  reader.releaseLock();

  if (!chunk || chunk.length < bytesToRead) {
      throw new Error('Failed to read enough bytes from the file stream.');
  }

  return Buffer.from(chunk).toString('hex').substring(0, bytesToRead * 2);
}

/**
 * Check if a file's extension matches it's signature
 * @param {string} signature File signature
 * @param {string} extension File extension
 * @returns {boolean} True if file is valid
 */
export const isFileValid = (signature: string, extension: string): boolean => {
  if (extension.toLowerCase() in magicNumbers) {
    const expectedSignatures = magicNumbers[extension.toLowerCase() as keyof typeof magicNumbers]?.signs;
    if (!expectedSignatures) {
      throw new Error('Magic number signatures not found for this extension.');
    }

    return expectedSignatures?.some((sig) => signature.startsWith(sig)) || false;
  } else {
    throw new Error('Unsupported file extension.');
  }
}