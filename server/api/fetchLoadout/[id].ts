import db from '@/assets/example-data.json'

export default defineEventHandler((event): Object | undefined => {
  const { id } = getRouterParams(event);

  const data = db.loadouts.find(x => x.id == id);

  if (!data) return;

  return data;
})
