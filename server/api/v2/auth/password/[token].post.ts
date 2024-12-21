/** 
 * @file [token].get.ts
 * @description API to verify a password change token and change a user's password
 * 
 * @route /api/v2/auth/password/:token
 * @method POST
 */

import { string } from "yup";
import UserRepository from "~/server/repositories/user";

interface IBody {
  password: string;
}

/**
 * API handler for validating a password change request.
 *
 * @param {H3Event} event The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const userRepository = new UserRepository(event.context.db);
	const body = await readBody<IBody>(event);

  /* Check for User ID */
  if (!event.context.params?.token) throw createError({
    message: 'Missing token',
    statusCode: 400
  });

  /* Check if password is valid */
	const password = body.password;
  if (!await string().min(8).max(255).isValid(password)) throw createError({
    message: 'Invalid Password',
    statusCode: 400
  })

  /* Validate Token */
  const token = event.context.params.token;
  const userId = await userRepository.validatePasswordResetToken(token);

  /* Update password, sign out every user and set email verified */
  await userRepository.updatePassword(userId, password);
  await lucia.invalidateUserSessions(userId);
  await userRepository.setEmailVerified(userId, true);

  /* Sign in user who made request */
	const session = await lucia.createSession(userId, {});
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize()
  );
  
  return {};
});
