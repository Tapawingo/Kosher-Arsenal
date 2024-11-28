import type { DatabaseUserMeta } from '~/server/utils/db';

interface UserMeta extends DatabaseUserMeta {
  username: string;
}

export default defineEventHandler(async (event): Promise<UserMeta | null> => {
  const db = event.context.db;
  const { id } = getRouterParams(event);

  try {
    const userMeta = await db.prepare([
      'SELECT user_meta.*, user.username FROM user_meta',
      'INNER JOIN user ON user.id = user_meta.user_id',
      'WHERE user.id = ?1'
    ].join(' ')).bind(id).first<UserMeta>();

    if (userMeta) {
      return userMeta;
    } else {
      const user = await db.prepare(`SELECT * FROM user WHERE id = ?1`).bind(id).first<DatabaseUser>();

      if (!user) throw createError({
        message: 'User does not exist',
        statusCode: 400
      });

      return {
        user_id: user.id,
        username: user.username,
        display_name: user.username,
        biography: '',
        avatar: '/default_avatar.webp'
      }
    }
  } catch(e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    })
  }
})
