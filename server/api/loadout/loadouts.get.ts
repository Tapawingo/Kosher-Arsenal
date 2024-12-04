import { ArsenalLoadout, ArsenalLoadoutJson, LoadoutVisibility } from '~/classes/ArsenalLoadout';
import type { DatabaseLoadout, DatabaseUser, DatabaseUserMeta } from '~/server/utils/db';

export default defineEventHandler(async (event): Promise<Array<ArsenalLoadoutJson>> => {
  const db = event.context.db;

  const loadouts = await db
    .prepare('SELECT * FROM loadouts WHERE visibility = ?')
    .bind(LoadoutVisibility.public)
    .all<DatabaseLoadout>();

  if (!loadouts.results.length) {
    return [];
  }

  const ownerIds = [...new Set(loadouts.results.map((loadout) => loadout.owner))];

  const placeholders = ownerIds.map(() => '?').join(',');
  const ownersWithMeta = await db
    .prepare(
      `SELECT user_meta.*, user.username FROM user_meta
       INNER JOIN user ON user.id = user_meta.user_id
       WHERE user.id IN (${placeholders})`
    )
    .bind(...ownerIds)
    .all<DatabaseUserMeta>();

  const ownersWithMetaIds = ownersWithMeta.results.map((owner) => owner.user_id);
  const missingOwnerIds = ownerIds.filter((id) => !ownersWithMetaIds.includes(id));

  const missingOwners = missingOwnerIds.length
    ? await db
        .prepare(
          `SELECT id, username FROM user WHERE id IN (${missingOwnerIds.map(() => '?').join(',')})`
        )
        .bind(...missingOwnerIds)
        .all<DatabaseUser>()
    : { results: [] };

  const owners = {
    ...ownersWithMeta.results.reduce((map, owner) => {
      map[owner.user_id] = owner;
      return map;
    }, {} as Record<string, any>),
    ...missingOwners.results.reduce((map, owner) => {
      map[owner.id] = {
        user_id: owner.id,
        username: owner.username,
        display_name: owner.username,
        biography: '',
        avatar: '/default_avatar.webp',
      };
      return map;
    }, {} as Record<string, any>),
  };

  const parsedLoadouts: Array<ArsenalLoadoutJson> = loadouts.results.map((loadout: DatabaseLoadout) => {
    const parsedLoadout = new ArsenalLoadout().fromDB(loadout).toJSON();
    parsedLoadout.owner = owners[loadout.owner] || null;
    return parsedLoadout;
  });

  return parsedLoadouts;
});
