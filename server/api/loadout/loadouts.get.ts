import { ArsenalLoadout, ArsenalLoadoutJson } from '~/classes/ArsenalLoadout';
import { DatabaseLoadout } from '../../utils/loadoutDB';


export default defineEventHandler(async (event): Promise<Array<ArsenalLoadoutJson>> => {
  const db = hubDatabase();
  const loadouts = await db.prepare('SELECT * FROM loadouts').all<DatabaseLoadout>();

  let parsedLoadouts: Array<ArsenalLoadoutJson> = [];
  loadouts.results.forEach((loadout: DatabaseLoadout) => {
    parsedLoadouts.push(new ArsenalLoadout().fromDB(loadout).toJSON());
  });

  return parsedLoadouts;
})
