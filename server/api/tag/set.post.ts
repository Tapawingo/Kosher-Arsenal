interface IBody {
  label: string;
  type: number;
  loadoutId: string;
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

  const { session } = await lucia.validateSession(event.context.session.id);
  if (!session) {
    throw createError({
      message: 'Unauthenticated User',
      statusCode: 403
    });
  }

  try {
    await db.prepare(
      'INSERT OR IGNORE INTO tag (label, type) ' +
      'VALUES(?1, ?2) '
    ).bind(body.label, body.type).run();

    await db.prepare(
      'INSERT OR IGNORE INTO tag_loadout_relation (tag_label, loadout_id) ' +
      'VALUES(?1, ?2) '
    ).bind(body.label, body.loadoutId).run();
  } catch (e) {
    throw createError({
      message: 'Failed to set tag data',
      statusCode: 500
    });
  }
})
