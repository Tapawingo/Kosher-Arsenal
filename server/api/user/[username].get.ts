import type { DatabaseUserMeta } from '~/server/utils/db';

interface UserMeta extends DatabaseUserMeta {
  username: string;
}

export default defineEventHandler(async (event): Promise<UserMeta | null> => {
  const db = event.context.db;
  const { username } = getRouterParams(event);

  try {
    const userMeta = await db.prepare([
      'SELECT user_meta.*, user.username FROM user_meta',
      'INNER JOIN user ON user.id = user_meta.user_id',
      'WHERE user.username = ?1 COLLATE NOCASE'
    ].join(' ')).bind(username).first<UserMeta>();

    if (userMeta) {
      return userMeta;
    } else {
      const user = await db.prepare([
        `SELECT user.* FROM user WHERE username = ?1 COLLATE NOCASE`
      ].join(' ')).bind(username).first<DatabaseUser>();

      if (!user) throw 'User does not exist';

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
