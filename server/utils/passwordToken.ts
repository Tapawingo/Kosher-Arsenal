import { isWithinExpirationDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import { DatabasePasswordToken } from "./db";
import { D1Database } from "@nuxthub/core";

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generatePasswordResetToken = async (db: D1Database, userId: string) => {
  const storedUserTokens = await db.prepare(`SELECT * FROM password_reset_token WHERE user_id = ?1`).bind(userId).all<DatabasePasswordToken>();
	if (storedUserTokens.results.length > 0) {
		const reusableStoredToken = storedUserTokens.results.find((token: DatabasePasswordToken) => {
			return isWithinExpirationDate(new Date(Number(token.expires) - EXPIRES_IN / 2));
		});
		if (reusableStoredToken) return reusableStoredToken.id;
	}

	const token = generateRandomString(63, alphabet('a-z', '0-9'));
  await db.prepare(
    `INSERT INTO password_reset_token (id, expires, user_id) ` +
    `VALUES (?1, ?2, ?3)`
  ).bind(
    token,
    new Date().getTime() + EXPIRES_IN,
    userId
  ).run();

	return token;
};

export const validatePasswordResetToken = async (db: D1Database, token: string) => {
  let storedToken = await db.prepare(`SELECT * FROM password_reset_token WHERE id = ?1`).bind(token).first();
  if (!storedToken) throw new Error("Invalid token");
  await db.prepare(`DELETE FROM password_reset_token WHERE id = ?1`).bind(token).run();

	const tokenExpires = Number(storedToken.expires);
	if (!isWithinExpirationDate(new Date(tokenExpires))) {
		throw new Error("Expired token");
	}

	return storedToken.user_id;
};