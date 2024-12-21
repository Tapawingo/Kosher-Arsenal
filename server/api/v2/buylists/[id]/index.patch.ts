/** 
 * @file index.patch.ts
 * @description API to update a buylist
 * 
 * @route /api/v2/buylists/:id
 * @method PATCH
 */

import { ArsenalBuylistSerialized } from "~/models/ArsenalBuylist.model";
import BuylistRepository from "~/server/repositories/buylist";

/**
 * API handler for updating a buylist item.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const buylistRepository = new BuylistRepository(event.context.db);
  const body = await readBody<ArsenalBuylistSerialized>(event);

  /* Check if user is logged in to valid session */
  const { user } = await validateSession(event.context.session, lucia);

  /* Check for buylist ID */
  if (!event.context.params?.id) throw createError({
    message: 'Missing buylist ID',
    statusCode: 400
  });

  /* Check if current user is authorized to update buylist */
  const buylistId = event.context.params.id;
  if (!await buylistRepository.isEditAuthorized(buylistId, user.id)) throw createError({
    message: 'User attempted unauthorized delete',
    statusCode: 403
  });

  /* Check if body is valid */
  if (!await buylistRepository.validateBuylistBody(body)) {
    throw createError({
      message: 'Invalid body',
      statusCode: 400
    });
  }

  /* Update buylist item */
  try {
    const buylistId = event.context.params.id;
    return await buylistRepository.updateBuylist(buylistId, body);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});