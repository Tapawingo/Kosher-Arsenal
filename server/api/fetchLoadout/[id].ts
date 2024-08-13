import { ArsenalLoadout } from '~/classes/ArsenalLoadout';
import db from '@/assets/example-data.json'

export default defineEventHandler((event): ArsenalLoadout | undefined => {
  const { id } = getRouterParams(event);

  const data = db.loadouts.find(x => x.id == id);

  if (!data) return;

  return new ArsenalLoadout().fromJSON(JSON.stringify(data));
})
