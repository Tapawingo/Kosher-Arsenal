import { DatabaseBuylistItem } from "~/server/utils/db";

interface IBody {
  loadoutId: string,
  itemId: string
}

export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const db = event.context.db;
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

  let databaseRecord = await db.prepare('SELECT * FROM buylist WHERE user_id = ?1 AND loadout_id = ?2 AND item_id = ?3')
    .bind(user.id, body.loadoutId, body.itemId).first() as DatabaseBuylistItem | undefined;
  
  if (!databaseRecord) {
    databaseRecord = { user_id: user.id, loadout_id: body.loadoutId, owned: 0, item_id: body.itemId, store: '', price: '{ "price": 0, "currency": "USD" }' };
  }

  let parsedRecord = {
    user_id: databaseRecord.user_id,
    loadout_id: databaseRecord.loadout_id,
    item_id: databaseRecord.item_id,
    owned: Boolean(databaseRecord.owned),
    store: databaseRecord.store!,
    price: JSON.parse(databaseRecord.price)
  };

  return parsedRecord;
});
