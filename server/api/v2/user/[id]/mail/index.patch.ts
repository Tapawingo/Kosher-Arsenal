/** 
 * @file index.patch.ts
 * @description API to set mail for users missing a mail address
 * 
 * @route /api/v2/user/:id/mail
 * @method PATCH
 */

import UserRepository from "~/server/repositories/user";

interface IBody {
  email: string
}

/**
 * API handler for setting a mail address for a user missing one.
 *
 * @param {H3Event} event The incoming API event, including request, response, and context.
 * @returns {Promise<ArsenalUserSerialized>} A user profile
 */
export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const userRepository = new UserRepository(event.context.db);
  const body = await readBody<IBody>(event);

  /* Check if user is logged in to valid session */
  const { user } = await validateSession(event.context.session, lucia);

  /* Check if user has already set thei email */
  if (user.email !== 'unset') throw createError({
    message: 'User has already set their email address',
    statusCode: 400
  });
  
  try {
    await userRepository.updateMail(user.id, body.email);
  } catch (e) {
    console.error(e);
    throw createError({
      message: 'Failed to update user email',
      statusCode: 500
    });
  }
});
