/** 
 * @file send.get.ts
 * @description API to send a email verification mail
 * 
 * @route /api/v2/auth/email/send
 * @method GET
 */

import UserRepository from "~/server/repositories/user";

interface IBody {
  email: string
}

/**
 * API handler for sending a email verification mail.
 *
 * @param {H3Event} event The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const userRepository = new UserRepository(event.context.db);

  /* Check if a user is logged in */
  const { user } = await validateSession(event.context.session, lucia);

  /* Get a token and send it */
  const token = await userRepository.getVerificationToken(user.id);
  await userRepository.sendVerificationMail(user, token);
});
