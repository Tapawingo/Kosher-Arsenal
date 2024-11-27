import { generateId, Lucia } from "lucia";
import { DatabaseUser } from "~/server/utils/db";


export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const db = event.context.db;

	const { password } = await readBody<{
		password: unknown;
	}>(event);

	if (
		typeof password !== "string" ||
		password.length < 8 ||
		password.length > 255
	) {
	  throw createError({ status: 400, message: "Invalid password" });
	}

	try {
		const { token } = event.context.params ?? {
			token: ""
		};

    console.log(`token: ${ token }`);

		const userId = await validatePasswordResetToken(db, token);
		let user = await db.prepare(`SELECT * FROM user WHERE id = ?1`).bind(userId).first<DatabaseUser>();
    if (!user) {
      throw createError({
        message: 'Unknown User',
        statusCode: 400
      });
    }

		await lucia.invalidateUserSessions(user.id);

    const salt = generateId(13);
    const hashedPassword = await new WebCryptoHash().hash(password, salt);
    
    db.prepare(`UPDATE user SET password = ?2, salt = ?3 WHERE id = ?1`).bind(user.id, hashedPassword, salt).run();
		if (!user.email_verified) {
      db.prepare(`UPDATE user SET email_verified = 1 WHERE id = ?1`).bind(user.id).run();
		}

		const session = await lucia.createSession(user.id, {});
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize()
    );
    
		return {};
	} catch (e) {
    console.error(e);
		throw createError({
			message: "Invalid or expired password reset link",
			statusCode: 400
		});
	}
});