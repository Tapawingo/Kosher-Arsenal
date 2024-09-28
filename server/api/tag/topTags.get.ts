import { ArsenalLoadout, ArsenalLoadoutJson, LoadoutVisibility } from '~/classes/ArsenalLoadout';
import { LoadoutTag, LoadoutTagJson } from '~/classes/LoadoutTag';
import type { DatabaseLoadout } from '~/server/utils/db';

interface TagRelationDatabase {
  label: string;
  type: number;
  loadouts: string;
  loadout_count: number;
}

interface ITagRelation {
  label: string;
  type: number;
  loadouts: string[];
  loadout_count: number;
}

export default defineEventHandler(async (event): Promise<ITagRelation[]> => {
  const db = event.context.db;

  try {
    const data = await db.prepare([
      'SELECT',
      ' tag.label,',
      ' tag.type,',
      ' GROUP_CONCAT(tag_loadout_relation.loadout_id) AS loadouts,',
      ' COUNT(tag_loadout_relation.loadout_id) AS loadout_count',
      'FROM tag_loadout_relation',
      'INNER JOIN tag ON tag.label = tag_loadout_relation.tag_label',
      'GROUP BY tag.label, tag.type',
      'ORDER BY loadout_count DESC',
      'LIMIT 10'
    ].join(' ')).all<TagRelationDatabase>()

    return data.results.map<ITagRelation>(row => ({
      ...row,
      loadouts: row.loadouts.split(',')
    }));
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Failed to get tag loadouts',
      statusCode: 500
    });
  };
})
