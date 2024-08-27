import { ArsenalLoadoutJson } from '~/classes/ArsenalLoadout';
import db from '@/assets/example-data.json'

export default defineEventHandler((event): Array<ArsenalLoadoutJson> => {
  return db.loadouts;
})
