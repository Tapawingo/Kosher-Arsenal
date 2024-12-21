/** 
 * @file index.patch.ts
 * @description API to update a user profile
 * 
 * @route /api/v2/user/:id/profile
 * @method PATCH
 */

import { ArsenalUserProfileSerialized } from "~/models/ArsenalUserProfile.model";
import UserRepository from "~/server/repositories/user";

/**
 * API handler for updating a user's profile by id.
 *
 * @param {H3Event} event The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const userRepository = new UserRepository(event.context.db);
  const body = await readBody<ArsenalUserProfileSerialized>(event);

  /* Check if user is logged in to valid session */
  const { user } = await validateSession(event.context.session, lucia);

  /* Check if body is valid */
  if (!await userRepository.validateProfileBody(body)) {
    throw createError({
      message: 'Invalid body',
      statusCode: 400
    });
  }

  /* Check if user is trying to change another user's profile */
  if (body.userId !== user.id) throw createError({
    message: 'Mismatched user ID',
    statusCode: 400
  });

  try {
    await userRepository.updateProfile(user.id, body);
  } catch (e: any) {
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    })
  }
});
