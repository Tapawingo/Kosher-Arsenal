import { DatabaseBuylistItem, initializeDB } from "~/server/utils/db";

interface IBody {
  loadoutId: string,
  itemId: string,
  owned: boolean,
  store: string,
  price: {
    price: number,
    currency: string
  }
}

export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const db = initializeDB(hubDatabase());
  const body = await readBody<IBody>(event);

  if (!event.context.session) {
    throw createError({
      message: 'Unauthenticated User',
      statusCode: 403
    });
  }

  const { session, user } = await lucia.validateSession(event.context.session.id);
  if (!session) {
    throw createError({
      message: 'Unauthenticated User',
      statusCode: 403
    });
  }

  try {
    await db.prepare(
      'INSERT INTO buylist (user_id, loadout_id, item_id, owned, store, price) ' +
      'VALUES(?1, ?2, ?3, ?4, ?5, ?6) ' +
      'ON CONFLICT(item_id) DO ' +
      'UPDATE SET owned = ?4, store = ?5, price = ?6;'
    ).bind(user.id, body.loadoutId, body.itemId, +body.owned, body.store, JSON.stringify(body.price)).run();

    /* testing pruposes */
    /* const result = await db.prepare('SELECT * FROM buylist').all();
    console.log(result.results); */

    return {
      user_id: user.id,
      loadout_id: body.loadoutId,
      item_id: body.itemId,
      owned: body.owned,
      store: body.store,
      price: body.price
    };

  } catch (e) {
    throw createError({
      message: 'Failed to set buylist data',
      statusCode: 500
    });
  }
})
