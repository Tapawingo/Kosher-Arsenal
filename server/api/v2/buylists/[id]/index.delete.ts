/** 
 * @file index.delete.ts
 * @description API to delete a buylist item
 * 
 * @route /api/v2/items/:id/buylist
 * @method DELETE
 */

import BuylistRepository from "~/server/repositories/buylist";

/**
 * API handler for deleting a buylist item.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const buylistRepository = new BuylistRepository(event.context.db);

  /* Check if user is logged in to valid session */
  const { user } = await validateSession(event.context.session, lucia);

  /* Check for buylist ID */
  if (!event.context.params?.id) throw createError({
    message: 'Missing buylist ID',
    statusCode: 400
  });

  /* Check if current user is authorized to delete buylist */
  const buylistId = event.context.params.id;
  if (!await buylistRepository.isDeleteAuthorized(buylistId, user.id)) throw createError({
    message: 'User attempted unauthorized delete',
    statusCode: 403
  });

  /* Delete buylist item */
  try {
    return await buylistRepository.deleteBuylist(buylistId);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});