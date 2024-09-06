import { verifyRequestOrigin } from "lucia"
import { initializeLucia } from "../utils/auth"
import type { User, Session } from "lucia"
import { D1Database } from "@nuxthub/core"

let lucia: ReturnType<typeof initializeLucia>

export default defineEventHandler(async (event) => {
  /* CSRF protection */
  if (!isMethod(event, "GET")) {
    const originHeader = getHeader(event, "Origin") ?? null;
    const hostHeader = getHeader(event, "Host") ?? null;
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      return sendNoContent(event, 403);
    }
  }

  /* Initialize auth (Lucia) */
  let { DB } = event.context.cloudflare.env;
  let db = initializeDB(DB);

  if (!lucia) {
    lucia = initializeLucia(db);
  }

  event.context.lucia = lucia;

  /* Set session and user */
  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    event.context.session = null;
    event.context.user = null;
    return;
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    appendResponseHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize()
    );
  }
  if (!session) {
    appendResponseHeader(
      event,
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize()
    );
  }

  /* Get user Settings */
  const settings = await db.prepare('SELECT * FROM user_setting WHERE user_id = ?')
    .bind(user?.id).all<DatabaseUserSetting>();

  event.context.session = session;
  event.context.user = user;
  event.context.settings = settings.results;
})

declare module "h3" {
  interface H3EventContext {
    user: User | null
    session: Session | null
    settings: DatabaseUserSetting[]
    lucia: ReturnType<typeof initializeLucia>
    db: D1Database
  }
}