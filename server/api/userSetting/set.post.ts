interface IBody {
  setting: string;
  value: string;
}

export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const db = event.context.db;
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
  
  try {
    db.prepare(
      'INSERT INTO user_setting (user_id, setting, value) ' +
      'VALUES(?1, ?2, ?3) ' +
      'ON CONFLICT (user_id, setting) DO UPDATE ' +
      'SET value = ?3'
    ).bind(user.id, body.setting, body.value).run();

  } catch (e) {
    throw createError({
      message: 'Failed to update setting',
      statusCode: 500
    });
  }
})
