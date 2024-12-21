/** 
 * @file signout.get.ts
 * @description API to sign out a user
 * 
 * @route /api/v2/auth/signout
 * @method POST
 */

/**
 * API handler for signing out a user.
 *
 * @param {H3Event} event The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;

  /* Check if a user is signed in */
  if (!event.context.session) throw createError({
    statusCode: 403
  });

  /* Invalidate session */
  await lucia.invalidateSession(event.context.session.id);
  appendHeader(event, "Set-Cookie", lucia.createBlankSessionCookie().serialize());
})
