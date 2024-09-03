import { ArsenalLoadout, ArsenalLoadoutJson, LoadoutVisibility } from '~/classes/ArsenalLoadout';
import { initializeDB, type DatabaseLoadout } from '~/server/utils/db';


export default defineEventHandler(async (event): Promise<Array<ArsenalLoadoutJson>> => {
  const db = initializeDB(hubDatabase());
  const loadouts = await db.prepare('SELECT * FROM loadouts WHERE visibility = ?')
    .bind(LoadoutVisibility.public).all<DatabaseLoadout>();

  let parsedLoadouts: Array<ArsenalLoadoutJson> = [];
  loadouts.results.forEach((loadout: DatabaseLoadout) => {
    parsedLoadouts.push(new ArsenalLoadout().fromDB(loadout).toJSON());
  });

  return parsedLoadouts;
})
