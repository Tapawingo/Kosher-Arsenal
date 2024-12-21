/** 
 * @file index.get.ts
 * @description API to Get a User Profile by id
 * 
 * @route /api/v2/user/:id/profile
 * @method GET
 */

import { ArsenalUserProfile, ArsenalUserProfileSerialized } from "~/models/ArsenalUserProfile.model";
import UserRepository from "~/server/repositories/user";

/**
 * API handler for getting a user's profile by id.
 *
 * @param {H3Event} event The incoming API event, including request, response, and context.
 * @returns {Promise<ArsenalUserSerialized>} A user profile
 */
export default defineEventHandler(async (event): Promise<ArsenalUserProfileSerialized> => {
  const userRepository = new UserRepository(event.context.db);

  /* Check for User ID */
  if (!event.context.params?.id) throw createError({
    message: 'Missing user ID',
    statusCode: 400
  });

  const userId = event.context.params.id;
  const profile = await userRepository.getProfileById(userId);

  if (profile) return profile;
  
  const user = await userRepository.getById(userId);
  if (!user) throw createError({
    message: 'User does not exist',
    statusCode: 500
  });

  return new ArsenalUserProfile({ userId: user.id, username: user.username }).serialize();
});
