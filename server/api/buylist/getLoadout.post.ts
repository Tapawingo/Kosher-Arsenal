import { DatabaseBuylistItem, initializeDB } from "~/server/utils/db";

interface IBody {
  loadoutId: string
}

interface BuyListItem {
  user_id: string;
  loadout_id: string;
  item_id: string;
  owned: boolean;
  store: string;
  price: {
    price: number;
    currency: string;
  };
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

  let databaseRecords = await db.prepare('SELECT * FROM buylist WHERE user_id = ?1 AND loadout_id = ?2')
    .bind(user.id, body.loadoutId).all<DatabaseBuylistItem>();
  
    let parsedBuylist: BuyListItem[] = [];
    databaseRecords.results.forEach((buylistItem) => {
      parsedBuylist.push({
        user_id: buylistItem.user_id,
        loadout_id: buylistItem.loadout_id,
        item_id: buylistItem.item_id,
        owned: Boolean(buylistItem.owned),
        store: buylistItem.store!,
        price: JSON.parse(buylistItem.price as string)
      });
    });

  return parsedBuylist;
});
