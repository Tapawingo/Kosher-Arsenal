/** 
 * @file reset.get.ts
 * @description API to send a password reset token
 * 
 * @route /api/v2/auth/password/reset
 * @method GET
 */

import { string } from "yup";
import UserRepository from "~/server/repositories/user";

interface IBody {
  email: string
}

/**
 * API handler for sending a password change request.
 *
 * @param {H3Event} event The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event) => {
  const userRepository = new UserRepository(event.context.db);
	const { email } = await readBody<IBody>(event);

  /* Check if email is valid */
  if (!await string().email().isValid(email)) throw createError({ 
    message: "Invalid email",
    statusCode: 400
  });
  
  /* Get the user associated with the email */
  const user = await userRepository.getByEmail(email);
  if (!user) throw createError({ 
    message: "User does not exist",
    statusCode: 400
  });

  /* Create a password token and send it */
  const token = await userRepository.getPasswordToken(user.id);
  await userRepository.sendPasswordMail(user, token);
});
