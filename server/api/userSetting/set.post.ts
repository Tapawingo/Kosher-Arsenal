import { initializeDB } from "~/server/utils/db";

interface IBody {
  setting: 'theme';
  value: string | null;
}

export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const db = initializeDB(hubDatabase());
  const body = await readBody<IBody>(event);

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

  const setting = body.setting;
  if (typeof setting !== "string") {
    throw createError({
      message: 'Invalid Setting',
      statusCode: 400
    });
  }

  let setting_value = body.value;
  if (setting_value !== "string") {
    throw createError({
      message: 'Invalid Setting value',
      statusCode: 400
    });
  }

  try {
    db.prepare(
      'INSERT INTO user_setting (user_id, setting, value) ' +
      'VALUES(?1, ?2, ?3) ' +
      'ON CONFLICT (user_id, setting) DO UPDATE ' +
      'SET value = ?3'
    ).bind(user.id, setting, setting_value).run();

  } catch (e) {
    throw createError({
      message: 'Failed to update setting',
      statusCode: 500
    });
  }
})
