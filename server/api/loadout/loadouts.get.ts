import { ArsenalLoadout, ArsenalLoadoutJson, LoadoutsTable } from '~/classes/ArsenalLoadout';
import { db } from '../../utils/loadoutDB';

export default defineEventHandler(async (event): Promise<Array<ArsenalLoadoutJson>> => {
  const loadouts = await db.prepare('SELECT * FROM loadouts').all<LoadoutsTable>();

  let parsedLoadouts: Array<ArsenalLoadoutJson> = [];
  loadouts.results.forEach((loadout: LoadoutsTable) => {
    parsedLoadouts.push(new ArsenalLoadout().fromDB(loadout).toJSON());
  });

  return parsedLoadouts;
})
