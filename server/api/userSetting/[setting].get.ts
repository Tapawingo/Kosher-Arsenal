import { DatabaseUserSetting, initializeDB } from "~/server/utils/db";

export default defineEventHandler(async (event): Promise<DatabaseUserSetting> => {
  const lucia = event.context.lucia;
  const db = initializeDB(hubDatabase());
  const { setting } = getRouterParams(event);

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

  let databaseSetting = await db.prepare('SELECT * FROM user_setting WHERE user_id = ?1 AND setting = ?2')
    .bind(user.id, setting).first() as DatabaseUserSetting | undefined;
  
  if (!databaseSetting) {
    databaseSetting = { user_id: user.id, setting: setting, value: '' };
  }

  return databaseSetting;
});
