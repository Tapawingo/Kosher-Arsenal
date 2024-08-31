import type { DatabasePreference } from '../../utils/userPreferenceDB';

interface IBody {
  key: string;
  value: any;
}


/* @TODO: Complete user pereferences */
export default defineEventHandler(async (event): Promise<Array<DatabasePreference> | null> => {
  const db = hubDatabase();
  const { userid } = getRouterParams(event);

  const body = readBody<IBody>(event);

  const result = await db.prepare(`SELECT * FROM userPreference WHERE "user_id"="${ userid }"`).all<DatabasePreference>();

  if (!result.results) return null;

  return result.results;
});