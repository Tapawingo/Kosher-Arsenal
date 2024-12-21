/** 
 * @file index.get.ts
 * @description API to Get a User Profile by username
 * 
 * @route /api/v2/user/:username/profile
 * @method GET
 */

import { ArsenalUserProfile, ArsenalUserProfileSerialized } from "~/models/ArsenalUserProfile.model";
import UserRepository from "~/server/repositories/user";

/**
 * API handler for getting a user's profile by username.
 *
 * @param {H3Event} event The incoming API event, including request, response, and context.
 * @returns {Promise<ArsenalUserSerialized>} A user profile
 */
export default defineEventHandler(async (event): Promise<ArsenalUserProfileSerialized | null> => {
  const userRepository = new UserRepository(event.context.db);

  /* Check for User ID */
  if (!event.context.params?.username) throw createError({
    message: 'Missing username',
    statusCode: 400
  });

  const username = event.context.params.username;
  const profile = await userRepository.getProfileByUsername(username);

  if (profile) return profile;
  
  const user = await userRepository.getByUsername(username);
  if (!user) throw createError({
    message: 'User does not exist',
    statusCode: 500
  });

  return new ArsenalUserProfile({ userId: user.id, username: user.username }).serialize();
});
