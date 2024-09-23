import { ArsenalLoadout, ArsenalLoadoutJson, LoadoutVisibility } from '~/classes/ArsenalLoadout';

import type { DatabaseLoadout, DatabaseBuylistItem } from '~/server/utils/db';

const array2SQL = (array: any[]): string => {
  const constructedArr: string[] = [];
  array.forEach((buylist) => {
    constructedArr.push(`'${buylist.loadout_id}'`);
  });

  return `(${ constructedArr.join(', ') })`;
};

export default defineEventHandler(async (event): Promise<Array<ArsenalLoadoutJson>> => {
  const lucia = event.context.lucia;
  const db = event.context.db;

  if (!event.context.session) {
    throw createError({
      statusCode: 403
    });
  };

  const { session, user } = await lucia.validateSession(event.context.session.id);
  if (!session) {
    throw createError({
      message: 'Unauthenticated User',
      statusCode: 403
    });
  };

  /* Get unique loadout buylists */
  const loadoutIds = await db.prepare('SELECT DISTINCT loadout_id from buylist WHERE user_id = ?')
    .bind(user.id).all<string[]>();

  console.log(array2SQL(loadoutIds.results));
  /* Get loadouts */
  const loadouts = await db.prepare(`SELECT * FROM loadouts WHERE id IN ${ array2SQL(loadoutIds.results) }`)
    .all<DatabaseLoadout>();

  let parsedLoadouts: Array<ArsenalLoadoutJson> = [];
  loadouts.results.forEach((loadout: DatabaseLoadout) => {
    parsedLoadouts.push(new ArsenalLoadout().fromDB(loadout).toJSON());
  });

  return parsedLoadouts;
});