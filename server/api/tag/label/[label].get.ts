import { ArsenalLoadout, ArsenalLoadoutJson, LoadoutVisibility } from '~/classes/ArsenalLoadout';
import type { DatabaseLoadout } from '~/server/utils/db';

interface IData {
  tag_label: string
  tag_type: number
  id: string
  title: string
  description: string
  owner: string
  collaborators: string
  preview: string
  tags: string
  visibility: number
  collections: string
  categories: string
}

interface ITagLoadoutRelation {
  label: string,
  type: number,
  loadouts: ArsenalLoadoutJson[]
}

const parseData = (data: IData[]) => {
  const parsed: any = {
    label: data[0].tag_label,
    type: data[0].tag_type,
    loadouts: data.map(row => (new ArsenalLoadout().fromDB(row)))
  };

  return parsed;
}

export default defineEventHandler(async (event): Promise<ITagLoadoutRelation> => {
  const db = event.context.db;
  const { label } = getRouterParams(event);

  try {
    const data = await db.prepare([
      'SELECT',
      ' tag.label AS tag_label,',
      ' tag.type AS tag_type,',
      ' loadouts.*',
      'FROM tag_loadout_relation',
      'INNER JOIN tag ON tag.label = tag_loadout_relation.tag_label',
      'INNER JOIN loadouts ON tag_loadout_relation.loadout_id = loadouts.id',
      'WHERE tag.label = ?1 AND loadouts.visibility = ?2'
    ].join(' ')).bind(decodeURI(label), LoadoutVisibility.public).all<IData>()

    return data.results ? parseData(data.results) : null;
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Failed to get tag loadouts',
      statusCode: 500
    });
  };
})
