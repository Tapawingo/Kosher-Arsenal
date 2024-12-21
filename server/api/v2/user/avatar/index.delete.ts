/** 
 * @file index.get.ts
 * @description API to delete a user avatar
 * 
 * @route /api/v2/user/avatar
 * @method DELETE
 */

import { validateSession } from "~/server/utils/auth";

interface IBody {
  path?: string;
}

/**
 * API handler for deleting avatars.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const body = await readBody<IBody>(event);

  /* Check if user is logged in to valid session */
  const { user } = await validateSession(event.context.session, lucia);

  /* Check if image is a preview */
  const pathArr = body?.path?.split('/');
  if (!body.path || !pathArr) throw createError({
    message: 'Missing Path from body',
    statusCode: 400
  });

  console.log()
  if (pathArr[pathArr?.length - 2] !== 'avatar') throw createError({
    message: 'Image is not an avatar',
    statusCode: 400
  });

  /* Check if user was original uploader of the file */
  if (pathArr[pathArr?.length - 3] !== user.id) throw createError({
    message: 'User is not the owner of this image',
    statusCode: 403
  });

  return hubBlob().del(body.path);
});