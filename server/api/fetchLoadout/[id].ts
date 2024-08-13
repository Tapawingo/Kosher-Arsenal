import db from '@/assets/example-data.json'

export default defineEventHandler((event) => {
  const { id } = getRouterParams(event, 'id');

  return db.loadouts.find(x => x.id == id);
})
