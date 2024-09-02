import { WebCryptoHash } from '~/server/utils/webCrypto';
import { initializeDB } from '~/server/utils/db';
import { generateId } from 'lucia';

interface IBody {
  data: {
    username: string;
    password: string;
  }
}

export default eventHandler(async (event) => {
  const lucia = event.context.lucia;
  const db = initializeDB(hubDatabase());
  const { data: body } = await readBody<IBody>(event);
  
  const username = body.username;
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[A-Za-z0-9_-]+$/.test(username)
  ) {
    throw createError({
      message: 'Invalid username',
      statusCode: 400
    });
  }

  const password = body.password;
  if (
    typeof password !== "string" ||
    username.length < 8 ||
    username.length > 255
  ) {
    throw createError({
      message: 'Invalid Password',
      statusCode: 400
    })
  }

  const salt = generateId(13);
  const hashedPassword = await new WebCryptoHash().hash(password, salt);
  const userId = generateId(15);

  try {
    await db.prepare('INSERT INTO user (id, username, password, salt) VALUES(?, ?, ?, ?)')
      .bind(userId, username, hashedPassword, salt).run();
    
      const session = await lucia.createSession(userId, {});
      appendHeader(event,
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize()
      );
  } catch (e: any) {
    throw createError({
      message: e.message,
      statusCode: 500
    });
  }
});