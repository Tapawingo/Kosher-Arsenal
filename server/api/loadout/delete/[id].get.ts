export default defineEventHandler(async (event): Promise<void> => {
  const lucia = event.context.lucia;
  const db = event.context.db;
  const { id: loadoutId } = getRouterParams(event);

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
    await db.prepare('DELETE FROM loadouts WHERE id = ? AND owner = ?')
    .bind(loadoutId, user.id).run();

    console.log(loadoutId);
  } catch (e: any) {
    throw createError({
      message: e.message,
      statusCode: 500
    });
  }
})
