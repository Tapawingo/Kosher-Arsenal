import { DatabaseUserSetting, initializeDB } from "~/server/utils/db";

export default defineEventHandler(async (event): Promise<Array<DatabaseUserSetting>> => {
  const lucia = event.context.lucia;
  const db = initializeDB(hubDatabase());

  if (!event.context.session) {
    throw createError({
      message: 'Unauthenticated User',
      statusCode: 403
    });
  }

  const { session, user } = await lucia.validateSession(event.context.session.id);
  if (!session) {
    throw createError({
      message: 'Unauthenticated User',
      statusCode: 403
    });
  }

  let databaseSettings = await db.prepare('SELECT * FROM user_setting WHERE user_id = ?1')
    .bind(user.id).first() as Array<DatabaseUserSetting> | undefined;
  
  if (!databaseSettings) {
    databaseSettings = [];
  }

  return databaseSettings;
});
