/** 
 * @file index.get.ts
 * @description API to get the current user
 * 
 * @route /api/v2/user
 * @method GET
 */

import { User } from "lucia";

/**
 * API handler for getting the current user.
 *
 * @param {H3Event} event The incoming API event, including request, response, and context.
 * @returns {Promise<User | null>} The current user
 */
export default defineEventHandler(async (event): Promise<User | null> => {
  return event.context.user;
});
