import db from '@/assets/example-data.json'

export default defineEventHandler((event): Object | undefined => {
  const { id } = getRouterParams(event);

  return db.itemPresets;
})
