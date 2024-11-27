interface IBody {
  data: {
    display_name: string;
    biography: string;
    avatar: string;
  }
}

export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const db = event.context.db;
  const { data: body } = await readBody<IBody>(event);

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
    await db.prepare(
      'INSERT INTO user_meta (user_id, display_name, biography, avatar) ' +
      'VALUES(?1, ?2, ?3, ?4) ' +
      'ON CONFLICT (user_id) DO UPDATE ' +
      'SET display_name = ?2, biography = ?3, avatar = ?4'
    ).bind(user.id, body.display_name, body.biography, body.avatar).run();

  } catch (e) {
    console.error(e);
    throw createError({
      message: 'Failed to update user meta',
      statusCode: 500
    });
  }
})
