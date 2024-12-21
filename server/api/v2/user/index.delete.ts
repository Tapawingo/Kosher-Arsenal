/** 
 * @file index.delete.ts
 * @description API to delete current user
 * 
 * @route /api/v2/user
 * @method DELETE\
 */

import { validateSession } from "~/server/utils/auth";
import UserRepository from "~/server/repositories/user";

/**
 * API handler for deleting the current user.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const userRepository = new UserRepository(event.context.db);

  /* Check if a user is logged in */
  const { user } = await validateSession(event.context.session, lucia);

  /* Sign out User */
  await lucia.invalidateSession(event.context.session!.id);
  appendHeader(event, "Set-Cookie", lucia.createBlankSessionCookie().serialize());
  
  /* Delete User */
  await userRepository.deleteUser(user.id);
});
