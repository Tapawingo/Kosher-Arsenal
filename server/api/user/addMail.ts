interface IBody {
  data: {
    email: string;
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
    await db.prepare('UPDATE user SET email = ?2 WHERE id = ?1').bind(user.id, body.email.toLowerCase()).run();
  } catch (e) {
    console.error(e);
    throw createError({
      message: 'Failed to update user email',
      statusCode: 500
    });
  }
})
