/** 
 * @file [token].get.ts
 * @description API to verify a user's email
 * 
 * @route /api/v2/auth/email/:token
 * @method POST
 */

import UserRepository from "~/server/repositories/user";

/**
 * API handler for validating a mail verification token.
 *
 * @param {H3Event} event The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event) => {
  const userRepository = new UserRepository(event.context.db);

  /* Check for User ID */
  if (!event.context.params?.token) throw createError({
    message: 'Missing token',
    statusCode: 400
  });

  /* Validate token */
  const token = event.context.params.token;
  const userId = await userRepository.validateVerificationToken(token);
  await userRepository.setEmailVerified(userId, true);
  
  return {};
});
