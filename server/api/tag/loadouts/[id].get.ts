import { ArsenalLoadout, ArsenalLoadoutJson, LoadoutVisibility } from '~/classes/ArsenalLoadout';
import type { DatabaseLoadout } from '~/server/utils/db';

export default defineEventHandler(async (event): Promise<Array<ArsenalLoadoutJson>> => {
  const db = event.context.db;
  const { id } = getRouterParams(event);

  try {
    const loadouts = await db.prepare([
      'SELECT tag_loadout_relation.* FROM tag_loadout_relation',
      'INNER JOIN loadouts on loadouts.id = tag_loadout_relation.loadout_id',
      'WHERE tag_loadout_relation.tag_label = ?1 AND loadouts.visibility = ?2'
    ].join(' ')).bind(id, LoadoutVisibility.public).all<DatabaseLoadout>()

    let parsedLoadouts: Array<ArsenalLoadoutJson> = [];
    loadouts.results.forEach((loadout: DatabaseLoadout) => {
      parsedLoadouts.push(new ArsenalLoadout().fromDB(loadout).toJSON());
    });

    return parsedLoadouts;
  } catch (e: any) {
    throw createError({
      message: 'Failed to get tag loadouts',
      statusCode: 500
    });
  };
})
