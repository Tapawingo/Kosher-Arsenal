/** 
 * @file signup.get.ts
 * @description API to sign up a new user
 * 
 * @route /api/v2/auth/signup
 * @method POST
 */

import { string } from "yup";
import UserRepository from "~/server/repositories/user";

interface IBody {
  email: string;
  username: string;
  password: string;
}

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

  /* Check if username is taken */
  if (await userRepository.getByUsername(username)) throw createError({
    message: 'Username already in use',
    statusCode: 400
  });

  /* Check if email is valid */
  const email = body.email;
  if (!await string().email().isValid(email)) throw createError({
    message: 'Invalid email',
    statusCode: 400
  });

  /* Check if email is in use. UNIQUE constraint is not present in production :( */
  if (await userRepository.getByEmail(email)) throw createError({
    message: 'Email already in use',
    statusCode: 400
  });

  /* Check if password is valid */
  const password = body.password;
  if (!await string().min(8).max(255).isValid(password)) throw createError({
    message: 'Invalid Password',
    statusCode: 400
  })

  const user = await userRepository.createUser(username, password, email);
  const session = await lucia.createSession(user.id, {});
  appendHeader(event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize()
  );
});
