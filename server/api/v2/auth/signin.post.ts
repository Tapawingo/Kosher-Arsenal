/** 
 * @file signin.get.ts
 * @description API to sign in a user
 * 
 * @route /api/v2/auth/signin
 * @method POST
 */

import { string } from "yup";
import UserRepository from "~/server/repositories/user";

interface IBody {
  username: string;
  password: string;
}

/**
 * API handler for signing in a user.
 *
 * @param {H3Event} event The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const userRepository = new UserRepository(event.context.db);
  const body = await readBody<IBody>(event);

  /* Check if username is valid */
  const username = body.username;
  if (!await string().min(3).max(31).matches(/^[A-Za-z0-9_-]+$/).isValid(username)) throw createError({
    message: 'Invalid username',
    statusCode: 400
  });

  /* Check if password is valid */
  const password = body.password;
  if (!await string().min(8).max(255).isValid(password)) throw createError({
    message: 'Invalid Password',
    statusCode: 400
  })

  /* Validate the sign in request */
  const user = await userRepository.validateUserSignIn(body.username, body.password);
  const session = await lucia.createSession(user.id, {});
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize()
  );
});
