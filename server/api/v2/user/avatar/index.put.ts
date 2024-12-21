/** 
 * @file index.put.ts
 * @description API to upload a user avatar
 * 
 * @route /api/v2/user/avatar
 * @method PUT
 */

import { validateSession } from "~/server/utils/auth";
import { getMagicNumber, isFileValid } from "~/server/utils/image";

/**
 * API handler for uploading avatars.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 */
export default eventHandler(async (event) => {
  const lucia = event.context.lucia;
  const form = await readFormData(event);

  /* Check if user is logged in to valid session */
  const { user } = await validateSession(event.context.session, lucia);

  
  /* Check if file is spoofed */
  const files = form.getAll('files') as File[];
  if (files.length === 0) throw createError({
    message: 'Missing files',
    statusCode: 400
  });

  files.forEach(async (file) => {
    const signature = await getMagicNumber(file);
    if (!isFileValid(signature, file.name.split('.')[-1])) throw createError({
      message: 'Filetype was spoofed',
      statusCode: 400
    });
  });

  return await hubBlob().handleUpload(event, {
    formKey: 'files',
    multiple: false,
    ensure: {
      types: ['image/jpeg', 'image/png', 'image/bmp', 'image/tiff', 'image/webp'],
      maxSize: "8MB"
    },
    put: {
      addRandomSuffix: true,
      prefix: `${ user.id }/avatar`
    }
  })
});