import { Argon2id } from 'oslo/password';

import type { DatabaseUser } from '../../utils/userDB';

interface IBody {
  data: {
    username: string;
    password: string;
  }
}

export default defineEventHandler(async (event) => {
  const db = hubDatabase();
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

  const existingUser = await db.prepare('SELECT * FROM user WHERE username = ?')
    .bind(username).first() as DatabaseUser | undefined;
  
    if(!existingUser) {
      throw createError({
        message: 'Incorrect username or password',
        statusCode: 400
      });
    }

    const validPassword = await new Argon2id().verify(
      existingUser.password,
      password
    );

    if (!validPassword) {
      throw createError({
        message: 'Incorrect username or password',
        statusCode: 400
      });
    }

    const session = await lucia.createSession(existingUser.id, {});
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize()
    );
})
